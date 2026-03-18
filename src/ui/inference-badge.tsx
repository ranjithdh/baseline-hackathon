import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";



const inferenceBadgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        0: "bg-chart-0 text-chart-3-foreground",
        1: "bg-chart-1 text-chart-1-foreground",
        2: "bg-chart-2 text-chart-2-foreground",
        3: "bg-chart-3 text-chart-3-foreground",
        4: "bg-chart-4 text-chart-4-foreground",
        5: "bg-chart-5 text-chart-5-foreground",
        default: "bg-foreground text-chart-3-foreground",
      },
    },
    defaultVariants: {
      variant: 1,
    },
  },
);

export interface InferenceBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inferenceBadgeVariants> {}

function InferenceBadge({ className, variant, ...props }: InferenceBadgeProps) {
  const safeVariant = variant ?? "default";
  return (
    <div
      className={cn(
        inferenceBadgeVariants({ variant: safeVariant }),
        className,
      )}
      {...props}
    />
  );
}

export { InferenceBadge, inferenceBadgeVariants };
