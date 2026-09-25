"use client";

import { jsPDF } from "jspdf";
import { SITE_DETAILS } from "./siteDetails";

export type DonationReceipt = {
  donationId: number;
  paymentId: string;
  orderId: string;
  fullName: string;
  amount: number;
  paidAt: string;
  pan?: string;
  receiptToken?: string;
};

export const RECEIPT_STORAGE_KEY = "pgp-latest-donation-receipt";

export function downloadDonationReceipt(receipt: DonationReceipt) {
  if (!Number.isFinite(Number(receipt.amount))) return;

  const receiptAmount = Number(receipt.amount);
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  pdf.setTextColor(4, 51, 11);
  pdf.setFontSize(20);
  pdf.text(SITE_DETAILS.legalName, 20, 24);
  pdf.setFontSize(15);
  pdf.text("Donation Receipt", 20, 35);
  pdf.setDrawColor(197, 220, 207);
  pdf.line(20, 41, 190, 41);
  pdf.setTextColor(40, 55, 44);
  pdf.setFontSize(11);

  const rows = [
    ["Receipt number", `PGP-${receipt.donationId}`],
    ["Donation date", new Date(receipt.paidAt).toLocaleString("en-IN")],
    ["Donor name", receipt.fullName],
    ["Amount", `INR ${receiptAmount.toLocaleString("en-IN")}`],
    ["Payment ID", receipt.paymentId],
    ["Order ID", receipt.orderId],
    ...(receipt.pan ? [["PAN", receipt.pan]] : []),
    ["Payment status", "Confirmed"],
  ];

  rows.forEach(([label, value], index) => {
    const y = 53 + index * 10;
    pdf.setFont("helvetica", "bold");
    pdf.text(`${label}:`, 20, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(String(value), 62, y);
  });

  pdf.setFontSize(9);
  pdf.setTextColor(88, 126, 103);
  const note = "This receipt acknowledges a verified non-cash political contribution. Tax-deduction eligibility depends on the donor's circumstances.";
  pdf.text(pdf.splitTextToSize(note, 170), 20, 145);
  pdf.text(`${SITE_DETAILS.legalName}, ${SITE_DETAILS.address}`, 20, 172, { maxWidth: 170 });
  pdf.text(`Contact: ${SITE_DETAILS.email}`, 20, 184);
  pdf.save(`PGP-donation-receipt-${receipt.donationId}.pdf`);
}
