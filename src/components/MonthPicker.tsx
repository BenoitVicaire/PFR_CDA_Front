import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Août", "Sep", "Oct", "Nov", "Déc"]
const MONTH_LABELS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
]

interface MonthPickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MonthPicker({ value, onChange, placeholder = "Tous les mois" }: MonthPickerProps) {
  const [open, setOpen] = useState(false)
  const [year, setYear] = useState(() => (value ? Number(value.slice(0, 4)) : new Date().getFullYear()))

  const selectedYear = value ? Number(value.slice(0, 4)) : null
  const selectedMonthIndex = value ? Number(value.slice(5, 7)) - 1 : null
  const label = value ? `${MONTH_LABELS[selectedMonthIndex!]} ${selectedYear}` : placeholder

  function selectMonth(monthIndex: number) {
    onChange(`${year}-${String(monthIndex + 1).padStart(2, "0")}`)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("justify-start font-normal", !value && "text-muted-foreground")}
        >
          <Calendar />
          <span className="capitalize">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Année précédente"
            onClick={() => setYear((current) => current - 1)}
          >
            <ChevronLeft />
          </Button>
          <p className="text-sm font-medium text-primary">{year}</p>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Année suivante"
            onClick={() => setYear((current) => current + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1">
          {MONTHS.map((month, index) => (
            <Button
              key={month}
              type="button"
              variant={selectedYear === year && selectedMonthIndex === index ? "default" : "ghost"}
              size="sm"
              onClick={() => selectMonth(index)}
            >
              {month}
            </Button>
          ))}
        </div>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2 w-full text-muted-foreground"
            onClick={() => {
              onChange("")
              setOpen(false)
            }}
          >
            Tous les mois
          </Button>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
