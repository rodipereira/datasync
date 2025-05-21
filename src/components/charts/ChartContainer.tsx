
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

interface ChartContainerProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
  headerContent?: ReactNode;
}

export const ChartContainer = ({ 
  title, 
  description, 
  children, 
  className = "", 
  headerContent 
}: ChartContainerProps) => {
  return (
    <Card className={`dashboard-chart ${className}`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
            <CardDescription className="text-gray-300">
              {description}
            </CardDescription>
          </div>
          {headerContent}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
