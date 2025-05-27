
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EmployeeSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const EmployeeSearch = ({ searchTerm, onSearchChange }: EmployeeSearchProps) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou cargo..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 border-primary/20 bg-secondary/50 text-foreground focus:border-primary/50 focus:ring focus:ring-primary/30"
        />
      </div>
    </div>
  );
};

export default EmployeeSearch;
