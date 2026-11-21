import type { MetadataRoute } from "next";
import { privatePaths, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: privatePaths,
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
