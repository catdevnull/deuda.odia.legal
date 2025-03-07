#!/usr/bin/env node

/**
 * CLI tool to calculate and display cash flows for Argentine bonds
 */

import { getAllBonds } from "./bondData.js";
import {
  calculateCashFlows,
  calculateAllCashFlows,
  aggregateCashFlows,
  calculatePresentValue,
} from "./calculator.js";

// For Node.js process
declare const process: {
  argv: string[];
};

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || "help";

// Helper function to format currency
const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper function to format date
const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Display help
const showHelp = (): void => {
  console.log("Argentine Bonds Cash Flow Calculator");
  console.log("===================================");
  console.log("");
  console.log("Commands:");
  console.log("  list                     List all available bonds");
  console.log("  cashflows <bondId> <amount> [startYear] [endYear]");
  console.log(
    "                           Calculate cash flows for a specific bond"
  );
  console.log("  aggregate <periodType>   Aggregate cash flows by period type");
  console.log("                           (month, quarter, half-year, year)");
  console.log(
    "  pv <discountRate>        Calculate present value of all cash flows"
  );
  console.log("  help                     Show this help message");
  console.log("");
  console.log("Examples:");
  console.log("  node cli.js list");
  console.log("  node cli.js cashflows USD-STEP-UP-2030 1000 2023 2030");
  console.log("  node cli.js aggregate year");
  console.log("  node cli.js pv 0.08");
};

// List all bonds
const listBonds = (): void => {
  console.log("Available Bonds:");
  console.log("===============");
  console.log("");

  getAllBonds().forEach((bond) => {
    console.log(`ID: ${bond.id}`);
    console.log(`Name: ${bond.name}`);
    console.log(`Currency: ${bond.currency}`);
    console.log(
      `Max Amount: ${formatCurrency(
        bond.maxAmount,
        bond.currency === "USD" ? "USD" : "EUR"
      )} million`
    );
    console.log("");
  });
};

// Calculate and display cash flows for a specific bond
const showCashFlows = (
  bondId: string,
  amount: number,
  startYear?: number,
  endYear?: number
): void => {
  const bond = getAllBonds().find((b) => b.id === bondId);

  if (!bond) {
    console.error(
      `Bond with ID "${bondId}" not found. Use 'list' command to see available bonds.`
    );
    return;
  }

  const startDate = startYear
    ? new Date(Date.UTC(startYear, 0, 1))
    : new Date();
  const endDate = endYear
    ? new Date(Date.UTC(endYear, 11, 31))
    : new Date(2050, 0, 1);

  const cashFlows = calculateCashFlows(bond, amount, startDate, endDate);

  console.log(
    `Cash Flows for ${bond.name} (${formatCurrency(
      amount,
      bond.currency === "USD" ? "USD" : "EUR"
    )} million):`
  );
  console.log("=".repeat(80));
  console.log("");
  console.log(
    "Date       | Principal                | Interest                | Total"
  );
  console.log("-".repeat(80));

  let totalPrincipal = 0;
  let totalInterest = 0;

  cashFlows.forEach((cf) => {
    const currencySymbol = cf.currency === "USD" ? "USD" : "EUR";
    console.log(
      `${formatDate(cf.date)} | ${formatCurrency(
        cf.principal,
        currencySymbol
      ).padEnd(24)} | ` +
        `${formatCurrency(cf.interest, currencySymbol).padEnd(
          24
        )} | ${formatCurrency(cf.total, currencySymbol)}`
    );

    totalPrincipal += cf.principal;
    totalInterest += cf.interest;
  });

  console.log("-".repeat(80));
  console.log(
    `TOTAL       | ${formatCurrency(
      totalPrincipal,
      bond.currency === "USD" ? "USD" : "EUR"
    ).padEnd(24)} | ` +
      `${formatCurrency(
        totalInterest,
        bond.currency === "USD" ? "USD" : "EUR"
      ).padEnd(24)} | ` +
      `${formatCurrency(
        totalPrincipal + totalInterest,
        bond.currency === "USD" ? "USD" : "EUR"
      )}`
  );
};

// Aggregate cash flows
const showAggregatedCashFlows = (
  periodType: "month" | "quarter" | "half-year" | "year"
): void => {
  // Sample data for demonstration
  const initialPrincipals: Record<string, number> = {
    "USD-STEP-UP-2030": 1000,
    "USD-STEP-UP-2035": 1000,
    "USD-STEP-UP-2038": 1000,
    "EUR-STEP-UP-2030": 1000,
  };

  const cashFlows = calculateAllCashFlows(initialPrincipals);
  const aggregated = aggregateCashFlows(cashFlows, periodType);

  console.log(`Aggregated Cash Flows by ${periodType}:`);
  console.log("=".repeat(100));
  console.log("");
  console.log(
    "Period    | USD Principal      | USD Interest       | USD Total          | EUR Principal      | EUR Interest       | EUR Total"
  );
  console.log("-".repeat(100));

  aggregated.forEach((agg) => {
    console.log(
      `${agg.period.padEnd(10)} | ${formatCurrency(
        agg.usdPrincipal,
        "USD"
      ).padEnd(18)} | ` +
        `${formatCurrency(agg.usdInterest, "USD").padEnd(
          18
        )} | ${formatCurrency(agg.usdTotal, "USD").padEnd(18)} | ` +
        `${formatCurrency(agg.eurPrincipal, "EUR").padEnd(
          18
        )} | ${formatCurrency(agg.eurInterest, "EUR").padEnd(18)} | ` +
        `${formatCurrency(agg.eurTotal, "EUR")}`
    );
  });
};

// Calculate and display present value
const showPresentValue = (discountRate: number): void => {
  // Sample data for demonstration
  const initialPrincipals: Record<string, number> = {
    "USD-STEP-UP-2030": 1000,
    "USD-STEP-UP-2035": 1000,
    "USD-STEP-UP-2038": 1000,
    "EUR-STEP-UP-2030": 1000,
  };

  const cashFlows = calculateAllCashFlows(initialPrincipals);
  const presentValue = calculatePresentValue(cashFlows, discountRate);

  console.log(
    `Present Value of All Cash Flows (Discount Rate: ${(
      discountRate * 100
    ).toFixed(2)}%):`
  );
  console.log("=".repeat(60));
  console.log("");
  console.log(`Present Value: ${formatCurrency(presentValue, "USD")} million`);
};

// Process commands
switch (command) {
  case "list":
    listBonds();
    break;

  case "cashflows":
    const bondId = args[1];
    const amount = parseFloat(args[2]);
    const startYear = args[3] ? parseInt(args[3]) : undefined;
    const endYear = args[4] ? parseInt(args[4]) : undefined;

    if (!bondId || isNaN(amount)) {
      console.error("Error: Please provide a valid bond ID and amount.");
      console.log(
        "Usage: node cli.js cashflows <bondId> <amount> [startYear] [endYear]"
      );
      break;
    }

    showCashFlows(bondId, amount, startYear, endYear);
    break;

  case "aggregate":
    const periodType = args[1] as "month" | "quarter" | "half-year" | "year";

    if (!["month", "quarter", "half-year", "year"].includes(periodType)) {
      console.error(
        "Error: Invalid period type. Use month, quarter, half-year, or year."
      );
      break;
    }

    showAggregatedCashFlows(periodType);
    break;

  case "pv":
    const discountRate = parseFloat(args[1]);

    if (isNaN(discountRate)) {
      console.error(
        "Error: Please provide a valid discount rate (e.g., 0.08 for 8%)."
      );
      break;
    }

    showPresentValue(discountRate);
    break;

  case "help":
  default:
    showHelp();
    break;
}
