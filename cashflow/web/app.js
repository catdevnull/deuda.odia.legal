/**
 * Web interface for the Argentine Bonds Cash Flow Calculator
 */

import {
  getAllBonds,
  calculateAllCashFlows,
  aggregateCashFlows,
  calculatePresentValue,
} from "../index.js";

// Format currency
const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  const bondSelectorsContainer = document.getElementById("bond-selectors");
  const calculatorForm = document.getElementById("calculator-form");
  const cashFlowChart = document.getElementById("cash-flow-chart");
  const cashFlowTable = document
    .getElementById("cash-flow-table")
    .querySelector("tbody");
  const summaryContent = document.getElementById("summary-content");

  // Get form elements
  const startYearInput = document.getElementById("start-year");
  const endYearInput = document.getElementById("end-year");
  const aggregationTypeSelect = document.getElementById("aggregation-type");
  const discountRateInput = document.getElementById("discount-rate");
  const showPrincipalCheckbox = document.getElementById("show-principal");
  const showInterestCheckbox = document.getElementById("show-interest");
  const showTotalCheckbox = document.getElementById("show-total");

  // Get all bonds
  const bonds = getAllBonds();

  // Create bond selectors
  bonds.forEach((bond) => {
    const bondSelector = document.createElement("div");
    bondSelector.className = "mb-3";
    bondSelector.innerHTML = `
      <label for="bond-${bond.id}" class="form-label">${bond.name}</label>
      <div class="input-group">
        <span class="input-group-text">${bond.currency}</span>
        <input type="number" class="form-control bond-amount" id="bond-${bond.id}" 
               data-bond-id="${bond.id}" value="0" min="0" max="${bond.maxAmount}" step="100">
        <span class="input-group-text">million</span>
      </div>
    `;
    bondSelectorsContainer.appendChild(bondSelector);
  });

  // Handle form submission
  calculatorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    calculateAndDisplayResults();
  });

  // Calculate and display results
  const calculateAndDisplayResults = () => {
    // Get input values
    const startYear = parseInt(startYearInput.value);
    const endYear = parseInt(endYearInput.value);
    const aggregationType = aggregationTypeSelect.value;
    const discountRate = parseFloat(discountRateInput.value) / 100;
    const showPrincipal = showPrincipalCheckbox.checked;
    const showInterest = showInterestCheckbox.checked;
    const showTotal = showTotalCheckbox.checked;

    // Get bond amounts
    const bondAmounts = {};
    document.querySelectorAll(".bond-amount").forEach((input) => {
      const bondId = input.getAttribute("data-bond-id");
      const amount = parseFloat(input.value) || 0;
      bondAmounts[bondId] = amount;
    });

    // Calculate start and end dates
    const startDate = new Date(Date.UTC(startYear, 0, 1));
    const endDate = new Date(Date.UTC(endYear, 11, 31));

    // Calculate cash flows
    const cashFlows = calculateAllCashFlows(bondAmounts, startDate, endDate);

    // Aggregate cash flows
    const aggregated = aggregateCashFlows(cashFlows, aggregationType);

    // Calculate present value
    const presentValue = calculatePresentValue(cashFlows, discountRate);

    // Display chart
    displayChart(aggregated, showPrincipal, showInterest, showTotal);

    // Display table
    displayTable(aggregated);

    // Display summary
    displaySummary(aggregated, presentValue, discountRate);
  };

  // Display chart
  const displayChart = (
    aggregatedCashFlows,
    showPrincipal,
    showInterest,
    showTotal
  ) => {
    // Clear previous chart
    while (cashFlowChart.firstChild) {
      cashFlowChart.removeChild(cashFlowChart.firstChild);
    }

    // Prepare data for the chart
    const chartData = [];

    aggregatedCashFlows.forEach((cf) => {
      if (showPrincipal) {
        chartData.push({
          period: cf.period,
          value: cf.usdPrincipal,
          type: "Principal",
          currency: "USD",
        });

        chartData.push({
          period: cf.period,
          value: cf.eurPrincipal,
          type: "Principal",
          currency: "EUR",
        });
      }

      if (showInterest) {
        chartData.push({
          period: cf.period,
          value: cf.usdInterest,
          type: "Interest",
          currency: "USD",
        });

        chartData.push({
          period: cf.period,
          value: cf.eurInterest,
          type: "Interest",
          currency: "EUR",
        });
      }

      if (showTotal) {
        chartData.push({
          period: cf.period,
          value: cf.usdTotal,
          type: "Total",
          currency: "USD",
        });

        chartData.push({
          period: cf.period,
          value: cf.eurTotal,
          type: "Total",
          currency: "EUR",
        });
      }
    });

    // Create the chart using Plot
    const chart = Plot.plot({
      marginLeft: 60,
      marginRight: 40,
      marginBottom: 40,
      marginTop: 40,
      height: 500,
      width: cashFlowChart.clientWidth,
      x: {
        label: "Period",
        tickRotate: -45,
      },
      y: {
        label: "Amount (millions)",
        grid: true,
      },
      color: {
        legend: true,
        scheme: "category10",
      },
      marks: [
        Plot.barY(chartData, {
          x: "period",
          y: "value",
          fill: (d) => `${d.type}-${d.currency}`,
          tip: true,
        }),
        Plot.ruleY([0]),
      ],
    });

    cashFlowChart.appendChild(chart);
  };

  // Display table
  const displayTable = (aggregatedCashFlows) => {
    // Clear previous table
    cashFlowTable.innerHTML = "";

    // Add rows for each period
    aggregatedCashFlows.forEach((cf) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${cf.period}</td>
        <td>${formatCurrency(cf.usdPrincipal, "USD")}</td>
        <td>${formatCurrency(cf.usdInterest, "USD")}</td>
        <td>${formatCurrency(cf.usdTotal, "USD")}</td>
        <td>${formatCurrency(cf.eurPrincipal, "EUR")}</td>
        <td>${formatCurrency(cf.eurInterest, "EUR")}</td>
        <td>${formatCurrency(cf.eurTotal, "EUR")}</td>
      `;
      cashFlowTable.appendChild(row);
    });

    // Add total row
    const totalRow = document.createElement("tr");
    totalRow.className = "table-dark";

    const totals = aggregatedCashFlows.reduce(
      (acc, cf) => {
        acc.usdPrincipal += cf.usdPrincipal;
        acc.usdInterest += cf.usdInterest;
        acc.usdTotal += cf.usdTotal;
        acc.eurPrincipal += cf.eurPrincipal;
        acc.eurInterest += cf.eurInterest;
        acc.eurTotal += cf.eurTotal;
        return acc;
      },
      {
        usdPrincipal: 0,
        usdInterest: 0,
        usdTotal: 0,
        eurPrincipal: 0,
        eurInterest: 0,
        eurTotal: 0,
      }
    );

    totalRow.innerHTML = `
      <td><strong>TOTAL</strong></td>
      <td><strong>${formatCurrency(totals.usdPrincipal, "USD")}</strong></td>
      <td><strong>${formatCurrency(totals.usdInterest, "USD")}</strong></td>
      <td><strong>${formatCurrency(totals.usdTotal, "USD")}</strong></td>
      <td><strong>${formatCurrency(totals.eurPrincipal, "EUR")}</strong></td>
      <td><strong>${formatCurrency(totals.eurInterest, "EUR")}</strong></td>
      <td><strong>${formatCurrency(totals.eurTotal, "EUR")}</strong></td>
    `;

    cashFlowTable.appendChild(totalRow);
  };

  // Display summary
  const displaySummary = (aggregatedCashFlows, presentValue, discountRate) => {
    // Calculate totals
    const totals = aggregatedCashFlows.reduce(
      (acc, cf) => {
        acc.usdPrincipal += cf.usdPrincipal;
        acc.usdInterest += cf.usdInterest;
        acc.usdTotal += cf.usdTotal;
        acc.eurPrincipal += cf.eurPrincipal;
        acc.eurInterest += cf.eurInterest;
        acc.eurTotal += cf.eurTotal;
        return acc;
      },
      {
        usdPrincipal: 0,
        usdInterest: 0,
        usdTotal: 0,
        eurPrincipal: 0,
        eurInterest: 0,
        eurTotal: 0,
      }
    );

    // Create summary HTML
    summaryContent.innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <h6>USD Cash Flows</h6>
          <p>Principal: ${formatCurrency(totals.usdPrincipal, "USD")}</p>
          <p>Interest: ${formatCurrency(totals.usdInterest, "USD")}</p>
          <p>Total: ${formatCurrency(totals.usdTotal, "USD")}</p>
        </div>
        <div class="col-md-6">
          <h6>EUR Cash Flows</h6>
          <p>Principal: ${formatCurrency(totals.eurPrincipal, "EUR")}</p>
          <p>Interest: ${formatCurrency(totals.eurInterest, "EUR")}</p>
          <p>Total: ${formatCurrency(totals.eurTotal, "EUR")}</p>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-md-12">
          <h6>Present Value Analysis</h6>
          <p>Discount Rate: ${(discountRate * 100).toFixed(2)}%</p>
          <p>Present Value (USD): ${formatCurrency(presentValue, "USD")}</p>
        </div>
      </div>
    `;
  };

  // Initialize with default values
  calculateAndDisplayResults();
});
