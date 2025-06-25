import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
// import { GitHubProfile } from "@/types/next-auth";

interface GitHubProfile {
  id: number;
  login: string;
  avatar_url: string;
  name: string;
  email: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const { username, password } = credentials;
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(
          password,
          user.password ?? ""
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
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as number,
        name: token.name,
        email: token.email,
        username: token.username as string | null,
        age: token.age as number | null,
        quizAttended: token.quizAttended as number,
        createdAt: token.createdAt as Date,
        profilePic: token.profilePic as string | null,
        role: token.role as string,
        gitHubId: token.gitHubId as string | null,
        gitHubUsername: token.gitHubUsername as string | null,
        gitHubAvatarUrl: token.gitHubAvatarUrl as string | null,
      };
      return session;
    },
    async signIn({ account, profile }) {
      try {
        if (account?.provider === "github") {
          const githubProfile = profile as GitHubProfile;
          const githubId = githubProfile.id.toString();

          let existingUser = await prisma.user.findUnique({
            where: { gitHubId: githubId },
          });

          if (!existingUser && githubProfile.email) {
            existingUser = await prisma.user.findUnique({
              where: { email: githubProfile.email },
            });
          }

          if (!existingUser) {
            await prisma.user.create({
              data: {
                gitHubId: githubId,
                gitHubUsername: githubProfile.login,
                gitHubAvatarUrl: githubProfile.avatar_url,
                name: githubProfile.name,
                email: githubProfile.email,
              },
            });
          }

          return true;
        }

        return true;
      } catch (error) {
        console.error("GitHub signIn error:", error);
        return false;
      }
    },
  },
};
