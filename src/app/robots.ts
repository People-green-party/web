import type { MetadataRoute } from "next";
import { SITE_DETAILS } from "../lib/siteDetails";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/dashboard",
          "/dashboard/",
          "/login",
          "/verifynumber",
          "/profile/",
          "/internship/status",
          "/internship/application-status",
          "/internship/dashboard",
          "/internship/dashboard/",
          "/union/login",
          "/union/dashboard",
          "/union/dashboard/",
          "/youth-front/login",
          "/youth-front/my-dashboard",
          "/youth-front/my-dashboard/",
          "/zinda-youth/login",
          "/zinda-youth/my-dashboard",
          "/zinda-youth/my-dashboard/",
        ],
      },
    ],
    sitemap: `${SITE_DETAILS.website}/sitemap.xml`,
    host: SITE_DETAILS.website,
  };
}
