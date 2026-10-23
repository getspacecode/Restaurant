import type { Staff } from "@/types";

const hoursAgo = (h: number) => Date.now() - h * 3600000;

// SAMPLE DATA
export const staff: Staff[] = [
  {
    id: "s1",
    name: "Marko K.",
    username: "marko",
    role: "Owner",
    active: true,
    lastLogin: hoursAgo(1),
  },
  {
    id: "s2",
    name: "Jelena S.",
    username: "jelena",
    role: "Manager",
    active: true,
    lastLogin: hoursAgo(5),
  },
  {
    id: "s3",
    name: "Dragan P.",
    username: "dragan",
    role: "Chef",
    active: true,
    lastLogin: hoursAgo(26),
  },
  {
    id: "s4",
    name: "Nina M.",
    username: "nina",
    role: "Waiter",
    active: true,
    lastLogin: hoursAgo(72),
  },
  {
    id: "s5",
    name: "Vuk T.",
    username: "vuk",
    role: "Cashier",
    active: false,
    lastLogin: hoursAgo(24 * 40),
  },
];
