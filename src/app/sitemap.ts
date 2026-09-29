import type { MetadataRoute } from "next";
import { SITE_DETAILS } from "../lib/siteDetails";

const publicRoutes = [
  "",
  "/about",
  "/constitution",
  "/contact",
  "/declaration",
  "/delivery-shipping-policy",
  "/donation",
  "/internship",
  "/internship/faq",
  "/jaipur-vision",
  "/join",
  "/leaders",
  "/news",
  "/our-vision",
  "/press",
  "/privacy-policy",
  "/refund-cancellation-policy",
  "/terms-and-conditions",
  "/union",
  "/vision/civil-liberties",
  "/vision/empowerment",
  "/vision/entrepreneurship",
  "/vision/farming",
  "/vision/jaipur-2040",
  "/vision/living-standards",
  "/vision/nature",
  "/vision/open-economy",
  "/vision/urban-rural",
  "/zinda-youth",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: `${SITE_DETAILS.website}${route}`,
    lastModified,
    changeFrequency: route === "" || route === "/news" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/donation" ? 0.9 : 0.7,
  }));
}
