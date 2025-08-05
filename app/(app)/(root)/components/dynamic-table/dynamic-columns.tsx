import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { HeaderDefinition, DataRow } from "./types";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";

// Convert API rows (arrays) to objects using headers
export function convertRowsToObjects(
  headers: HeaderDefinition[], 
  rows: any[][]
): DataRow[] {
  const result = rows.map(row => {
    const obj: DataRow = {};
    headers.forEach((header, index) => {
      obj[header.key] = row[index];
    });
    return obj;
  });
  
  return result;
}

// Format value based on data type
function formatCellValue(value: any, type: HeaderDefinition['type']): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  switch (type) {
    case 'currency':
      return typeof value === 'number' 
        ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
        : `$${value}`;
    
    case 'number':
      return typeof value === 'number' 
        ? value.toLocaleString('en-US') 
        : String(value);
    
    case 'date':
      if (typeof value === 'string' && value.includes('T')) {
        // ISO date string
        return new Date(value).toLocaleDateString('en-US');
      } else if (typeof value === 'string' && value.includes('-')) {
        // Simple date string (YYYY-MM-DD)
        return new Date(value).toLocaleDateString('en-US');
      }
      return String(value);
    
    case 'boolean':
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
      }
      return String(value).toLowerCase() === 'true' ? 'Yes' : 'No';
    
    case 'string':
    default:
      return String(value);
  }
}

// Generate dynamic columns from headers
export function generateColumnsFromHeaders(headers: HeaderDefinition[]): ColumnDef<DataRow>[] {
  return headers.map((header) => {
    const baseColumn: ColumnDef<DataRow> = {
      accessorKey: header.key,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={header.label} />
      ),
      cell: ({ row }) => {
        const value = row.getValue(header.key);
        const formattedValue = formatCellValue(value, header.type);
        
        // Apply styling based on data type
        const className = getColumnClassName(header.type);
        
        return (
          <div className={className}>
            {header.type === 'boolean' && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                formattedValue === 'Yes' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
              }`}>
                {formattedValue}
              </span>
            )}
            {header.type !== 'boolean' && (
              <span className={header.type === 'string' ? 'max-w-[300px] truncate' : ''}>
                {formattedValue}
              </span>
            )}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
      filterFn: (row, id, value) => {
        // Handle array filters (from faceted filter)
        if (Array.isArray(value) && value.length > 0) {
          const cellValue = String(row.getValue(id) || '');
          return value.includes(cellValue);
        }
        // Handle string filters (from search input)
        if (typeof value === 'string' && value.length > 0) {
          const cellValue = String(row.getValue(id) || '').toLowerCase();
          return cellValue.includes(value.toLowerCase());
        }
        return true;
      },
    };

    // Add specific configurations based on data type
    if (header.type === 'number' || header.type === 'currency') {
      baseColumn.meta = {
        align: 'right',
      };
    }

    return baseColumn;
  });
}

// Get CSS classes for column based on data type
function getColumnClassName(type: HeaderDefinition['type']): string {
  switch (type) {
    case 'number':
    case 'currency':
      return 'text-right font-mono';
    case 'date':
      return 'font-mono text-sm';
    case 'boolean':
      return 'text-center';
    case 'string':
    default:
      return 'text-left';
  }
}

// Add selection column (optional)
export function addSelectionColumn(columns: ColumnDef<DataRow>[]): ColumnDef<DataRow>[] {
  const selectionColumn: ColumnDef<DataRow> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  return [selectionColumn, ...columns];
}