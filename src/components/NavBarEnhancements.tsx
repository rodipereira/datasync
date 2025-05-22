
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  HelpCircle,
  Settings,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function NavBarActions() {
  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Ajuda</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Centro de ajuda</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Configurações</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Configurações do sistema</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <ThemeToggle />
    </div>
  );
}
