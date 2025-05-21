
import React from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface MetricData {
  id: string;
  month: string;
  revenue: number;
  clients_acquired: number;
  employees_hired: number;
}

interface MetricsTableProps {
  metrics: MetricData[];
}

const MetricsTable = ({ metrics }: MetricsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mês</TableHead>
            <TableHead>Receita</TableHead>
            <TableHead>Clientes Adquiridos</TableHead>
            <TableHead>Funcionários Contratados</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric) => (
            <TableRow key={metric.id}>
              <TableCell className="font-medium">
                {format(new Date(metric.month), "MMMM yyyy", {
                  locale: pt,
                })}
              </TableCell>
              <TableCell>
                R${" "}
                {metric.revenue.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>{metric.clients_acquired}</TableCell>
              <TableCell>{metric.employees_hired}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MetricsTable;
