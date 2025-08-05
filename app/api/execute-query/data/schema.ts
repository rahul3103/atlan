import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

// Address schema used by customers, employees, and suppliers
const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  region: z.string(),
  postalCode: z.union([z.string(), z.number()]),
  country: z.string(),
  phone: z.string(),
});

// Categories schema
export const categorySchema = z.object({
  categoryID: z.number(),
  description: z.string(),
  name: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

// Customers schema
export const customerSchema = z.object({
  customerID: z.string(),
  companyName: z.string(),
  contactName: z.string(),
  contactTitle: z.string(),
  address: addressSchema,
});

export type Customer = z.infer<typeof customerSchema>;

// Employees schema
export const employeeSchema = z.object({
  employeeID: z.number(),
  lastName: z.string(),
  firstName: z.string(),
  title: z.string(),
  titleOfCourtesy: z.string(),
  birthDate: z.string(),
  hireDate: z.string(),
  address: addressSchema,
  notes: z.string(),
  reportsTo: z.string(),
  territoryIDs: z.array(z.number()),
});

export type Employee = z.infer<typeof employeeSchema>;

// Ship address schema for orders
const shipAddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  region: z.string(),
  postalCode: z.union([z.string(), z.number()]),
  country: z.string(),
});

// Order details schema
const orderDetailSchema = z.object({
  productID: z.number(),
  unitPrice: z.number(),
  quantity: z.number(),
  discount: z.number(),
});

// Orders schema
export const orderSchema = z.object({
  orderID: z.number(),
  customerID: z.string(),
  employeeID: z.number(),
  orderDate: z.string(),
  requiredDate: z.string(),
  shippedDate: z.string(),
  shipVia: z.number(),
  freight: z.number(),
  shipName: z.string(),
  shipAddress: shipAddressSchema,
  details: z.array(orderDetailSchema),
});

export type Order = z.infer<typeof orderSchema>;

// Products schema
export const productSchema = z.object({
  productID: z.number(),
  supplierID: z.number(),
  categoryID: z.number(),
  quantityPerUnit: z.string(),
  unitPrice: z.number(),
  unitsInStock: z.number(),
  unitsOnOrder: z.number(),
  reorderLevel: z.number(),
  discontinued: z.boolean(),
  name: z.string(),
});

export type Product = z.infer<typeof productSchema>;

// Territory schema for regions
const territorySchema = z.object({
  territoryID: z.number(),
  name: z.string(),
});

// Regions schema
export const regionSchema = z.object({
  regionID: z.number(),
  name: z.string(),
  territories: z.array(territorySchema),
});

export type Region = z.infer<typeof regionSchema>;

// Shippers schema
export const shipperSchema = z.object({
  shipperID: z.number(),
  companyName: z.string(),
  phone: z.string(),
});

export type Shipper = z.infer<typeof shipperSchema>;

// Suppliers schema
export const supplierSchema = z.object({
  supplierID: z.number(),
  companyName: z.string(),
  contactName: z.string(),
  contactTitle: z.string(),
  address: addressSchema,
});

export type Supplier = z.infer<typeof supplierSchema>;
