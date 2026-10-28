"use client";

import { jsPDF } from "jspdf";
import { SITE_DETAILS } from "./siteDetails";

export interface DedicationCertificateData {
  donationId: number | string;
  paymentId: string;
  donorName: string;
  dedicatedName: string;
  occasion: string;
  plantCount: number;
  paidAt?: string;
}

export const DEDICATION_STORAGE_PREFIX = "pgp-plant-dedication-";

export function downloadDedicationCertificate(data: DedicationCertificateData) {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4", // 297mm x 210mm
  });

  const width = 297;
  const height = 210;

  // Background
  pdf.setFillColor(252, 254, 252);
  pdf.rect(0, 0, width, height, "F");

  // Outer Decorative Border
  pdf.setDrawColor(4, 51, 11);
  pdf.setLineWidth(1.5);
  pdf.rect(10, 10, width - 20, height - 20);

  // Inner Thin Border
  pdf.setDrawColor(197, 220, 207);
  pdf.setLineWidth(0.6);
  pdf.rect(13, 13, width - 26, height - 26);

  // Corner accents
  pdf.setFillColor(11, 90, 42);
  pdf.rect(10, 10, 5, 5, "F");
  pdf.rect(width - 15, 10, 5, 5, "F");
  pdf.rect(10, height - 15, 5, 5, "F");
  pdf.rect(width - 15, height - 15, 5, 5, "F");

  // Top Organization Branding
  pdf.setTextColor(4, 51, 11);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text(SITE_DETAILS.legalName.toUpperCase(), width / 2, 26, { align: "center" });

  pdf.setTextColor(11, 90, 42);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("THE GREAT GREEN WALL MISSION · ARAVALLI RESTORATION INITIATIVE", width / 2, 33, { align: "center" });

  // Main Certificate Title
  pdf.setTextColor(4, 51, 11);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(26);
  pdf.text("CERTIFICATE OF PLANT DEDICATION", width / 2, 48, { align: "center" });

  // Subtitle
  pdf.setTextColor(88, 126, 103);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text("This official digital certificate verifies that native tree plantation has been sponsored in honor of", width / 2, 57, { align: "center" });

  // Recipient / Dedicated Name in large bold
  pdf.setTextColor(4, 51, 11);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.text(data.dedicatedName.trim(), width / 2, 73, { align: "center" });

  // Underline for name
  pdf.setDrawColor(22, 163, 74);
  pdf.setLineWidth(0.8);
  const nameWidth = pdf.getTextWidth(data.dedicatedName.trim());
  const lineStart = Math.max(width / 2 - nameWidth / 2 - 10, 50);
  const lineEnd = Math.min(width / 2 + nameWidth / 2 + 10, width - 50);
  pdf.line(lineStart, 77, lineEnd, 77);

  // Occasion & Details
  pdf.setTextColor(40, 55, 44);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  const countText = data.plantCount === 1 ? "1 Native Plant" : `${data.plantCount} Native Plants`;
  const occasionText = data.occasion ? `on the auspicious occasion of ${data.occasion}` : "as a lifelong ecological tribute";
  pdf.text(`${occasionText}, contributing directly to long-term restoration in vulnerable Aravalli landscapes.`, width / 2, 88, { align: "center" });

  // Dedication Summary Box
  pdf.setFillColor(243, 249, 245);
  pdf.setDrawColor(212, 235, 217);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(45, 96, width - 90, 48, 4, 4, "FD");

  pdf.setFontSize(10.5);
  pdf.setTextColor(4, 51, 11);
  pdf.setFont("helvetica", "bold");

  const leftColX = 55;
  const rightColX = 160;

  pdf.text("Sponsored by:", leftColX, 108);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.donorName || "Supporter of People's Green", leftColX + 35, 108);

  pdf.setFont("helvetica", "bold");
  pdf.text("Plant Quantity:", leftColX, 118);
  pdf.setFont("helvetica", "normal");
  pdf.text(`${countText} (Long-term Maintenance Protected)`, leftColX + 35, 118);

  pdf.setFont("helvetica", "bold");
  pdf.text("Plantation Zone:", leftColX, 128);
  pdf.setFont("helvetica", "normal");
  pdf.text("Aravalli Semi-Arid Ecological Corridor, Rajasthan", leftColX + 35, 128);

  pdf.setFont("helvetica", "bold");
  pdf.text("Dedication Code:", rightColX, 108);
  pdf.setFont("helvetica", "normal");
  pdf.text(`PGP-GW-${data.donationId}`, rightColX + 38, 108);

  pdf.setFont("helvetica", "bold");
  pdf.text("Payment Ref:", rightColX, 118);
  pdf.setFont("helvetica", "normal");
  const shortPayment = data.paymentId ? data.paymentId.slice(0, 18) : "Verified Online";
  pdf.text(shortPayment, rightColX + 38, 118);

  pdf.setFont("helvetica", "bold");
  pdf.text("Issued On:", rightColX, 128);
  pdf.setFont("helvetica", "normal");
  const dateStr = data.paidAt ? new Date(data.paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  pdf.text(dateStr, rightColX + 38, 128);

  // Mission pledge statement
  pdf.setTextColor(88, 126, 103);
  pdf.setFontSize(8.5);
  pdf.text("Phase One Goal: 1,00,00,000 Plants. Each plant is assigned a geo-tracked location and managed through scheduled field care.", width / 2, 156, { align: "center" });

  // Signatures / Seals
  pdf.setDrawColor(197, 220, 207);
  pdf.setLineWidth(0.5);

  // Left Sign
  pdf.line(45, 182, 105, 182);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(4, 51, 11);
  pdf.text("CONVENOR · ECOLOGICAL RESTORATION", 75, 188, { align: "center" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(88, 126, 103);
  pdf.text("Great Green Wall Mission, PGP", 75, 193, { align: "center" });

  // Center Emblem / Stamp text
  pdf.setFillColor(234, 246, 238);
  pdf.setDrawColor(22, 163, 74);
  pdf.circle(width / 2, 182, 12, "FD");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(11, 90, 42);
  pdf.text("VERIFIED", width / 2, 180, { align: "center" });
  pdf.text("GREEN RECORD", width / 2, 185, { align: "center" });

  // Right Sign
  pdf.line(width - 105, 182, width - 45, 182);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(4, 51, 11);
  pdf.text("INDIAN PEOPLES GREEN PARTY", width - 75, 188, { align: "center" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(88, 126, 103);
  pdf.text("National Central Committee", width - 75, 193, { align: "center" });

  // Save PDF
  const safeName = data.dedicatedName.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 30);
  pdf.save(`PGP-Dedication-Certificate-${safeName || "Plant"}.pdf`);
}
