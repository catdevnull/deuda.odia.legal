# Argentine Bonds Cash Flow Calculator

This module provides tools to calculate and visualize future cash flows for Argentine bonds based on the conditions specified in the document "CONDICIONES DE EMISIÓN DE LOS TÍTULOS NUEVOS" (Decree 701/2020).

## Features

- Calculate cash flows for individual bonds or multiple bonds
- Support for both USD and EUR denominated bonds
- Aggregate cash flows by month, quarter, half-year, or year
- Calculate present value of future cash flows
- CLI tool for quick calculations
- Web interface for interactive visualization

## Bond Information

The calculator includes data for the following bonds:

- Bonos Globales de la República Argentina Amortizables en Dólares Estadounidenses Step Up 2030
- Bonos Globales de la República Argentina Amortizables en Dólares Estadounidenses Step Up 2035
- Bonos Globales de la República Argentina Amortizables en Dólares Estadounidenses Step Up 2038
- Bonos Globales de la República Argentina Amortizables en Dólares Estadounidenses Step Up 2041
- Bonos Globales de la República Argentina Amortizables en Dólares Estadounidenses Step Up 2046
- Bonos Globales de la República Argentina Amortizables en Euros Step Up 2030
- And more...

## Usage

### CLI Tool

The CLI tool provides a simple way to calculate cash flows from the command line:

```bash
# List all available bonds
node src/cashflow/cli.js list

# Calculate cash flows for a specific bond
node src/cashflow/cli.js cashflows USD-STEP-UP-2030 1000 2023 2030

# Aggregate cash flows by period
node src/cashflow/cli.js aggregate year

# Calculate present value
node src/cashflow/cli.js pv 0.08
```

### Web Interface

The web interface provides an interactive way to visualize cash flows:

1. Open `src/cashflow/web/index.html` in a web browser
2. Select the bonds and amounts
3. Configure the calculation parameters
4. View the results in the chart, table, or summary tabs

### API

You can also use the calculator programmatically:

```typescript
import {
  getAllBonds,
  calculateCashFlows,
  calculateAllCashFlows,
  aggregateCashFlows,
  calculatePresentValue,
} from "./src/cashflow/index.js";

// Get all bonds
const bonds = getAllBonds();

// Calculate cash flows for a specific bond
const bond = bonds[0];
const cashFlows = calculateCashFlows(bond, 1000);

// Calculate cash flows for multiple bonds
const bondAmounts = {
  "USD-STEP-UP-2030": 1000,
  "USD-STEP-UP-2035": 1000,
};
const allCashFlows = calculateAllCashFlows(bondAmounts);

// Aggregate cash flows by year
const aggregated = aggregateCashFlows(allCashFlows, "year");

// Calculate present value
const presentValue = calculatePresentValue(allCashFlows, 0.08);
```

## Data Source

The bond data is based on the document "CONDICIONES DE EMISIÓN DE LOS TÍTULOS NUEVOS" from Decree 701/2020 of the Argentine Republic.

## License

This project is licensed under the AGPL-3.0-OR-LATER license.
