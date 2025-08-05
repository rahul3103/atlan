"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DynamicTableToolbar } from "./dynamic-table-toolbar";
import {
  generateColumnsFromHeaders,
  convertRowsToObjects,
  addSelectionColumn,
} from "./dynamic-columns";
import { HeaderDefinition, DataRow } from "./types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadCSV } from "@/lib/csv-export";

interface DynamicDataTableProps {
  headers: HeaderDefinition[];
  rows: any[][];
  isLoading?: boolean;
  showSelection?: boolean;
}

export function DynamicDataTable({
  headers,
  rows,
  isLoading = false,
  showSelection = false,
}: DynamicDataTableProps) {
  // Convert rows to objects and memoize
  const data = React.useMemo(() => {
    if (!headers.length || !rows.length) {
      return [];
    }

    try {
      const result = convertRowsToObjects(headers, rows);
      return result;
    } catch (error) {
      return [];
    }
  }, [headers, rows]);

  // Generate columns and memoize
  const columns = React.useMemo(() => {
    if (!headers.length) {
      return [];
    }

    try {
      const baseColumns = generateColumnsFromHeaders(headers);
      // Add selection column as first column if showSelection is true
      return showSelection ? addSelectionColumn(baseColumns) : baseColumns;
    } catch (error) {
      return [];
    }
  }, [headers, showSelection]);

  // Table state
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
    enableRowSelection: showSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Handle CSV download
  const handleDownloadSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
    if (selectedRows.length === 0) {
      return;
    }
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `selected-data-${timestamp}.csv`;
    downloadCSV(selectedRows, headers, filename);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-sm text-gray-600">Loading results...</span>
        </div>
      </div>
    );
  }

  if (!headers.length || !data.length) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">No data to display</div>
          <div className="text-gray-400 text-sm">
            Execute a SQL query to see results here
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <DynamicTableToolbar table={table} headers={headers} />
      
      {/* Table Info */}
      <div className="flex items-center justify-between">
        {showSelection && (
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected
            </div>
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadSelected}
                className="h-8"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Selected CSV
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} />
    </div>
  );
}
