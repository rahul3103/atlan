"use client";

import * as React from "react";
import { BarChart3, LineChart, Table2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// View type definitions
export type ViewType = "table" | "line-chart" | "bar-chart";

interface ViewOption {
  type: ViewType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  className?: string;
  chartsEnabled?: boolean;
}

const viewOptions: ViewOption[] = [
  {
    type: "table",
    label: "Table",
    icon: Table2,
    description: "Display data in a sortable table format",
  },
  {
    type: "line-chart",
    label: "Line Chart",
    icon: LineChart,
    description: "Show trends over time with line visualization",
  },
  {
    type: "bar-chart",
    label: "Bar Chart",
    icon: BarChart3,
    description: "Compare values with bar visualization",
  },
];

export function ViewSelector({
  currentView,
  onViewChange,
  className,
  chartsEnabled = true,
}: ViewSelectorProps) {
  return (
    <Tabs
      value={currentView}
      onValueChange={(value) => onViewChange(value as ViewType)}
      className={cn("w-auto", className)}
    >
      <TabsList className="grid w-full grid-cols-3">
        {viewOptions.map((option) => {
          const Icon = option.icon;
          const isChartOption =
            option.type === "line-chart" || option.type === "bar-chart";
          const isDisabled = isChartOption && !chartsEnabled;

          return (
            <TabsTrigger
              key={option.type}
              value={option.type}
              title={
                isDisabled
                  ? "Charts require both categorical and numeric columns"
                  : option.description
              }
              disabled={isDisabled}
              className={cn(isDisabled && "cursor-not-allowed opacity-50")}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{option.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}

// Export types for use in other components
export { type ViewOption };
