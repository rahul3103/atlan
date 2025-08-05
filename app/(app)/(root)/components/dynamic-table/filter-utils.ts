import { Table } from "@tanstack/react-table";
import { CheckCircle, Hash, Calendar, DollarSign, Type, CircleOff } from "lucide-react";
import { HeaderDefinition, DataRow } from "./types";

export interface FilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function generateFilterOptionsForColumn(
  table: Table<DataRow>,
  columnKey: string,
  headerDef: HeaderDefinition
): FilterOption[] {
  const column = table.getColumn(columnKey);
  if (!column) return [];

  const facetedValues = column.getFacetedUniqueValues();
  const uniqueValues = Array.from(facetedValues.keys());

  switch (headerDef.type) {
    case 'boolean':
      return [
        {
          label: "Yes",
          value: "true",
          icon: CheckCircle,
        },
        {
          label: "No", 
          value: "false",
          icon: CircleOff,
        }
      ];

    case 'number':
    case 'currency':
      return uniqueValues
        .filter(value => value !== null && value !== undefined)
        .sort((a, b) => Number(a) - Number(b))
        .map(value => ({
          label: headerDef.type === 'currency' 
            ? `$${Number(value).toLocaleString()}` 
            : String(value),
          value: String(value),
          icon: headerDef.type === 'currency' ? DollarSign : Hash,
        }));

    case 'date':
      return uniqueValues
        .filter(value => value !== null && value !== undefined)
        .sort()
        .map(value => ({
          label: new Date(String(value)).toLocaleDateString(),
          value: String(value),
          icon: Calendar,
        }));

    case 'string':
    default:
      return uniqueValues
        .filter(value => value !== null && value !== undefined && String(value).trim() !== '')
        .sort()
        .map(value => ({
          label: String(value),
          value: String(value),
          icon: Type,
        }));
  }
}

export function getFilterableColumns(headers: HeaderDefinition[]): HeaderDefinition[] {
  return headers.filter(header => 
    header.type === 'string' || 
    header.type === 'boolean' ||
    (header.type === 'number' && headers.length < 50) ||
    (header.type === 'currency' && headers.length < 50)
  );
}

export function getSearchableColumn(headers: HeaderDefinition[]): string | null {
  const stringColumns = headers.filter(header => header.type === 'string');
  
  if (stringColumns.length === 0) {
    return headers[0]?.key || null;
  }
  
  // Prefer columns that are likely to contain searchable text content
  const preferredColumns = stringColumns.filter(header => {
    const key = header.key.toLowerCase();
    const label = header.label.toLowerCase();
    return (
      key.includes('name') || 
      key.includes('title') || 
      key.includes('description') ||
      key.includes('company') ||
      key.includes('city') ||
      key.includes('country') ||
      key.includes('address') ||
      label.includes('name') ||
      label.includes('title') ||
      label.includes('description') ||
      label.includes('company') ||
      label.includes('city') ||
      label.includes('country') ||
      label.includes('address')
    );
  });
  
  // If we found preferred columns, use the first one
  if (preferredColumns.length > 0) {
    return preferredColumns[0].key;
  }
  
  // Otherwise, avoid ID columns and use the first non-ID string column
  const nonIdColumns = stringColumns.filter(header => {
    const key = header.key.toLowerCase();
    const label = header.label.toLowerCase();
    return !key.includes('id') && !label.includes('id');
  });
  
  if (nonIdColumns.length > 0) {
    return nonIdColumns[0].key;
  }
  
  // Fallback to first string column
  return stringColumns[0].key;
}