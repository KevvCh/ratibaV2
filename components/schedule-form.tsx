"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Schedule {
  id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
}

interface ScheduleFormProps {
  editingSchedule: Schedule | null
  onSubmit: (schedule: Omit<Schedule, "id">) => void
  onCancel: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ScheduleForm({ editingSchedule, onSubmit, onCancel, open, onOpenChange }: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
  })

  useEffect(() => {
    if (editingSchedule) {
      setFormData({
        title: editingSchedule.title,
        description: editingSchedule.description ?? "",
        start_time: new Date(editingSchedule.start_time).toISOString().slice(0, 16),
        end_time: new Date(editingSchedule.end_time).toISOString().slice(0, 16),
      })
    } else {
      setFormData({ title: "", description: "", start_time: "", end_time: "" })
    }
  }, [editingSchedule])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ title: "", description: "", start_time: "", end_time: "" })
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onCancel()
      setFormData({ title: "", description: "", start_time: "", end_time: "" })
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="h-5 w-5" />
            {editingSchedule ? "Edit Schedule" : "Create New Schedule"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Meeting title"
              className="h-11"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add details about this schedule..."
              className="min-h-[80px] resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="start_time"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Start Time
              </Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                End Time
              </Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="h-11"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingSchedule ? "Update" : "Create Schedule"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
