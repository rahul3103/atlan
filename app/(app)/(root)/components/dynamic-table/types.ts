// Type definitions for dynamic table components

export interface HeaderDefinition {
  key: string;
  label: string;
  type: 'string' | 'number' | 'currency' | 'date' | 'boolean';
}

export interface ApiResponse {
  success: boolean;
  executionTime: string;
  rowCount: number;
  query: string;
  result: {
    headers: HeaderDefinition[];
    rows: any[][];
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  query: string;
  result: {
    headers: HeaderDefinition[];
    rows: any[][];
  };
}

export type ApiResult = ApiResponse | ApiErrorResponse;

// Generic data row type - will be converted from arrays to objects
export type DataRow = Record<string, any>;

// Table state interface
export interface TableState {
  data: DataRow[];
  headers: HeaderDefinition[];
  isLoading: boolean;
  error: string | null;
}