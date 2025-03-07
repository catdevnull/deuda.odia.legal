/**
 * This file contains the data structures for bond information
 * and cash flow calculations.
 */

/**
 * Represents an interest rate period for a bond
 */
export interface InterestRatePeriod {
  startDate: Date;
  endDate: Date;
  rate: number; // Annual interest rate as a decimal (e.g., 0.0125 for 1.25%)
}

/**
 * Represents an amortization payment
 */
export interface AmortizationPayment {
  date: Date;
  percentage: number; // Percentage of principal as a decimal (e.g., 0.08 for 8%)
}

/**
 * Represents a bond with its characteristics
 */
export interface Bond {
  id: string;
  name: string;
  currency: "USD" | "EUR";
  issueDate: Date;
  maxAmount: number; // In millions
  interestRatePeriods: InterestRatePeriod[];
  amortizationSchedule: AmortizationPayment[];
  interestPaymentMonths: number[]; // Months of the year when interest is paid (e.g., [1, 7] for January and July)
}

/**
 * Represents a cash flow payment
 */
export interface CashFlowPayment {
  date: Date;
  bondId: string;
  principal: number;
  interest: number;
  total: number;
  currency: "USD" | "EUR";
}

/**
 * Represents aggregated cash flows by period
 */
export interface AggregatedCashFlow {
  period: string; // e.g., "2023-H1", "2023-Q2", "2023-07"
  usdPrincipal: number;
  usdInterest: number;
  usdTotal: number;
  eurPrincipal: number;
  eurInterest: number;
  eurTotal: number;
}
