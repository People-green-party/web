/** Canonical Hindi union names → English display labels */
const UNION_NAME_EN: Record<string, string> = {
  'ई-रिक्शा चालक यूनियन': 'E-Rickshaw Drivers Union',
  'हाट व ठेला विक्रेता यूनियन': 'Haat & Thela Vendors Union',
  'राजस्थान गिग वर्कर्स यूनियन': 'Rajasthan Gig Workers Union',
  'राजस्थान वाहन चालक यूनियन': 'Rajasthan Vehicle Drivers Union',
  'पीपल्स ग्रीन असंगठित श्रमिक यूनियन': 'Peoples Green Unorganized Workers Union',
  अन्य: 'Other',
};

/** Show union name in the active UI language (DB stores Hindi canonical values). */
export function localizeUnionName(
  unionName: string | null | undefined,
  language: string,
): string {
  const raw = String(unionName || '').trim();
  if (!raw) return '';
  if (language === 'en') {
    return UNION_NAME_EN[raw] || raw;
  }
  return raw;
}
