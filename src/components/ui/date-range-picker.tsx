
"use client"

import * as React from "react"
import { format } from "date-fns"
import { pt } from "date-fns/locale"
import { CalendarRange } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DateRange } from "react-day-picker"

interface DateRangePickerProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarRange className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd/MM/yyyy", { locale: pt })} -{" "}
                  {format(dateRange.to, "dd/MM/yyyy", { locale: pt })}
                </>
              ) : (
                format(dateRange.from, "dd/MM/yyyy", { locale: pt })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            locale={pt}
            numberOfMonths={2}
            className="bg-background text-foreground pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function PresetDateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  const today = new Date()
  
  // Create a function to set date ranges based on preset options
  const setDateRange = (days: number) => {
    const from = new Date()
    const to = new Date()
    from.setDate(from.getDate() - days)
    onDateRangeChange({ from, to })
  }
  
  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setDateRange(7)}
        >
          7 dias
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setDateRange(30)}
        >
          30 dias
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setDateRange(90)}
        >
          90 dias
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDateRangeChange(undefined)}
        >
          Limpar
        </Button>
      </div>
      <DateRangePicker 
        dateRange={dateRange} 
        onDateRangeChange={onDateRangeChange} 
      />
    </div>
  )
}
