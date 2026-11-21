type SiteEnv = {
  SITE_URL?: string;
  NEXTAUTH_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
};

export function resolveSiteUrl(env: SiteEnv) {
  const vercelUrl = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const url =
    env.SITE_URL?.trim() ||
    env.NEXTAUTH_URL?.trim() ||
    (vercelUrl ? `https://${vercelUrl}` : "") ||
    "http://localhost:3000";
  return new URL(url);
}

export const siteUrl = resolveSiteUrl(process.env);

export const siteName = "QuizMania";
export const siteDescription =
  "Timed quizzes across ten categories and three difficulty levels, with a full answer review after every quiz.";

export const openGraphImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "QuizMania: timed quizzes across ten categories",
};

export const sharedOpenGraph = {
  siteName,
  locale: "en_US",
  images: [openGraphImage],
};

export const sharedTwitter = {
  card: "summary_large_image" as const,
  images: [openGraphImage.url],
};

export const publicPages = ["/", "/about", "/rules", "/feedback"];

export const privatePaths = ["/api/", "/quiz/", "/settings"];
