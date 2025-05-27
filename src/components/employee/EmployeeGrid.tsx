
import EmployeeCard from "./EmployeeCard";

interface Employee {
  id: string;
  name: string;
  position: string;
  hire_date: string;
  created_at: string;
  avatar_url?: string | null;
}

interface EmployeeGridProps {
  employees: Employee[];
  onViewMetrics: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

const EmployeeGrid = ({ employees, onViewMetrics, onDeleteClick }: EmployeeGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onViewMetrics={onViewMetrics}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
};

export default EmployeeGrid;
