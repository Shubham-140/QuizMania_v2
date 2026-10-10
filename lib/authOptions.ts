import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

interface GitHubProfile {
  id?: number | string;
  login?: string;
  avatar_url?: string;
  name?: string | null;
  email?: string | null;
}

const githubClientId = process.env.GITHUB_CLIENT_ID?.trim();
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET?.trim();

function serializeUserForToken(user: {
  id: number;
  name: string | null;
  email: string | null;
  username: string | null;
  age: number | null;
  quizAttended: number;
  createdAt: Date;
  profilePic: string | null;
  role: string;
  gitHubId: string | null;
  gitHubUsername: string | null;
  gitHubAvatarUrl: string | null;
  password?: string | null;
}) {
  const { password: _ignore, ...rest } = user;
  return {
    ...rest,
    createdAt: user.createdAt.toISOString(),
  };
}

async function upsertGitHubUser(
  githubId: string,
  githubProfile: GitHubProfile
) {
  // Raw GitHub profile has `login`; normalized profile may only have `name`
  const login =
    githubProfile.login ||
    githubProfile.name ||
    `gh_${githubId.slice(-6)}`;

  let existingUser = await prisma.user.findUnique({
    where: { gitHubId: githubId },
  });

  if (!existingUser && githubProfile.email) {
    existingUser = await prisma.user.findUnique({
      where: { email: githubProfile.email },
    });
  }

  if (!existingUser) {
    const usernameTaken = await prisma.user.findUnique({
      where: { username: login },
    });

    return prisma.user.create({
      data: {
        gitHubId: githubId,
        gitHubUsername: githubProfile.login ?? login,
        gitHubAvatarUrl: githubProfile.avatar_url ?? null,
        name: githubProfile.name ?? login,
        email: githubProfile.email ?? null,
        username: usernameTaken
          ? `${login}_${githubId.slice(-4)}`
          : login,
      },
    });
  }

  let username = existingUser.username;
  if (!username) {
    const usernameTaken = await prisma.user.findUnique({
      where: { username: login },
    });
    username = usernameTaken ? `${login}_${githubId.slice(-4)}` : login;
  }

  return prisma.user.update({
    where: { id: existingUser.id },
    data: {
      gitHubId: githubId,
      gitHubUsername: githubProfile.login ?? existingUser.gitHubUsername ?? login,
      gitHubAvatarUrl: githubProfile.avatar_url ?? existingUser.gitHubAvatarUrl,
      name: existingUser.name ?? githubProfile.name ?? login,
      username,
    },
  });
}

const useSecureCookies =
  process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET?.trim(),
  useSecureCookies,
  providers: [
    GitHubProvider({
      clientId: githubClientId!,
      clientSecret: githubClientSecret!,
      // Required after GitHub RFC 9207 (`iss` in OAuth callback)
      issuer: "https://github.com/login/oauth",
      // Avoid PKCE cookie issues on localhost / App Router
      checks: ["state"],
      // Keep raw GitHub fields available to callbacks
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          login: profile.login,
          username: profile.login,
        } as unknown as {
          id: number;
          name?: string | null;
          email?: string | null;
          image?: string | null;
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const username = credentials.username.trim();
        const password = credentials.password;
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user?.password) return null;

        const isPasswordCorrect = await bcrypt.compare(
          password,
          user.password
        );
        if (!isPasswordCorrect) return null;

        const { password: _ignore, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  cookies: {
    state: {
      name: useSecureCookies
        ? "__Secure-next-auth.state"
        : "next-auth.state",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        maxAge: 60 * 15,
      },
    },
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      try {
        if (account?.provider === "github") {
          const githubId = account.providerAccountId;
          const githubProfile = profile as GitHubProfile;
          const dbUser = await upsertGitHubUser(githubId, githubProfile);
          return { ...token, ...serializeUserForToken(dbUser) };
        }

        if (user) {
          return {
            ...token,
            ...user,
            createdAt:
              user.createdAt instanceof Date
                ? user.createdAt.toISOString()
                : user.createdAt,
          };
        }
        return token;
      } catch (error) {
        console.error(
          "jwt callback error:",
          error instanceof Error ? error.message : "unknown"
        );
        throw error;
      }
    },
    async session({ session, token }) {
      session.user = {
        id: Number(token.id),
        name: token.name,
        email: token.email,
        username: (token.username as string | null) ?? null,
        age: (token.age as number | null) ?? null,
        quizAttended: (token.quizAttended as number) ?? 0,
        createdAt: token.createdAt as Date,
        profilePic: (token.profilePic as string | null) ?? null,
        role: (token.role as string) ?? "user",
        gitHubId: (token.gitHubId as string | null) ?? null,
        gitHubUsername: (token.gitHubUsername as string | null) ?? null,
        gitHubAvatarUrl: (token.gitHubAvatarUrl as string | null) ?? null,
      };
      return session;
    },
    async signIn({ account, profile, user }) {
      try {
        if (account?.provider !== "github") return true;

        const githubProfile = profile as GitHubProfile;
        const githubId = account.providerAccountId;
        // profile here is the RAW GitHub userinfo (has login)
        // user may include our custom profile() fields
        const login =
          githubProfile?.login ||
          (user as { login?: string; username?: string })?.login ||
          (user as { username?: string })?.username;

        if (!githubId || !login) {
          console.error("GitHub profile missing id/login");
          return false;
        }

        await upsertGitHubUser(githubId, {
          ...githubProfile,
          login,
        });
        return true;
      } catch (error) {
        console.error(
          "GitHub signIn error:",
          error instanceof Error ? error.message : "unknown"
        );
        return false;
      }
    },
  },
};
