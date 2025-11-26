"use client"

import { Pencil, Trash2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Schedule {
  id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
}

interface ScheduleItemProps {
  schedule: Schedule
  onEdit: (schedule: Schedule) => void
  onDelete: (id: string) => void
}

export function ScheduleItem({ schedule, onEdit, onDelete }: ScheduleItemProps) {
  const startDate = new Date(schedule.start_time)
  const endDate = new Date(schedule.end_time)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isToday = new Date().toDateString() === startDate.toDateString()
  const isPast = endDate < new Date()

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md ${isPast ? "opacity-60" : ""}`}
    >
      <div className="flex">
        {/* Time Column */}
        <div className="flex w-32 shrink-0 flex-col items-center justify-center border-r bg-muted/30 p-4 text-center">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {formatTime(startDate)}
          </span>
          <div className="my-1 h-4 w-px bg-border" />
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {formatTime(endDate)}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold tracking-tight text-card-foreground">{schedule.title}</h3>
                {isToday && (
                  <span className="rounded-full bg-success/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-success">
                    Today
                  </span>
                )}
              </div>
              {schedule.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{schedule.description}</p>
              )}
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(startDate)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(schedule)}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{schedule.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(schedule.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
