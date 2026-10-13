import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/**
 * The API stays out of the index, except the media and document files it serves: product photos must be
 * crawlable for Google Images (they are linked from the image sitemap and og:image) and the spec-sheet PDFs
 * rank for "RIPPA R10 spec sheet" searches. The longer `allow` path wins over `/api/` under Google's rules.
 */
const allow = ["/", "/api/media/", "/api/documents/"];
const disallow = ["/api/", "/admin", "/quote", "/search"];

/**
 * Search engines and AI answer engines are all welcome (the dealership wants to be cited for RIPPA questions);
 * the admin, APIs and the two form/result pages stay out of the index. See also /llms.txt.
 */
const aiCrawlers = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "anthropic-ai", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot", "Applebot-Extended", "DuckAssistBot", "Amazonbot", "meta-externalagent", "CCBot", "cohere-ai", "MistralAI-User", "YouBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow, disallow },
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow, disallow })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
