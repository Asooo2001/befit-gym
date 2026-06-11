export type Gender = "female" | "male";

export const PASS_DURATIONS = [
  { id: "1day", days: 1 },
  { id: "1week", days: 7 },
  { id: "1month", days: 30 },
  { id: "3months", days: 90 },
  { id: "6months", days: 180 },
  { id: "1year", days: 365 },
] as const;

export type PassDurationId = (typeof PASS_DURATIONS)[number]["id"];

// Prices are the single source of truth — never trust the value sent by the client.
export const PASS_PRICES: Record<Gender, Record<PassDurationId, number>> = {
  female: { "1day": 4, "1week": 12, "1month": 25, "3months": 65, "6months": 120, "1year": 220 },
  male: { "1day": 5, "1week": 15, "1month": 29, "3months": 75, "6months": 140, "1year": 260 },
};

const GENDER_LABEL: Record<Gender, string> = { female: "Female", male: "Male" };

const DURATION_LABEL: Record<PassDurationId, string> = {
  "1day": "1 Day",
  "1week": "1 Week",
  "1month": "1 Month",
  "3months": "3 Months",
  "6months": "6 Months",
  "1year": "1 Year",
};

export interface MembershipPackage {
  id: string;
  gender: Gender;
  durationId: PassDurationId;
  days: number;
  price: number;
  name: string;
}

export const MEMBERSHIP_PACKAGES: MembershipPackage[] = (["female", "male"] as const).flatMap((gender) =>
  PASS_DURATIONS.map(({ id, days }) => ({
    id: `${gender}-${id}`,
    gender,
    durationId: id,
    days,
    price: PASS_PRICES[gender][id],
    name: `${GENDER_LABEL[gender]} – ${DURATION_LABEL[id]}`,
  }))
);

export function getPackageById(id: string): MembershipPackage | undefined {
  return MEMBERSHIP_PACKAGES.find((pkg) => pkg.id === id);
}

export function getPackageByName(name: string): MembershipPackage | undefined {
  return MEMBERSHIP_PACKAGES.find((pkg) => pkg.name === name);
}
