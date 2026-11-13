export const EMPTY_DONATION_FORM = {
  citizen: "" as "" | "yes" | "no",
  fullName: "", phone: "", pan: "", amount: "", address: "",
  state: "", city: "", pincode: "",
};

export function parseDonationFormDraft(raw: string | null): typeof EMPTY_DONATION_FORM {
  const form = { ...EMPTY_DONATION_FORM };
  try {
    const saved: unknown = JSON.parse(raw || "null");
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return form;
    const values = saved as Record<string, unknown>;
    for (const key of Object.keys(form) as (keyof typeof form)[]) {
      if (key === "citizen") {
        if (values[key] === "yes" || values[key] === "no") form.citizen = values[key];
      } else if (typeof values[key] === "string") form[key] = values[key];
    }
  } catch { /* Invalid storage must not break the donation page. */ }
  return form;
}
