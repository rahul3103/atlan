import { HeaderDefinition } from "@/app/(app)/(root)/components/dynamic-table/types";

export function downloadCSV(
  data: any[],
  headers: HeaderDefinition[],
  filename: string = "export.csv"
) {
  if (!data.length) {
    return;
  }

  // Create CSV header row
  const csvHeaders = headers.map(header => `"${header.label}"`).join(",");
  
  // Create CSV data rows
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header.key];
      // Handle null/undefined values
      if (value === null || value === undefined) {
        return '""';
      }
      // Escape quotes and wrap in quotes
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    }).join(",");
  });

  // Combine header and data
  const csvContent = [csvHeaders, ...csvRows].join("\n");

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}