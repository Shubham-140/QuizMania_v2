import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "./site";
import robots from "../app/robots";
import sitemap from "../app/sitemap";

describe("resolveSiteUrl", () => {
  it("prefers an explicit SITE_URL", () => {
    expect(
      resolveSiteUrl({
        SITE_URL: "https://quiz.example.com",
        NEXTAUTH_URL: "https://auth.example.com",
      }).origin
    ).toBe("https://quiz.example.com");
  });

  it("falls back to NEXTAUTH_URL, then the Vercel production URL", () => {
    expect(resolveSiteUrl({ NEXTAUTH_URL: "https://auth.example.com" }).origin).toBe(
      "https://auth.example.com"
    );
    expect(
      resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "quizmania.vercel.app" }).origin
    ).toBe("https://quizmania.vercel.app");
  });

  it("uses localhost when nothing is configured", () => {
    expect(resolveSiteUrl({}).origin).toBe("http://localhost:3000");
  });
});

describe("robots and sitemap", () => {
  it("keeps private pages out of search engines and points to the sitemap", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;

    expect(rules.disallow).toEqual(["/api/", "/quiz/", "/settings"]);
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });

  it("lists only public pages", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);

    expect(paths).toEqual(["/", "/about", "/rules", "/feedback"]);
  });
});
