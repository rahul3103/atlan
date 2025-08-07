"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SQLQuerySelector } from "@/components/sql-query-selector";
import { ViewSelector, ViewType } from "@/components/view-selector";

import { AxisSelector } from "./components/charts/axis-selector";
import { ChartBar } from "./components/charts/bar-chart";
import { ChartLine } from "./components/charts/line-chart";
import { convertRowsToObjects } from "./components/dynamic-table/dynamic-columns";
import { DynamicDataTable } from "./components/dynamic-table/dynamic-data-table";
import { HeaderDefinition } from "./components/dynamic-table/types";

export default function Home() {
  const [input, setInput] = useState("SELECT * FROM customers");
  const [headers, setHeaders] = useState<HeaderDefinition[]>([]);
  const [rows, setRows] = useState<any[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("table");
  const [executionTime, setExecutionTime] = useState<string | null>(null);

  // Chart configuration state
  const [xAxis, setXAxis] = useState<string>("");
  const [yAxis, setYAxis] = useState<string>("");

  // Auto-select axes when data changes
  useEffect(() => {
    if (headers.length > 0) {
      const xAxisOptions = headers.filter((h) =>
        ["string", "date"].includes(h.type)
      );
      const yAxisOptions = headers.filter((h) =>
        ["number", "currency"].includes(h.type)
      );

      // Always set default axes when headers change
      if (xAxisOptions.length > 0) {
        setXAxis(xAxisOptions[0].key);
      } else {
        setXAxis("");
      }

      if (yAxisOptions.length > 0) {
        setYAxis(yAxisOptions[0].key);
      } else {
        setYAxis("");
      }
    } else {
      setXAxis("");
      setYAxis("");
    }
  }, [headers]);

  // Check if charts are available
  const chartCapability = useMemo(() => {
    if (headers.length === 0)
      return { hasXAxis: false, hasYAxis: false, canChart: false };

    const xAxisOptions = headers.filter((h) =>
      ["string", "date"].includes(h.type)
    );
    const yAxisOptions = headers.filter((h) =>
      ["number", "currency"].includes(h.type)
    );

    return {
      hasXAxis: xAxisOptions.length > 0,
      hasYAxis: yAxisOptions.length > 0,
      canChart: xAxisOptions.length > 0 && yAxisOptions.length > 0,
    };
  }, [headers]);

  // Transform data for charts
  const chartData = useMemo(() => {
    if (!xAxis || !yAxis || !headers.length || !rows.length) {
      return [];
    }

    try {
      const objectData = convertRowsToObjects(headers, rows);
      const filteredData = objectData
        .map((row) => ({
          [xAxis]: row[xAxis],
          [yAxis]: row[yAxis],
          // Keep original row for debugging
          _original: row,
        }))
        .filter((item) => item[xAxis] != null && item[yAxis] != null);

      // Limit to first 100 data points for performance
      return filteredData.slice(0, 100);
    } catch (error) {
      return [];
    }
  }, [headers, rows, xAxis, yAxis]);

  // Auto-switch to table view if charts become unavailable
  useEffect(() => {
    if (
      !chartCapability.canChart &&
      (currentView === "bar-chart" || currentView === "line-chart")
    ) {
      setCurrentView("table");
    }
  }, [chartCapability.canChart, currentView]);

  const fetchSQLData = async () => {
    setIsLoading(true);
    setError(null);
    setExecutionTime(null);

    try {
      const response = await fetch("/api/execute-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Validate data structure
        if (data.result.headers.length === 0) {
          setError("No column headers received from server");
          return;
        }

        // Update state with structured data
        setHeaders(data.result.headers);
        setRows(data.result.rows);
        setExecutionTime(data.executionTime);
      } else {
        setError(data.error || data.message || "Unknown error occurred");
        setHeaders([]);
        setRows([]);
        setExecutionTime(null);
      }
    } catch (error) {
      setError("Failed to execute query. Please try again.");
      setHeaders([]);
      setRows([]);
      setExecutionTime(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-wrapper flex flex-col pb-6">
      <div className="theme-container container flex scroll-mt-20 flex-col gap-8">
        <div>
          <div className="flex flex-col gap-4">
            <SQLQuerySelector />
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your SQL query here..."
            />
            <Button
              onClick={fetchSQLData}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? "Executing..." : "Send Query"}
            </Button>
          </div>
          {/* lets add chart component LineChart Bar Chart table */}
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <div className="font-medium text-red-800">Query Error</div>
            <div className="mt-1 text-sm text-red-600">{error}</div>
          </div>
        )}

        {/* Results Section */}
        {(headers.length > 0 || isLoading) && (
          <div className="space-y-4">
            {/* View Selector */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {headers.length > 0 && !isLoading && executionTime && (
                  <>
                    Query executed in {executionTime} • {rows.length} rows
                    returned
                  </>
                )}
                {isLoading && <>Loading results...</>}
              </div>
              <ViewSelector
                currentView={currentView}
                onViewChange={setCurrentView}
                chartsEnabled={chartCapability.canChart}
              />
            </div>

            {/* Data Display */}
            {currentView === "table" && (
              <DynamicDataTable
                key={headers.map(h => h.key).join(',')}
                headers={headers}
                rows={rows}
                isLoading={isLoading}
                showSelection={true}
              />
            )}

            {(currentView === "bar-chart" || currentView === "line-chart") && (
              <div className="flex gap-6">
                <div className="flex-1">
                  {currentView === "bar-chart" && (
                    <ChartBar
                      data={chartData}
                      xAxis={xAxis}
                      yAxis={yAxis}
                      title="Bar Chart"
                      description={`${headers.find((h) => h.key === yAxis)?.label || "Data"} by ${headers.find((h) => h.key === xAxis)?.label || "Category"}`}
                    />
                  )}
                  {currentView === "line-chart" && (
                    <ChartLine
                      data={chartData}
                      xAxis={xAxis}
                      yAxis={yAxis}
                      title="Line Chart"
                      description={`${headers.find((h) => h.key === yAxis)?.label || "Data"} trend by ${headers.find((h) => h.key === xAxis)?.label || "Category"}`}
                    />
                  )}
                </div>
                <div className="w-80">
                  <AxisSelector
                    headers={headers}
                    xAxis={xAxis}
                    yAxis={yAxis}
                    onXAxisChange={setXAxis}
                    onYAxisChange={setYAxis}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
