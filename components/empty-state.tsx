import { CalendarDays } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 py-16 text-center">
      <div className="rounded-full bg-muted p-4">
        <CalendarDays className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No schedules yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">Create your first schedule to get started</p>
    </div>
  )
}
