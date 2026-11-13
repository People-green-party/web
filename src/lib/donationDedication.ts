import type { DedicationCertificateData } from "./dedicationCertificate";
import type { DonationReceipt } from "./donationReceipt";

// Call only with a live receipt returned by successful server verification.
// Missing or inconsistent server metadata never falls back to donor-form state.
export function dedicationFromVerifiedReceipt(receipt: Partial<DonationReceipt> | null | undefined): DedicationCertificateData | null {
  if (!receipt || receipt.fund !== "green-fund" ||
      !Number.isSafeInteger(receipt.donationId) || Number(receipt.donationId) <= 0 ||
      typeof receipt.paymentId !== "string" || !receipt.paymentId.trim() ||
      typeof receipt.fullName !== "string" || !receipt.fullName.trim() ||
      !Number.isSafeInteger(receipt.plantCount) || Number(receipt.plantCount) <= 0 ||
      !Number.isSafeInteger(receipt.amount) || receipt.amount !== Number(receipt.plantCount) * 1500 ||
      typeof receipt.dedicationName !== "string" || !receipt.dedicationName.trim() ||
      (receipt.dedicationOccasion != null && typeof receipt.dedicationOccasion !== "string") ||
      typeof receipt.paidAt !== "string" || !Number.isFinite(Date.parse(receipt.paidAt))) {
    return null;
  }
  return {
    donationId: Number(receipt.donationId), paymentId: receipt.paymentId, donorName: receipt.fullName,
    dedicatedName: receipt.dedicationName.trim(), occasion: receipt.dedicationOccasion?.trim() || "",
    plantCount: Number(receipt.plantCount), paidAt: receipt.paidAt,
  };
}
