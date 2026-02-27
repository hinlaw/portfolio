"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Matcher } from "react-day-picker"

interface DatePickerProps {
  date?: Date
  onDateChange: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  error?: boolean
  dateFormat?: string
  showIcon?: boolean
  className?: string
  buttonClassName?: string
  disabledDates?: Matcher | Matcher[]
}

export function DatePicker({
  date,
  onDateChange,
  disabled = false,
  placeholder = "Pick a date",
  error = false,
  dateFormat = "yyyy-MM-dd",
  showIcon = false,
  className,
  buttonClassName,
  disabledDates,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            error && "border-destructive",
            buttonClassName || className
          )}
        >
          {showIcon && <CalendarIcon className="mr-2 h-4 w-4" />}
          {date ? format(date, dateFormat) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            onDateChange(selectedDate)
            setOpen(false)
          }}
          disabled={disabledDates || disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
