import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Query type definitions
type QueryType = 
  | 'all-customers'
  | 'all-orders'
  | 'all-products'
  | 'all-categories'
  | 'all-employees'
  | 'all-suppliers'
  | 'unknown';

interface QueryMatch {
  type: QueryType;
}

// Helper function to read JSON files
async function readJsonFile(filename: string) {
  const filePath = path.join(process.cwd(), 'app/api/execute-query/data', filename);
  const data = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

// Query pattern matching
function parseQuery(query: string): QueryMatch {
  const normalizedQuery = query.toLowerCase().trim();
  
  // SELECT * patterns
  if (normalizedQuery.includes('select * from customers')) {
    return { type: 'all-customers' };
  }
  
  if (normalizedQuery.includes('select * from orders')) {
    return { type: 'all-orders' };
  }
  
  if (normalizedQuery.includes('select * from products')) {
    return { type: 'all-products' };
  }
  
  if (normalizedQuery.includes('select * from categories')) {
    return { type: 'all-categories' };
  }
  
  if (normalizedQuery.includes('select * from employees')) {
    return { type: 'all-employees' };
  }
  
  if (normalizedQuery.includes('select * from suppliers')) {
    return { type: 'all-suppliers' };
  }
  
  return { type: 'unknown' };
}

// Query execution functions for SELECT * queries
async function getAllCustomers(): Promise<any[]> {
  const customers = await readJsonFile('customers.json');
  
  return customers.map((customer: any) => ({
    customerID: customer.customerID,
    companyName: customer.companyName,
    contactName: customer.contactName,
    contactTitle: customer.contactTitle,
    address: customer.address?.street || '',
    city: customer.address?.city || '',
    region: customer.address?.region || '',
    postalCode: customer.address?.postalCode || '',
    country: customer.address?.country || '',
    phone: customer.address?.phone || ''
  }));
}

async function getAllOrders(): Promise<any[]> {
  const orders = await readJsonFile('orders.json');
  
  return orders.map((order: any) => ({
    orderID: order.orderID,
    customerID: order.customerID,
    employeeID: order.employeeID,
    orderDate: order.orderDate,
    requiredDate: order.requiredDate,
    shippedDate: order.shippedDate,
    shipVia: order.shipVia,
    freight: order.freight,
    shipName: order.shipName
  }));
}

async function getAllProducts(): Promise<any[]> {
  const products = await readJsonFile('products.json');
  
  return products.map((product: any) => ({
    productID: product.productID,
    name: product.name,
    supplierID: product.supplierID,
    categoryID: product.categoryID,
    quantityPerUnit: product.quantityPerUnit,
    unitPrice: product.unitPrice,
    unitsInStock: product.unitsInStock,
    unitsOnOrder: product.unitsOnOrder,
    reorderLevel: product.reorderLevel,
    discontinued: product.discontinued
  }));
}

async function getAllCategories(): Promise<any[]> {
  const categories = await readJsonFile('categories.json');
  
  return categories.map((category: any) => ({
    categoryID: category.categoryID,
    name: category.name,
    description: category.description
  }));
}

async function getAllEmployees(): Promise<any[]> {
  const employees = await readJsonFile('employees.json');
  
  return employees.map((employee: any) => ({
    employeeID: employee.employeeID,
    lastName: employee.lastName,
    firstName: employee.firstName,
    title: employee.title,
    titleOfCourtesy: employee.titleOfCourtesy,
    birthDate: employee.birthDate,
    hireDate: employee.hireDate,
    address: employee.address?.street || '',
    city: employee.address?.city || '',
    region: employee.address?.region || '',
    postalCode: employee.address?.postalCode || '',
    country: employee.address?.country || '',
    homePhone: employee.address?.phone || '',
    reportsTo: employee.reportsTo || ''
  }));
}

async function getAllSuppliers(): Promise<any[]> {
  const suppliers = await readJsonFile('suppliers.json');
  
  return suppliers.map((supplier: any) => ({
    supplierID: supplier.supplierID,
    companyName: supplier.companyName,
    contactName: supplier.contactName,
    contactTitle: supplier.contactTitle,
    address: supplier.address?.street || '',
    city: supplier.address?.city || '',
    region: supplier.address?.region || '',
    postalCode: supplier.address?.postalCode || '',
    country: supplier.address?.country || '',
    phone: supplier.address?.phone || ''
  }));
}

// Header definitions for each query type
function getHeadersForQueryType(queryType: QueryType) {
  switch (queryType) {
    case 'all-customers':
      return [
        { key: "customerID", label: "Customer ID", type: "string" },
        { key: "companyName", label: "Company Name", type: "string" },
        { key: "contactName", label: "Contact Name", type: "string" },
        { key: "contactTitle", label: "Contact Title", type: "string" },
        { key: "address", label: "Address", type: "string" },
        { key: "city", label: "City", type: "string" },
        { key: "region", label: "Region", type: "string" },
        { key: "postalCode", label: "Postal Code", type: "string" },
        { key: "country", label: "Country", type: "string" },
        { key: "phone", label: "Phone", type: "string" }
      ];
    case 'all-products':
      return [
        { key: "productID", label: "Product ID", type: "number" },
        { key: "name", label: "Product Name", type: "string" },
        { key: "supplierID", label: "Supplier ID", type: "number" },
        { key: "categoryID", label: "Category ID", type: "number" },
        { key: "quantityPerUnit", label: "Quantity Per Unit", type: "string" },
        { key: "unitPrice", label: "Unit Price", type: "currency" },
        { key: "unitsInStock", label: "Units in Stock", type: "number" },
        { key: "unitsOnOrder", label: "Units on Order", type: "number" },
        { key: "reorderLevel", label: "Reorder Level", type: "number" },
        { key: "discontinued", label: "Discontinued", type: "string" }
      ];
    case 'all-categories':
      return [
        { key: "categoryID", label: "Category ID", type: "number" },
        { key: "name", label: "Category Name", type: "string" },
        { key: "description", label: "Description", type: "string" }
      ];
    case 'all-employees':
      return [
        { key: "employeeID", label: "Employee ID", type: "number" },
        { key: "lastName", label: "Last Name", type: "string" },
        { key: "firstName", label: "First Name", type: "string" },
        { key: "title", label: "Title", type: "string" },
        { key: "titleOfCourtesy", label: "Title of Courtesy", type: "string" },
        { key: "birthDate", label: "Birth Date", type: "date" },
        { key: "hireDate", label: "Hire Date", type: "date" },
        { key: "address", label: "Address", type: "string" },
        { key: "city", label: "City", type: "string" },
        { key: "region", label: "Region", type: "string" },
        { key: "postalCode", label: "Postal Code", type: "string" },
        { key: "country", label: "Country", type: "string" },
        { key: "homePhone", label: "Home Phone", type: "string" },
        { key: "reportsTo", label: "Reports To", type: "number" }
      ];
    case 'all-suppliers':
      return [
        { key: "supplierID", label: "Supplier ID", type: "number" },
        { key: "companyName", label: "Company Name", type: "string" },
        { key: "contactName", label: "Contact Name", type: "string" },
        { key: "contactTitle", label: "Contact Title", type: "string" },
        { key: "address", label: "Address", type: "string" },
        { key: "city", label: "City", type: "string" },
        { key: "region", label: "Region", type: "string" },
        { key: "postalCode", label: "Postal Code", type: "string" },
        { key: "country", label: "Country", type: "string" },
        { key: "phone", label: "Phone", type: "string" }
      ];
    case 'all-orders':
      return [
        { key: "orderID", label: "Order ID", type: "number" },
        { key: "customerID", label: "Customer ID", type: "string" },
        { key: "employeeID", label: "Employee ID", type: "number" },
        { key: "orderDate", label: "Order Date", type: "date" },
        { key: "requiredDate", label: "Required Date", type: "date" },
        { key: "shippedDate", label: "Shipped Date", type: "date" },
        { key: "shipVia", label: "Ship Via", type: "number" },
        { key: "freight", label: "Freight", type: "currency" },
        { key: "shipName", label: "Ship Name", type: "string" }
      ];
    default:
      return [];
  }
}

// Convert object array to rows array based on headers
function convertToRows(data: any[], headers: any[]) {
  const rows = data.map(item => 
    headers.map(header => {
      const value = item[header.key];
      return value;
    })
  );
  
  return rows;
}

// Main query executor
async function executeQueryByType(queryType: QueryType): Promise<any[]> {
  switch (queryType) {
    case 'all-customers':
      return await getAllCustomers();
    case 'all-orders':
      return await getAllOrders();
    case 'all-products':
      return await getAllProducts();
    case 'all-categories':
      return await getAllCategories();
    case 'all-employees':
      return await getAllEmployees();
    case 'all-suppliers':
      return await getAllSuppliers();
    default:
      return [];
  }
}

// API Route Handler
export async function POST(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }
    
    const match = parseQuery(query);
    
    if (match.type === 'unknown') {
      return NextResponse.json({
        success: false,
        message: 'Query pattern not recognized',
        query,
        result: {
          headers: [],
          rows: []
        }
      });
    }
    
    const results = await executeQueryByType(match.type);
    const headers = getHeadersForQueryType(match.type);
    const rows = convertToRows(results, headers);
    const endTime = performance.now();
    
    return NextResponse.json({
      success: true,
      executionTime: `${(endTime - startTime).toFixed(2)}ms`,
      rowCount: results.length,
      query: query,
      result: {
        headers: headers,
        rows: rows
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}