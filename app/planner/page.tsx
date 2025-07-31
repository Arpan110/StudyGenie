"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  Plus,
  ArrowLeft,
  Bell,
  BookOpen,
  Target,
  Trash2,
  Zap,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Github,
  Linkedin,
  Mail,
} from "lucide-react"
import Link from "next/link"

interface StudyTask {
  id: string
  title: string
  subject: string
  description: string
  date: string
  time: string
  duration: number
  priority: "low" | "medium" | "high"
  completed: boolean
}

export default function PlannerPage() {
  const [tasks, setTasks] = useState<StudyTask[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    subject: "",
    description: "",
    time: "",
    duration: 60,
    priority: "medium" as "low" | "medium" | "high",
  })
  const [showContactModal, setShowContactModal] = useState(false)

  // Sample tasks for demonstration
  useEffect(() => {
    const sampleTasks: StudyTask[] = [
      {
        id: "1",
        title: "Review Calculus Chapter 5",
        subject: "Mathematics",
        description: "Focus on derivatives and integration",
        date: new Date().toISOString().split("T")[0],
        time: "09:00",
        duration: 90,
        priority: "high",
        completed: false,
      },
      {
        id: "2",
        title: "Chemistry Lab Report",
        subject: "Chemistry",
        description: "Complete organic chemistry lab analysis",
        date: new Date().toISOString().split("T")[0],
        time: "14:00",
        duration: 120,
        priority: "medium",
        completed: false,
      },
    ]
    setTasks(sampleTasks)
  }, [])

  const addTask = () => {
    if (!newTask.title.trim()) return

    const task: StudyTask = {
      id: Date.now().toString(),
      title: newTask.title,
      subject: newTask.subject,
      description: newTask.description,
      date: selectedDate,
      time: newTask.time,
      duration: newTask.duration,
      priority: newTask.priority,
      completed: false,
    }

    setTasks((prev) => [...prev, task])
    setNewTask({
      title: "",
      subject: "",
      description: "",
      time: "",
      duration: 60,
      priority: "medium",
    })
    setIsDialogOpen(false)
  }

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const getTasksForDate = (date: string) => {
    return tasks.filter((task) => task.date === date).sort((a, b) => a.time.localeCompare(b.time))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getWeekDates = () => {
    const today = new Date()
    const week = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      week.push(date)
    }
    return week
  }

  const weekDates = getWeekDates()
  const todayTasks = getTasksForDate(selectedDate)
  const totalStudyTime = todayTasks.reduce((total, task) => total + task.duration, 0)
  const completedTasks = todayTasks.filter((task) => task.completed).length

  const stats = [
    {
      label: "Today's Tasks",
      value: todayTasks.length,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Study Time",
      value: `${Math.floor(totalStudyTime / 60)}h ${totalStudyTime % 60}m`,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Remaining",
      value: todayTasks.length - completedTasks,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  // Contact Modal Component (updated)
  const ContactModal = () => (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${showContactModal ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div
        className={`bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 ${showContactModal ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h3>
          <p className="text-gray-600">Need help with study planning? Connect with me!</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100">Email</p>
              <a
                href="mailto:arpan0325@gmail.com"
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors text-sm"
              >
                arpan0325@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Linkedin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100">LinkedIn</p>
              <a
                href="https://www.linkedin.com/in/arpan-paul-a204a3283"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm"
              >
                Connect with me
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-xl flex items-center justify-center">
              <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100">GitHub</p>
              <a
                href="https://github.com/Arpan110"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm"
              >
                @Arpan110
              </a>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button onClick={() => setShowContactModal(false)} variant="outline" className="flex-1">
            Close
          </Button>
          <Button
            onClick={() => {
              window.open("mailto:arpan0325@gmail.com?subject=StudyGenie Planner Help", "_blank")
              setShowContactModal(false)
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Send Email
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Enhanced Header */}
      <header className="border-b bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hover:bg-purple-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Smart Study Planner
                  </h1>
                  <p className="text-xs text-gray-500">Organize your learning journey</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 px-3 py-1">
                <Bell className="w-3 h-3 mr-1" />
                Reminders Active
              </Badge>
              <Badge variant="outline" className="hidden md:flex">
                <Zap className="w-3 h-3 mr-1" />
                Smart Mode
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowContactModal(true)}
                className="text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              >
                Help
              </Button>
              <Link href="/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Week View */}
          <Card className="lg:col-span-2 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-lg">Weekly Overview</span>
                    <p className="text-sm text-gray-600 font-normal">Plan your study schedule</p>
                  </div>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <Plus className="w-4 h-4 text-white" />
                        </div>
                        <span>Add New Study Task</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Task title"
                        value={newTask.title}
                        onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                        className="border-2 border-gray-200 focus:border-purple-400 rounded-xl"
                      />
                      <Input
                        placeholder="Subject"
                        value={newTask.subject}
                        onChange={(e) => setNewTask((prev) => ({ ...prev, subject: e.target.value }))}
                        className="border-2 border-gray-200 focus:border-purple-400 rounded-xl"
                      />
                      <Textarea
                        placeholder="Description (optional)"
                        value={newTask.description}
                        onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                        className="border-2 border-gray-200 focus:border-purple-400 rounded-xl resize-none"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="time"
                          value={newTask.time}
                          onChange={(e) => setNewTask((prev) => ({ ...prev, time: e.target.value }))}
                          className="border-2 border-gray-200 focus:border-purple-400 rounded-xl"
                        />
                        <Input
                          type="number"
                          placeholder="Duration (minutes)"
                          value={newTask.duration}
                          onChange={(e) =>
                            setNewTask((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) || 60 }))
                          }
                          className="border-2 border-gray-200 focus:border-purple-400 rounded-xl"
                        />
                      </div>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value: "low" | "medium" | "high") =>
                          setNewTask((prev) => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger className="border-2 border-gray-200 focus:border-purple-400 rounded-xl">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={addTask}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-3 mb-6">
                {weekDates.map((date, index) => {
                  const dateStr = date.toISOString().split("T")[0]
                  const dayTasks = getTasksForDate(dateStr)
                  const isSelected = dateStr === selectedDate
                  const isToday = dateStr === new Date().toISOString().split("T")[0]

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl"
                          : isToday
                            ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-2 border-purple-300 shadow-lg"
                            : "bg-white hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200"
                      }`}
                      onClick={() => setSelectedDate(dateStr)}
                    >
                      <div className="text-xs font-medium mb-1">
                        {date.toLocaleDateString("en", { weekday: "short" })}
                      </div>
                      <div className="text-xl font-bold mb-2">{date.getDate()}</div>
                      <div className="text-xs">
                        {dayTasks.length > 0 ? (
                          <Badge
                            variant="secondary"
                            className={`text-xs ${isSelected ? "bg-white/20 text-white" : "bg-purple-100 text-purple-700"}`}
                          >
                            {dayTasks.length} tasks
                          </Badge>
                        ) : (
                          <span className={isSelected ? "text-white/70" : "text-gray-400"}>No tasks</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Today's Schedule */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg">
                    {selectedDate === new Date().toISOString().split("T")[0] ? "Today's Schedule" : "Selected Day"}
                  </span>
                  <p className="text-sm text-gray-600 font-normal">
                    {new Date(selectedDate).toLocaleDateString("en", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {todayTasks.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Tasks Scheduled</h3>
                    <p className="text-gray-600 mb-4">Add some study tasks to get started</p>
                    <Button
                      onClick={() => setIsDialogOpen(true)}
                      variant="outline"
                      className="hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Task
                    </Button>
                  </div>
                ) : (
                  todayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                        task.completed
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                          : "bg-white border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleTask(task.id)}
                              className="w-5 h-5 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                            />
                            <h3
                              className={`font-semibold text-lg ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}
                            >
                              {task.title}
                            </h3>
                          </div>

                          {task.subject && (
                            <div className="mb-2">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                <BookOpen className="w-3 h-3 mr-1" />
                                {task.subject}
                              </Badge>
                            </div>
                          )}

                          {task.description && (
                            <p className="text-gray-600 text-sm mb-3 leading-relaxed">{task.description}</p>
                          )}

                          <div className="flex items-center space-x-3 text-xs">
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {task.priority.toUpperCase()}
                            </Badge>
                            <div className="flex items-center space-x-1 text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{task.time}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-500">
                              <Target className="w-3 h-3" />
                              <span>{task.duration}min</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Contact Modal */}
      <ContactModal />
    </div>
  )
}
