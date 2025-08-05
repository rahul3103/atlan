"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

import { HeaderDefinition, DataRow } from "./types";
import { 
  generateFilterOptionsForColumn, 
  getFilterableColumns, 
  getSearchableColumn 
} from "./filter-utils";

interface DynamicTableToolbarProps {
  table: Table<DataRow>;
  headers: HeaderDefinition[];
}

export function DynamicTableToolbar({
  table,
  headers,
}: DynamicTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const filterableColumns = getFilterableColumns(headers);
  const searchableColumnKey = getSearchableColumn(headers);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2 min-w-0">
        {searchableColumnKey && table.getColumn(searchableColumnKey) && (
          <Input
            placeholder={`Filter ${headers.find(h => h.key === searchableColumnKey)?.label?.toLowerCase() || 'data'}...`}
            value={(table.getColumn(searchableColumnKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchableColumnKey)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px] flex-shrink-0"
          />
        )}
        
        <div className="flex items-center gap-2 overflow-x-auto flex-nowrap min-w-0">
          {filterableColumns.map((header) => {
            const column = table.getColumn(header.key);
            if (!column) return null;

            const filterOptions = generateFilterOptionsForColumn(table, header.key, header);
            
            if (filterOptions.length === 0) return null;

            return (
              <div key={header.key} className="flex-shrink-0">
                <DataTableFacetedFilter
                  column={column}
                  title={header.label}
                  options={filterOptions}
                />
              </div>
            );
          })}
        </div>
        
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
            className="flex-shrink-0"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}