export const SITE_DETAILS = {
  legalName: "Indian Peoples Green Party",
  shortName: "PGP",
  email: "partypeoplesgreen@gmail.com",
  phone: "9521627701",
  address: "Ham Badlenge Bhawan, 02 Mission Compound, Ajmer Puliya, Jaipur, Rajasthan",
  addressHi: "हम बदलेंगे भवन, 02 मिशन कंपाउंड, अजमेर पुलिया, जयपुर, राजस्थान",
  addressLines: [
    "Ham Badlenge Bhawan, 02 Mission Compound,",
    "Ajmer Puliya, Jaipur, Rajasthan",
  ],
  addressLinesHi: [
    "हम बदलेंगे भवन, 02 मिशन कंपाउंड,",
    "अजमेर पुलिया, जयपुर, राजस्थान",
  ],
  website: "https://peoplesgreen.org",
} as const;

export const DONATION_PRESET_AMOUNTS = [500, 1000, 2000] as const;
export const MIN_DONATION_AMOUNT = 1;

const configuredMaximum = Number(process.env.NEXT_PUBLIC_DONATION_MAX_AMOUNT);

/**
 * TODO(PGP compliance): Set NEXT_PUBLIC_DONATION_MAX_AMOUNT after the party's
 * authorised team approves the maximum per-transaction contribution amount.
 */
export const MAX_DONATION_AMOUNT =
  Number.isSafeInteger(configuredMaximum) && configuredMaximum >= MIN_DONATION_AMOUNT
    ? configuredMaximum
    : null;
