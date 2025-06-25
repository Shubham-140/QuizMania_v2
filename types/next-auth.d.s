import "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null;
      age?: number | null;
      quizAttended?: number;
      createdAt?: Date;
      profilePic?: string | null;
      role?: string;
      gitHubId?: string | null;
      gitHubUsername?: string | null;
      gitHubAvatarUrl?: string | null;
    };
  }
}