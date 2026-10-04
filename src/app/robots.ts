import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = "https://yarikuru.com";

	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: [
				"/dashboard",
				"/expenses",
				"/budgets",
				"/history",
				"/settings",
				"/api/",
				"/auth/",
				"/reset-password",
				"/forgot-password",
				"/onboarding",
			],
		},
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
