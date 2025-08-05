"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HeaderDefinition } from "../dynamic-table/types";

interface AxisSelectorProps {
  headers: HeaderDefinition[];
  xAxis: string;
  yAxis: string;
  onXAxisChange: (value: string) => void;
  onYAxisChange: (value: string) => void;
}

export function AxisSelector({
  headers,
  xAxis,
  yAxis,
  onXAxisChange,
  onYAxisChange,
}: AxisSelectorProps) {
  // Filter headers for X-axis (string, date types)
  const xAxisOptions = React.useMemo(() => {
    return headers.filter(h => ['string', 'date'].includes(h.type));
  }, [headers]);

  // Filter headers for Y-axis (number, currency types only)
  const yAxisOptions = React.useMemo(() => {
    return headers.filter(h => ['number', 'currency'].includes(h.type));
  }, [headers]);

  if (headers.length === 0) {
    return (
      <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
        <div className="text-sm text-gray-500">
          No data available for axis selection
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="text-sm font-medium">Chart Configuration</div>
      
      {/* X-Axis Selector */}
      <div className="space-y-2">
        <Label htmlFor="x-axis-select" className="text-xs text-gray-600">
          X-Axis (Categories)
        </Label>
        <Select value={xAxis} onValueChange={onXAxisChange}>
          <SelectTrigger id="x-axis-select" className="w-full">
            <SelectValue placeholder="Select X-axis column" />
          </SelectTrigger>
          <SelectContent>
            {xAxisOptions.map((header) => (
              <SelectItem key={header.key} value={header.key}>
                <div className="flex items-center gap-2">
                  <span>{header.label}</span>
                  <span className="text-xs text-gray-500">({header.type})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {xAxisOptions.length === 0 && (
          <div className="text-xs text-red-500">
            No suitable columns for X-axis (requires string or date type)
          </div>
        )}
      </div>

      {/* Y-Axis Selector */}
      <div className="space-y-2">
        <Label htmlFor="y-axis-select" className="text-xs text-gray-600">
          Y-Axis (Values)
        </Label>
        <Select value={yAxis} onValueChange={onYAxisChange}>
          <SelectTrigger id="y-axis-select" className="w-full">
            <SelectValue placeholder="Select Y-axis column" />
          </SelectTrigger>
          <SelectContent>
            {yAxisOptions.map((header) => (
              <SelectItem key={header.key} value={header.key}>
                <div className="flex items-center gap-2">
                  <span>{header.label}</span>
                  <span className="text-xs text-gray-500">({header.type})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {yAxisOptions.length === 0 && (
          <div className="text-xs text-red-500">
            No suitable columns for Y-axis (requires number or currency type)
          </div>
        )}
      </div>

      {/* Configuration Info */}
      {xAxis && yAxis && (
        <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
          ✓ Chart configured: {headers.find(h => h.key === xAxis)?.label} vs {headers.find(h => h.key === yAxis)?.label}
        </div>
      )}
    </div>
  );
}
