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
// Approved limits come exclusively from the API payment-config response.
// Preset buttons are suggestions, not an approved minimum or maximum.
