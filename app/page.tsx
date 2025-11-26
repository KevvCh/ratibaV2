"use client"

import { useState, useEffect } from "react"
import { CalendarDays, Moon, Sun } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { ScheduleForm } from "@/components/schedule-form"
import { ScheduleItem } from "@/components/schedule-item"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Schedule {
  id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
}

export default function Home() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    const { data: schedules, error } = await supabase
      .from("schedules")
      .select("*")
      .order("start_time", { ascending: true })
    if (error) console.error("Error fetching schedules:", error)
    else setSchedules(schedules as Schedule[])
  }

  const handleSubmit = async (formData: Omit<Schedule, "id">) => {
    if (editingSchedule) {
      const { error } = await supabase.from("schedules").update(formData).eq("id", editingSchedule.id)
      if (error) {
        console.error("Error updating schedule:", error)
      } else {
        setSchedules(
          schedules.map((schedule) =>
            schedule.id === editingSchedule.id ? { ...editingSchedule, ...formData } : schedule,
          ),
        )
        setEditingSchedule(null)
        setDialogOpen(false)
      }
    } else {
      const { data, error } = await supabase.from("schedules").insert([formData]).select()
      if (error) {
        console.error("Error adding schedule:", error)
      } else if (data) {
        setSchedules(
          [...schedules, data[0] as Schedule].sort(
            (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
          ),
        )
        setDialogOpen(false)
      }
    }
  }

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("schedules").delete().eq("id", id)
    if (error) console.error("Error deleting schedule:", error)
    else setSchedules(schedules.filter((schedule) => schedule.id !== id))
  }

  const handleCancel = () => {
    setEditingSchedule(null)
  }

  const now = new Date()
  const upcomingSchedules = schedules.filter((s) => new Date(s.end_time) >= now)
  const pastSchedules = schedules.filter((s) => new Date(s.end_time) < now)

  const displayedSchedules = activeTab === "upcoming" ? upcomingSchedules : pastSchedules

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-foreground p-2">
              <CalendarDays className="h-5 w-5 text-background" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Ratiba</h1>
              <p className="text-xs text-muted-foreground">Schedule Manager</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)} className="h-9 w-9">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <ScheduleForm
              editingSchedule={editingSchedule}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              open={dialogOpen}
              onOpenChange={setDialogOpen}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6 flex items-center justify-between">
            <TabsList className="bg-muted">
              <TabsTrigger value="upcoming" className="gap-2">
                Upcoming
                {upcomingSchedules.length > 0 && (
                  <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs">{upcomingSchedules.length}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="past" className="gap-2">
                Past
                {pastSchedules.length > 0 && (
                  <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs">{pastSchedules.length}</span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upcoming" className="mt-0">
            {upcomingSchedules.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-3">
                {upcomingSchedules.map((schedule) => (
                  <ScheduleItem key={schedule.id} schedule={schedule} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-0">
            {pastSchedules.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 py-16 text-center">
                <p className="text-sm text-muted-foreground">No past schedules</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pastSchedules.map((schedule) => (
                  <ScheduleItem key={schedule.id} schedule={schedule} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
