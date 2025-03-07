/**
 * This file contains the bond data extracted from the PDF document
 * "CONDICIONES DE EMISIÓN DE LOS TÍTULOS NUEVOS"
 */

import { Bond } from "./models.js";

// Helper function to create a date (handles timezone issues)
const createDate = (year: number, month: number, day: number): Date => {
  return new Date(Date.UTC(year, month - 1, day));
};

// Common issue date for all bonds
const ISSUE_DATE = createDate(2020, 9, 4);

// Common interest payment months for all bonds
const INTEREST_PAYMENT_MONTHS = [1, 7]; // January and July

export const BONDS: Bond[] = [
  // A. BONOS GLOBALES DE LA REPÚBLICA ARGENTINA AMORTIZABLES EN DÓLARES ESTADOUNIDENSES STEP UP 2030
  {
    id: "USD-STEP-UP-2030",
    name: "Bonos Globales de la República Argentina Amortizables en Dólares Estadounidenses Step Up 2030",
    currency: "USD",
    issueDate: ISSUE_DATE,
    maxAmount: 16830, // USD 16,830 million
    interestRatePeriods: [
      {
        startDate: ISSUE_DATE,
        endDate: createDate(2021, 7, 9),
        rate: 0.00125, // 0.125%
      },
      {
        startDate: createDate(2021, 7, 9),
        endDate: createDate(2023, 7, 9),
        rate: 0.005, // 0.50%
      },
      {
        startDate: createDate(2023, 7, 9),
        endDate: createDate(2027, 7, 9),
        rate: 0.0075, // 0.75%
      },
      {
        startDate: createDate(2027, 7, 9),
        endDate: createDate(2030, 7, 9),
        rate: 0.0175, // 1.75%
      },
    ],
    amortizationSchedule: [
      { date: createDate(2024, 7, 9), percentage: 0.04 }, // 4%
      // 12 equal payments of 8% each
      ...Array.from({ length: 12 }, (_, i) => ({
        date: createDate(2025 + Math.floor(i / 2), i % 2 === 0 ? 1 : 7, 9),
        percentage: 0.08,
      })),
    ],
    interestPaymentMonths: INTEREST_PAYMENT_MONTHS,
  },

  // B. BONOS GLOBALES DE LA REPÚBLICA ARGENTINA AMORTIZABLES EN DÓLARES ESTADOUNIDENSES STEP UP 2035
  {
    id: "USD-STEP-UP-2035",
    name: "Bonos Globales de la República Argentina Amortizables en Dólares Estadounidenses Step Up 2035",
    currency: "USD",
    issueDate: ISSUE_DATE,
    maxAmount: 25689, // USD 25,689 million
    interestRatePeriods: [
      {
        startDate: ISSUE_DATE,
        endDate: createDate(2021, 7, 9),
        rate: 0.00125, // 0.125%
      },
      {
        startDate: createDate(2021, 7, 9),
        endDate: createDate(2022, 7, 9),
        rate: 0.01125, // 1.125%
      },
      {
        startDate: createDate(2022, 7, 9),
        endDate: createDate(2023, 7, 9),
        rate: 0.015, // 1.50%
      },
      {
        startDate: createDate(2023, 7, 9),
        endDate: createDate(2024, 7, 9),
        rate: 0.03625, // 3.625%
      },
      {
        startDate: createDate(2024, 7, 9),
        endDate: createDate(2027, 7, 9),
        rate: 0.04125, // 4.125%
      },
      {
        startDate: createDate(2027, 7, 9),
        endDate: createDate(2028, 7, 9),
        rate: 0.0475, // 4.75%
      },
      {
        startDate: createDate(2028, 7, 9),
        endDate: createDate(2035, 7, 9),
        rate: 0.05, // 5.00%
      },
    ],
    amortizationSchedule: [
      // 10 equal payments
      ...Array.from({ length: 10 }, (_, i) => ({
        date: createDate(2031 + Math.floor(i / 2), i % 2 === 0 ? 1 : 7, 9),
        percentage: 0.1,
      })),
    ],
    interestPaymentMonths: INTEREST_PAYMENT_MONTHS,
  },

  // C. BONOS GLOBALES DE LA REPÚBLICA ARGENTINA AMORTIZABLES EN DÓLARES ESTADOUNIDENSES STEP UP 2038
  {
    id: "USD-STEP-UP-2038",
    name: "Bonos Globales de la República Argentina Amortizables en Dólares Estadounidenses Step Up 2038",
    currency: "USD",
    issueDate: ISSUE_DATE,
    maxAmount: 12414, // USD 12,414 million
    interestRatePeriods: [
      {
        startDate: ISSUE_DATE,
        endDate: createDate(2021, 7, 9),
        rate: 0.00125, // 0.125%
      },
      {
        startDate: createDate(2021, 7, 9),
        endDate: createDate(2022, 7, 9),
        rate: 0.02, // 2.00%
      },
      {
        startDate: createDate(2022, 7, 9),
        endDate: createDate(2023, 7, 9),
        rate: 0.03875, // 3.875%
      },
      {
        startDate: createDate(2023, 7, 9),
        endDate: createDate(2024, 7, 9),
        rate: 0.0425, // 4.25%
      },
      {
        startDate: createDate(2024, 7, 9),
        endDate: createDate(2038, 7, 9),
        rate: 0.05, // 5.00%
      },
    ],
    amortizationSchedule: [
      // 22 equal payments
      ...Array.from({ length: 22 }, (_, i) => ({
        date: createDate(2027 + Math.floor(i / 2), i % 2 === 0 ? 7 : 1, 9),
        percentage: 1 / 22,
      })),
    ],
    interestPaymentMonths: INTEREST_PAYMENT_MONTHS,
  },

  // D. BONOS GLOBALES DE LA REPÚBLICA ARGENTINA AMORTIZABLES EN DÓLARES ESTADOUNIDENSES STEP UP 2041
  {
    id: "USD-STEP-UP-2041",
    name: "Bonos Globales de la República Argentina Amortizables en Dólares Estadounidenses Step Up 2041",
    currency: "USD",
    issueDate: ISSUE_DATE,
    maxAmount: 18633, // USD 18,633 million
    interestRatePeriods: [
      {
        startDate: ISSUE_DATE,
        endDate: createDate(2021, 7, 9),
        rate: 0.00125, // 0.125%
      },
      {
        startDate: createDate(2021, 7, 9),
        endDate: createDate(2022, 7, 9),
        rate: 0.025, // 2.50%
      },
      {
        startDate: createDate(2022, 7, 9),
        endDate: createDate(2029, 7, 9),
        rate: 0.035, // 3.50%
      },
      {
        startDate: createDate(2029, 7, 9),
        endDate: createDate(2041, 7, 9),
        rate: 0.04875, // 4.875%
      },
    ],
    amortizationSchedule: [
      // 28 equal payments
      ...Array.from({ length: 28 }, (_, i) => ({
        date: createDate(2028 + Math.floor(i / 2), i % 2 === 0 ? 1 : 7, 9),
        percentage: 1 / 28,
      })),
    ],
    interestPaymentMonths: INTEREST_PAYMENT_MONTHS,
  },

  // E. BONOS GLOBALES DE LA REPÚBLICA ARGENTINA AMORTIZABLES EN DÓLARES ESTADOUNIDENSES STEP UP 2046
  {
    id: "USD-STEP-UP-2046",
    name: "Bonos Globales de la República Argentina Amortizables en Dólares Estadounidenses Step Up 2046",
    currency: "USD",
    issueDate: ISSUE_DATE,
    maxAmount: 45686, // USD 45,686 million
    interestRatePeriods: [
      {
        startDate: ISSUE_DATE,
        endDate: createDate(2021, 7, 9),
        rate: 0.00125, // 0.125%
      },
      {
        startDate: createDate(2021, 7, 9),
        endDate: createDate(2022, 7, 9),
        rate: 0.01125, // 1.125%
      },
      {
        startDate: createDate(2022, 7, 9),
        endDate: createDate(2023, 7, 9),
        rate: 0.015, // 1.50%
      },
      {
        startDate: createDate(2023, 7, 9),
        endDate: createDate(2024, 7, 9),
        rate: 0.03625, // 3.625%
      },
      {
        startDate: createDate(2024, 7, 9),
        endDate: createDate(2027, 7, 9),
        rate: 0.04125, // 4.125%
      },
      {
        startDate: createDate(2027, 7, 9),
        endDate: createDate(2028, 7, 9),
        rate: 0.04375, // 4.375%
      },
      {
        startDate: createDate(2028, 7, 9),
        endDate: createDate(2046, 7, 9),
        rate: 0.05, // 5.00%
      },
    ],
    amortizationSchedule: [
      // 44 equal payments
      ...Array.from({ length: 44 }, (_, i) => ({
        date: createDate(2025 + Math.floor(i / 2), i % 2 === 0 ? 1 : 7, 9),
        percentage: 1 / 44,
      })),
    ],
    interestPaymentMonths: INTEREST_PAYMENT_MONTHS,
  },

  // F. BONOS GLOBALES DE LA REPÚBLICA ARGENTINA AMORTIZABLES EN EUROS STEP UP 2030
  {
    id: "EUR-STEP-UP-2030",
    name: "Bonos Globales de la República Argentina Amortizables en Euros Step Up 2030",
    currency: "EUR",
    issueDate: ISSUE_DATE,
    maxAmount: 3100, // EUR 3,100 million
    interestRatePeriods: [
      {
        startDate: ISSUE_DATE,
        endDate: createDate(2030, 7, 9),
        rate: 0.00125, // 0.125%
      },
    ],
    amortizationSchedule: [
      { date: createDate(2024, 7, 9), percentage: 0.04 }, // 4%
      // 12 equal payments of 8% each
      ...Array.from({ length: 12 }, (_, i) => ({
        date: createDate(2025 + Math.floor(i / 2), i % 2 === 0 ? 1 : 7, 9),
        percentage: 0.08,
      })),
    ],
    interestPaymentMonths: INTEREST_PAYMENT_MONTHS,
  },

  // Add more bonds as needed...
];

// Export a function to get all bonds
export const getAllBonds = (): Bond[] => {
  return BONDS;
};

// Export a function to get a bond by ID
export const getBondById = (id: string): Bond | undefined => {
  return BONDS.find((bond) => bond.id === id);
};
