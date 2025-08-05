# SQL Data Visualization Dashboard

## Framework & Technology Stack

### Core Framework

- **Next.js 15.4.5** - React-based full-stack framework with TypeScript support

### Major Packages & Libraries

- **Recharts** - charting library
- **@tanstack/react-table** - Headless Table
- **Radix UI** - UI components
- **Lucide React** - Icon library
- **TailwindCSS 4** - CSS framework

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Page Load Time & Measurements

## Features

### Data Visualization

- Interactive bar and line charts with dynamic axis selection
- Support for multiple data types: currency, numbers, dates, strings, booleans
- Responsive chart sizing for optimal viewing across screen sizes

### Features

- Sortable columns with type-aware sorting
- Column filtering and visibility controls
- Row selection with CSV export functionality
- Pagination for large datasets (830+ rows tested)

### SQL Query Support

- Pre-defined queries for 6 data tables: customers, orders, products, categories, employees, suppliers
- Real-time query execution with performance metrics(basically real world we will have query time)

## Supported Queries

```sql
SELECT * FROM customers
SELECT * FROM orders
SELECT * FROM products
SELECT * FROM categories
SELECT * FROM employees
SELECT * FROM suppliers
```
