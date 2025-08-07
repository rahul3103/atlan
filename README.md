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

## Walkthrough Link

Open [Loom link](https://www.loom.com/share/07e281a2062b4ad39a49cee48d156fa0?sid=73eebfda-bf4c-4c0e-a53a-3a4905639ba6) to view the walkthrough.

## Hosted At

Open [Website Link](https://atlan-zeta.vercel.app/) to view the webpage.

## Page Load Time & Measurements

### Page Speed Insights Performance : [Perf Link](https://pagespeed.web.dev/analysis/https-atlan-zeta-vercel-app/z6gd4pbl8v?form_factor=desktop)

This data mostly stays around 100 because we’re not loading too many elements on the first screen. We keep the initial page minimal and server-rendered. I chose Next.js because I wanted to use APIs, and with it, I also get the benefit of server-side rendering for the first page. This contributes significantly to achieving a perfect score of 100.

### Client-Side Performance

Heap memory ranges from 5MB to 22MB depending on what we load on the screen. Initially, it's at the lower end, but it increases to around 10MB when a query is loaded, and goes up to 22MB when we increase the number of rows to 100. This behavior depends on several factors like how many columns and rows we display, and the complexity of the data being visualized. As long as memory usage doesn’t grow uncontrollably with every interaction, it’s not a concern. In our case, it only increases with the number of elements and goes back down when the elements are reduced.

CPU usage typically stays close to 0 when the app is idle, with minor spikes during hover effects or lightweight animations. Significant CPU activity occurs when interacting with features like pagination or increasing the number of visible items. This is expected as it triggers JavaScript execution, style recalculations, layout updates, painting, and committing.

Our initial JavaScript execution time is effectively 0 due to server-side rendering. However, it increases as we begin interacting with buttons. That said, interactions remain fast and responsive, as demonstrated in the video.

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
