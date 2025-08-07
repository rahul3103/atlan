"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/copy-button";

const predefinedQueries = {
  "all-customers": {
    name: "All Customers",
    query: "SELECT * FROM customers",
  },
  "all-orders": {
    name: "All Orders",
    query: "SELECT * FROM orders",
  },
  "all-products": {
    name: "All Products",
    query: "SELECT * FROM products",
  },
  "all-categories": {
    name: "All Categories",
    query: "SELECT * FROM categories",
  },
  "all-employees": {
    name: "All Employees",
    query: "SELECT * FROM employees",
  },
  "all-suppliers": {
    name: "All Suppliers",
    query: "SELECT * FROM suppliers",
  },
};

export function SQLQuerySelector() {
  const [activeQuery, setActiveQuery] =
    React.useState<keyof typeof predefinedQueries>("all-customers");
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasCopied]);

  return (
    <div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
      <figure data-rehype-pretty-code-figure="">
        <div className="">
          <Tabs
            value={activeQuery}
            onValueChange={(value) =>
              setActiveQuery(value as keyof typeof predefinedQueries)
            }
            className="gap-0"
          >
            <div className="border-border/50 flex items-center gap-2 border-b px-3 py-1">
              <TabsList className="no-scrollbar justify-normal overflow-x-auto rounded-none bg-transparent p-0">
                {Object.entries(predefinedQueries).map(([key, { name }]) => {
                  return (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="data-[state=active]:bg-accent data-[state=active]:border-input h-7 border border-transparent pt-0.5 data-[state=active]:shadow-none"
                    >
                      {name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
            <div className="">
              {Object.entries(predefinedQueries).map(([key, { query }]) => {
                return (
                  <TabsContent
                    key={key}
                    value={key}
                    className="mt-0 px-4 py-3.5"
                  >
                    <pre>
                      <code
                        className="relative font-mono text-sm leading-none"
                        data-language="sql"
                      >
                        {query}
                      </code>
                    </pre>
                  </TabsContent>
                );
              })}
            </div>
          </Tabs>
          <CopyButton value={predefinedQueries[activeQuery].query} />
        </div>
      </figure>
    </div>
  );
}
