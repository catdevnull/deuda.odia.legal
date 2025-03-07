/**
 * This file contains functions to calculate cash flows for bonds
 */

import { Bond, CashFlowPayment, AggregatedCashFlow } from "./models.js";
import { getAllBonds, getBondById } from "./bondData.js";

/**
 * Calculate the interest rate for a specific date
 * @param bond The bond
 * @param date The date to check
 * @returns The interest rate applicable for the date
 */
export const getInterestRate = (bond: Bond, date: Date): number => {
  // First try to find a period where the date is within the range (inclusive start, exclusive end)
  let period = bond.interestRatePeriods.find(
    (period) => date >= period.startDate && date < period.endDate
  );

  // If no period is found, check if the date is exactly equal to the end date of the last period
  if (!period) {
    const lastPeriod =
      bond.interestRatePeriods[bond.interestRatePeriods.length - 1];
    if (lastPeriod && date.getTime() === lastPeriod.endDate.getTime()) {
      period = lastPeriod;
    }
  }

  if (!period) {
    throw new Error(
      `No interest rate period found for date ${date.toISOString()} for bond ${
        bond.id
      }`
    );
  }

  return period.rate;
};

/**
 * Calculate the outstanding principal at a specific date
 * @param bond The bond
 * @param date The date to check
 * @param initialPrincipal The initial principal amount
 * @returns The outstanding principal
 */
export const getOutstandingPrincipal = (
  bond: Bond,
  date: Date,
  initialPrincipal: number
): number => {
  // If date is before the issue date, return the full principal
  if (date < bond.issueDate) {
    return initialPrincipal;
  }

  // Calculate the total amortization percentage up to the given date
  const totalAmortizationPercentage = bond.amortizationSchedule
    .filter((payment) => payment.date <= date)
    .reduce((sum, payment) => sum + payment.percentage, 0);

  // Return the remaining principal
  return initialPrincipal * (1 - totalAmortizationPercentage);
};

/**
 * Calculate all cash flow payments for a bond
 * @param bond The bond
 * @param initialPrincipal The initial principal amount (in millions)
 * @param startDate The start date for calculations
 * @param endDate The end date for calculations
 * @returns Array of cash flow payments
 */
export const calculateCashFlows = (
  bond: Bond,
  initialPrincipal: number,
  startDate: Date = new Date(),
  endDate: Date = new Date(2050, 0, 1)
): CashFlowPayment[] => {
  const cashFlows: CashFlowPayment[] = [];

  // Get all payment dates (both interest and principal)
  const allPaymentDates = new Set<string>();

  // Add interest payment dates
  let currentDate = new Date(
    Math.max(bond.issueDate.getTime(), startDate.getTime())
  );

  // Make sure we include the last payment date (inclusive)
  const lastAmortizationDate =
    bond.amortizationSchedule[bond.amortizationSchedule.length - 1].date;
  const lastDate = new Date(
    Math.min(
      // Add one day to ensure we include the last payment date
      new Date(lastAmortizationDate.getTime() + 24 * 60 * 60 * 1000).getTime(),
      endDate.getTime()
    )
  );

  while (currentDate <= lastDate) {
    // Check if the current month is an interest payment month
    if (bond.interestPaymentMonths.includes(currentDate.getMonth() + 1)) {
      // Create a new date with day 9 (payment day)
      const paymentDate = new Date(
        Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 9)
      );

      if (paymentDate >= startDate && paymentDate <= endDate) {
        allPaymentDates.add(paymentDate.toISOString());
      }
    }

    // Move to the next month
    currentDate = new Date(
      Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 1)
    );
  }

  // Add amortization payment dates
  bond.amortizationSchedule.forEach((payment) => {
    if (payment.date >= startDate && payment.date <= endDate) {
      allPaymentDates.add(payment.date.toISOString());
    }
  });

  // Sort all payment dates
  const sortedDates = Array.from(allPaymentDates)
    .map((dateStr) => new Date(dateStr))
    .sort((a, b) => a.getTime() - b.getTime());

  // Calculate cash flows for each payment date
  let outstandingPrincipal = initialPrincipal;
  let lastPaymentDate = new Date(bond.issueDate);

  for (const paymentDate of sortedDates) {
    // Calculate principal payment
    const amortizationPayment = bond.amortizationSchedule.find(
      (payment) => payment.date.getTime() === paymentDate.getTime()
    );

    const principalPayment = amortizationPayment
      ? initialPrincipal * amortizationPayment.percentage
      : 0;

    // Calculate interest payment
    // Get days since last payment
    const daysSinceLastPayment =
      (paymentDate.getTime() - lastPaymentDate.getTime()) /
      (1000 * 60 * 60 * 24);

    // Get applicable interest rate
    const interestRate = getInterestRate(bond, paymentDate);

    // Calculate interest amount (using 30/360 day count convention as specified in the document)
    const interestPayment =
      outstandingPrincipal * interestRate * (daysSinceLastPayment / 360);

    // Add cash flow
    cashFlows.push({
      date: new Date(paymentDate),
      bondId: bond.id,
      principal: principalPayment,
      interest: interestPayment,
      total: principalPayment + interestPayment,
      currency: bond.currency,
    });

    // Update outstanding principal
    outstandingPrincipal -= principalPayment;

    // Update last payment date
    lastPaymentDate = new Date(paymentDate);
  }

  return cashFlows;
};

/**
 * Calculate cash flows for all bonds
 * @param initialPrincipals Map of bond IDs to initial principal amounts
 * @param startDate The start date for calculations
 * @param endDate The end date for calculations
 * @returns Array of cash flow payments for all bonds
 */
export const calculateAllCashFlows = (
  initialPrincipals: Record<string, number>,
  startDate: Date = new Date(),
  endDate: Date = new Date(2050, 0, 1)
): CashFlowPayment[] => {
  const allCashFlows: CashFlowPayment[] = [];

  getAllBonds().forEach((bond) => {
    const initialPrincipal = initialPrincipals[bond.id] || 0;

    if (initialPrincipal > 0) {
      const bondCashFlows = calculateCashFlows(
        bond,
        initialPrincipal,
        startDate,
        endDate
      );
      allCashFlows.push(...bondCashFlows);
    }
  });

  // Sort by date
  return allCashFlows.sort((a, b) => a.date.getTime() - b.date.getTime());
};

/**
 * Aggregate cash flows by period
 * @param cashFlows Array of cash flow payments
 * @param periodType Type of period to aggregate by ('month', 'quarter', 'half-year', 'year')
 * @returns Aggregated cash flows
 */
export const aggregateCashFlows = (
  cashFlows: CashFlowPayment[],
  periodType: "month" | "quarter" | "half-year" | "year" = "year"
): AggregatedCashFlow[] => {
  const aggregated: Record<string, AggregatedCashFlow> = {};

  cashFlows.forEach((cashFlow) => {
    const date = cashFlow.date;
    let period: string;

    // Determine period key based on periodType
    switch (periodType) {
      case "month":
        period = `${date.getUTCFullYear()}-${String(
          date.getUTCMonth() + 1
        ).padStart(2, "0")}`;
        break;
      case "quarter":
        const quarter = Math.floor(date.getUTCMonth() / 3) + 1;
        period = `${date.getUTCFullYear()}-Q${quarter}`;
        break;
      case "half-year":
        const halfYear = date.getUTCMonth() < 6 ? "H1" : "H2";
        period = `${date.getUTCFullYear()}-${halfYear}`;
        break;
      case "year":
      default:
        period = `${date.getUTCFullYear()}`;
        break;
    }

    // Initialize period if it doesn't exist
    if (!aggregated[period]) {
      aggregated[period] = {
        period,
        usdPrincipal: 0,
        usdInterest: 0,
        usdTotal: 0,
        eurPrincipal: 0,
        eurInterest: 0,
        eurTotal: 0,
      };
    }

    // Add cash flow to the appropriate currency
    if (cashFlow.currency === "USD") {
      aggregated[period].usdPrincipal += cashFlow.principal;
      aggregated[period].usdInterest += cashFlow.interest;
      aggregated[period].usdTotal += cashFlow.total;
    } else {
      aggregated[period].eurPrincipal += cashFlow.principal;
      aggregated[period].eurInterest += cashFlow.interest;
      aggregated[period].eurTotal += cashFlow.total;
    }
  });

  // Convert to array and sort by period
  return Object.values(aggregated).sort((a, b) =>
    a.period.localeCompare(b.period)
  );
};

/**
 * Calculate the present value of cash flows
 * @param cashFlows Array of cash flow payments
 * @param discountRate Annual discount rate (as a decimal)
 * @param referenceDate Reference date for present value calculation
 * @param usdToEurRate Exchange rate from USD to EUR
 * @returns Present value of cash flows in USD
 */
export const calculatePresentValue = (
  cashFlows: CashFlowPayment[],
  discountRate: number,
  referenceDate: Date = new Date(),
  usdToEurRate: number = 0.85
): number => {
  let presentValue = 0;

  cashFlows.forEach((cashFlow) => {
    // Skip cash flows before the reference date
    if (cashFlow.date < referenceDate) {
      return;
    }

    // Calculate years from reference date
    const yearsFraction =
      (cashFlow.date.getTime() - referenceDate.getTime()) /
      (1000 * 60 * 60 * 24 * 365.25);

    // Calculate discount factor
    const discountFactor = Math.pow(1 + discountRate, -yearsFraction);

    // Calculate present value of this cash flow
    let cashFlowValue = cashFlow.total;

    // Convert EUR to USD if needed
    if (cashFlow.currency === "EUR") {
      cashFlowValue /= usdToEurRate;
    }

    // Add to total present value
    presentValue += cashFlowValue * discountFactor;
  });

  return presentValue;
};
