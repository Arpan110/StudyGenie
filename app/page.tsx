"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Brain,
  FileText,
  Calendar,
  MessageCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Users,
  Trophy,
  Star,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  Play,
  Award,
  TrendingUp,
  Shield,
  Rocket,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    setIsVisible(true)

    // Mouse tracking for parallax effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    // Scroll tracking for parallax effects
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const features = [
    {
      icon: MessageCircle,
      title: "AI Chat Assistant",
      description: "Get instant help with any academic question using advanced AI",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      href: "/chat",
      stats: "10K+ questions answered",
      delay: 0,
    },
    {
      icon: FileText,
      title: "Smart Summarizer",
      description: "Transform lengthy materials into concise, actionable summaries",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      href: "/summarizer",
      stats: "2.5K+ documents processed",
      delay: 200,
    },
    {
      icon: Calendar,
      title: "Study Planner",
      description: "Organize your learning with intelligent scheduling and reminders",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      href: "/planner",
      stats: "50K+ study hours planned",
      delay: 400,
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      content: "StudyGenie helped me ace my algorithms course. The AI explanations are incredibly clear!",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
      rating: 5,
      university: "MIT",
    },
    {
      name: "Marcus Johnson",
      role: "Medical Student",
      content: "The summarizer is a game-changer for processing research papers. Saves me hours every week.",
      avatar: "/placeholder.svg?height=40&width=40&text=MJ",
      rating: 5,
      university: "Harvard",
    },
    {
      name: "Elena Rodriguez",
      role: "Engineering Student",
      content: "Love the study planner! It keeps me organized and motivated throughout the semester.",
      avatar: "/placeholder.svg?height=40&width=40&text=ER",
      rating: 5,
      university: "Stanford",
    },
  ]

  const stats = [
    {
      label: "Active Students",
      value: "25K+",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Questions Solved",
      value: "100K+",
      icon: Brain,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Study Hours",
      value: "500K+",
      icon: Clock,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      label: "Success Rate",
      value: "98%",
      icon: Trophy,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ]

  const achievements = [
    { icon: Award, label: "Best AI Tool 2024", color: "text-yellow-600 dark:text-yellow-400" },
    { icon: TrendingUp, label: "Fastest Growing", color: "text-green-600 dark:text-green-400" },
    { icon: Shield, label: "Privacy First", color: "text-blue-600 dark:text-blue-400" },
    { icon: Rocket, label: "Innovation Award", color: "text-purple-600 dark:text-purple-400" },
  ]

  // Contact Modal Component
  const ContactModal = () => (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-500 ${
        showContactModal ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 dark:border-gray-700/20 transform transition-all duration-500 ${
          showContactModal ? "scale-100 translate-y-0 rotate-0" : "scale-95 translate-y-8 rotate-1"
        }`}
      >
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl animate-pulse-glow">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Get in Touch
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Connect with me through these platforms!</p>
        </div>

        <div className="space-y-4">
          {[
            {
              icon: Mail,
              label: "Email",
              value: "arpan0325@gmail.com",
              href: "mailto:arpan0325@gmail.com",
              bgColor: "bg-red-100 dark:bg-red-900/30",
              textColor: "text-red-600 dark:text-red-400",
              hoverColor: "hover:text-red-700 dark:hover:text-red-300",
            },
            {
              icon: Linkedin,
              label: "LinkedIn",
              value: "Connect with me",
              href: "https://www.linkedin.com/in/arpan-paul-a204a3283",
              bgColor: "bg-blue-100 dark:bg-blue-900/30",
              textColor: "text-blue-600 dark:text-blue-400",
              hoverColor: "hover:text-blue-700 dark:hover:text-blue-300",
            },
            {
              icon: Github,
              label: "GitHub",
              value: "@Arpan110",
              href: "https://github.com/Arpan110",
              bgColor: "bg-gray-100 dark:bg-gray-700/50",
              textColor: "text-gray-700 dark:text-gray-300",
              hoverColor: "hover:text-gray-900 dark:hover:text-gray-100",
            },
          ].map((contact, index) => (
            <div
              key={index}
              className={`flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-600 ${
                isMounted && isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
              }`}
              style={isMounted ? { transitionDelay: `${index * 100}ms` } : {}}
            >
              <div className={`w-14 h-14 ${contact.bgColor} rounded-2xl flex items-center justify-center shadow-lg`}>
                <contact.icon className={`w-7 h-7 ${contact.textColor}`} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">{contact.label}</p>
                <a
                  href={contact.href}
                  target={contact.href.startsWith("http") ? "_blank" : undefined}
                  rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`${contact.textColor} ${contact.hoverColor} transition-colors font-medium`}
                >
                  {contact.value}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-3 mt-8">
          <Button
            onClick={() => setShowContactModal(false)}
            variant="outline"
            className="flex-1 rounded-2xl border-2 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              window.open("mailto:arpan0325@gmail.com?subject=StudyGenie Inquiry", "_blank")
              setShowContactModal(false)
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Send Email
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Advanced Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Dynamic Gradient Mesh */}
        <div
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={isMounted ? {
            background: `
              radial-gradient(circle at ${mousePosition.x * 0.1}% ${mousePosition.y * 0.1}%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at ${100 - mousePosition.x * 0.1}% ${100 - mousePosition.y * 0.1}%, rgba(147, 51, 234, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
            `,
          } : {}}
        />

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-20 dark:opacity-10"
              style={{
                left: `${(i * 7) % 100}%`,
                top: `${(i * 11) % 100}%`,
                transform: isMounted ? `translate(${Math.sin(scrollY * 0.001 + i) * 20}px, ${Math.cos(scrollY * 0.001 + i) * 20}px) rotate(${Math.floor(scrollY * 0.1 + i * 30)}deg)` : 'none',
                transition: "transform 0.1s ease-out",
              }}
            >
              <div
                className={`w-${4 + (i % 4) * 2} h-${4 + (i % 4) * 2} ${
                  i % 3 === 0
                    ? "bg-blue-400/30 dark:bg-blue-500/20 rounded-full"
                    : i % 3 === 1
                      ? "bg-purple-400/30 dark:bg-purple-500/20 rotate-45"
                      : "bg-pink-400/30 dark:bg-pink-500/20 rounded-lg"
                } blur-sm`}
              />
            </div>
          ))}
        </div>

        {/* Animated Grid */}
        <div
          className="absolute inset-0 opacity-5 dark:opacity-3"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
            transform: isMounted ? `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)` : 'none',
          }}
        />

        {/* Particle System */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/40 dark:bg-blue-300/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                transform: isMounted ? `translate(${Math.sin(Date.now() * 0.001 + i) * 10}px, ${Math.cos(Date.now() * 0.001 + i) * 10}px)` : 'none',
              }}
            />
          ))}
        </div>

        {/* Floating Academic Images */}
        <div className="absolute inset-0 overflow-hidden">
          {[
            { icon: "📚", size: "text-4xl", delay: 0 },
            { icon: "🎓", size: "text-3xl", delay: 1000 },
            { icon: "📝", size: "text-2xl", delay: 2000 },
            { icon: "🧠", size: "text-3xl", delay: 1500 },
            { icon: "💡", size: "text-2xl", delay: 500 },
            { icon: "📊", size: "text-3xl", delay: 2500 },
            { icon: "🔬", size: "text-2xl", delay: 3000 },
            { icon: "📐", size: "text-2xl", delay: 1200 },
            { icon: "🎯", size: "text-3xl", delay: 800 },
            { icon: "⚡", size: "text-2xl", delay: 1800 },
          ].map((item, i) => (
            <div
              key={i}
              className={`absolute ${item.size} opacity-20 dark:opacity-10 animate-float pointer-events-none`}
              style={{
                left: `${(i * 11 + 10) % 90}%`,
                top: `${(i * 13 + 15) % 80}%`,
                animationDelay: `${item.delay}ms`,
                animationDuration: `${8 + (i % 3) * 2}s`,
                transform: isMounted ? `translate(${Math.sin(scrollY * 0.002 + i) * 30}px, ${Math.cos(scrollY * 0.002 + i) * 20}px) rotate(${Math.floor(scrollY * 0.05 + i * 15)}deg)` : 'none',
                transition: "transform 0.1s ease-out",
              }}
            >
              {item.icon}
            </div>
          ))}
        </div>

        {/* Floating Abstract Shapes as Images */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-10 dark:opacity-5 animate-drift pointer-events-none"
              style={{
                left: `${(i * 12 + 5) % 95}%`,
                top: `${(i * 17 + 10) % 85}%`,
                animationDelay: `${i * 400}ms`,
                animationDuration: `${12 + (i % 4) * 3}s`,
                transform: isMounted ? `translate(${Math.round(Math.sin(scrollY * 0.001 + i) * 25)}px, ${Math.round(Math.cos(scrollY * 0.001 + i) * 15)}px)` : 'none',
              }}
            >
              <div
                className={`w-${8 + (i % 3) * 4} h-${8 + (i % 3) * 4} ${
                  i % 4 === 0
                    ? "bg-gradient-to-br from-blue-400/30 to-cyan-400/30 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-full"
                    : i % 4 === 1
                      ? "bg-gradient-to-br from-purple-400/30 to-pink-400/30 dark:from-purple-500/20 dark:to-pink-500/20 rounded-lg rotate-45"
                      : i % 4 === 2
                        ? "bg-gradient-to-br from-green-400/30 to-emerald-400/30 dark:from-green-500/20 dark:to-emerald-500/20 rounded-full"
                        : "bg-gradient-to-br from-orange-400/30 to-red-400/30 dark:from-orange-500/20 dark:to-red-500/20 rounded-lg"
                } blur-sm shadow-lg`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Glassmorphism Header */}
        <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20 dark:border-gray-700/20 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    StudyGenie
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">AI-Powered Learning Platform</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-6">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 px-3 py-2 bg-white/50 dark:bg-gray-800/50 rounded-full backdrop-blur-sm border border-white/30 dark:border-gray-700/30 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-300 ${
                        isMounted && isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                      }`}
                      style={isMounted ? { transitionDelay: `${index * 100}ms` } : {}}
                    >
                      <achievement.icon className={`w-4 h-4 ${achievement.color}`} />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{achievement.label}</span>
                    </div>
                  ))}
                </div>

                <ThemeToggle />

                <Link href="/signin">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section with Advanced Animations */}
        <section ref={heroRef} className="relative py-32 overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <div
              className={`max-w-6xl mx-auto transition-all duration-1000 ${
                isMounted && isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
              }`}
            >
              <div className="flex justify-center mt-6 mb-8 animate-floating">
  <div className="flex items-center gap-2 px-7 py-3 bg-[#36235d] rounded-full border border-[#5b3e8d] backdrop-blur-sm text-base text-blue-100 font-semibold shadow-[0_0_12px_1px_rgba(88,101,242,0.3)]">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-blue-300"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.402 8.168L12 18.896l-7.336 3.864 1.402-8.168L.132 9.21l8.2-1.192z" />
    </svg>
    <span className="tracking-tight">
      Trusted by 25,000+ Students Worldwide
    </span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-blue-300"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.402 8.168L12 18.896l-7.336 3.864 1.402-8.168L.132 9.21l8.2-1.192z" />
    </svg>
  </div>
</div>
              {/* Main Heading with Staggered Animation */}
              <div className="space-y-4 mb-12">
                <h2 className="text-7xl md:text-8xl font-black leading-tight">
                  <span
                    className={`block bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-gray-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent transition-all duration-1000 ${
                      isMounted && isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                    }`}
                    style={isMounted ? { transitionDelay: "200ms" } : {}}
                  >
                    Your AI Study
                  </span>
                  <span
                    className={`block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent transition-all duration-1000 ${
                      isMounted && isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                    }`}
                    style={isMounted ? { transitionDelay: "400ms" } : {}}
                  >
                    Companion
                  </span>
                </h2>
              </div>

              <p
                className={`text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-16 leading-relaxed max-w-4xl mx-auto font-light transition-all duration-1000 ${
                  isMounted && isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={isMounted ? { transitionDelay: "600ms" } : {}}
              >
                Transform your learning experience with{" "}
                <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  AI-powered assistance
                </span>
                , smart summarization, and intelligent study planning.
              </p>

              {/* CTA Buttons with Advanced Hover Effects */}
              <div
                className={`flex flex-col sm:flex-row justify-center gap-6 mb-20 transition-all duration-1000 ${
                  isMounted && isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={isMounted ? { transitionDelay: "800ms" } : {}}
              >
                <Link href="/chat">
                  <Button
                    size="lg"
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 text-xl font-bold shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-110 hover:-translate-y-2 rounded-2xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <MessageCircle className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    Start Learning Now
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="lg"
                  className="group px-10 py-6 text-xl font-bold border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-500 hover:scale-105 hover:-translate-y-1 rounded-2xl shadow-lg hover:shadow-xl"
                >
                  <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Watch Demo
                </Button>
              </div>

              {/* Scroll Indicator */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const statsSection = document.querySelector('section[data-section="stats"]')
                    statsSection?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="group flex flex-col items-center space-y-2 cursor-pointer hover:scale-110 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 dark:border-gray-700/30 group-hover:bg-white/30 dark:group-hover:bg-gray-700/30 group-hover:border-white/50 dark:group-hover:border-gray-600/50 transition-all duration-300">
                    <ChevronDown className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 animate-bounce transition-colors duration-300" />
                  </div>
                  <span className="text-sm text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium transition-colors duration-300">
                    Scroll to explore
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section with Morphing Cards */}
        <section
          data-section="stats"
          className="py-24 bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-900/80 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`group text-center transition-all duration-700 hover:scale-110 ${
                    isMounted && isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={isMounted ? { transitionDelay: `${index * 150}ms` } : {}}
                >
                  <Card className="p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl group-hover:bg-white/90 dark:group-hover:bg-gray-700/90 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div
                        className={`w-20 h-20 ${stat.bgColor} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}
                      >
                        <stat.icon className={`w-10 h-10 ${stat.color}`} />
                      </div>
                      <div className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {stat.value}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 font-semibold text-lg">{stat.label}</div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section with 3D Card Effects */}
        <section className="py-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
            <Badge
            className="mb-6 px-6 py-3 text-lg font-semibold rounded-full 
            text-blue-200 bg-gradient-to-r from-[#1a237e] to-[#4a148c] 
            backdrop-blur-md 
            shadow-[0_0_20px_rgba(106,90,205,0.4)] 
            transition duration-300 ease-in-out 
            hover:brightness-150 hover:shadow-[0_0_35px_rgba(138,43,226,0.7)] 
            hover:-translate-y-1 hover:scale-105">Features</Badge>

              <h3 className="text-6xl font-black mb-8 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                Your AI Study Companion
              </h3>
              <p className="text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light">
                Discover the power of StudyGenie's AI features to enhance your learning journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group text-center transition-all duration-700 hover:scale-110 ${
                    isMounted && isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                  }`}
                  style={isMounted ? { transitionDelay: `${index * 200}ms` } : {}}
                >
                  <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-700 rounded-3xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div
                        className={`w-20 h-20 ${feature.bgColor} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}
                      >
                        <feature.icon className={`w-10 h-10 ${feature.iconColor}`} />
                      </div>
                      <div className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {feature.title}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 font-semibold text-lg mb-4">
                        {feature.description}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 font-semibold text-lg">{feature.stats}</div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials with Floating Cards */}
        <section className="py-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <Badge
             className="mb-6 px-6 py-3 text-lg font-semibold rounded-full 
             text-blue-200 bg-gradient-to-r from-[#1a237e] to-[#4a148c] 
             backdrop-blur-md 
             shadow-[0_0_20px_rgba(106,90,205,0.4)] 
             transition duration-300 ease-in-out 
             hover:brightness-150 hover:shadow-[0_0_35px_rgba(138,43,226,0.7)] 
             hover:-translate-y-1 hover:scale-105"
             >Testimonials</Badge>

              <h3 className="text-6xl font-black mb-8 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                Loved by Students Everywhere
              </h3>
              <p className="text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light">
                See how StudyGenie is transforming the way students learn and succeed
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-700 hover:scale-105 hover:-translate-y-2 rounded-3xl relative overflow-hidden ${
                    isMounted && isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                  }`}
                  style={isMounted ? {
                    transitionDelay: `${600 + index * 200}ms`,
                    transform: `translateY(${Math.sin(scrollY * 0.01 + index) * 5}px)`,
                  } : {}}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <CardContent className="relative z-10 p-8">
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                      ))}
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-8 italic text-lg leading-relaxed font-medium">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">{testimonial.name}</div>
                        <div className="text-gray-600 dark:text-gray-400 font-medium">{testimonial.role}</div>
                        <div className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                          {testimonial.university}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section with Particle Effects */}
        <section className="py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 relative overflow-hidden">
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 dark:bg-white/10 rounded-full animate-pulse"
                style={isMounted ? {
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                } : {}}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-5xl mx-auto text-white">
              <h3 className="text-6xl font-black mb-8">Ready to Transform Your Learning?</h3>
              <p className="text-2xl mb-16 opacity-90 leading-relaxed font-light max-w-3xl mx-auto">
                Join thousands of students who are already achieving academic excellence with StudyGenie
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/chat">
                  <Button
                    size="lg"
                    className="group bg-white text-blue-600 hover:bg-gray-100 px-10 py-6 text-xl font-bold shadow-2xl hover:shadow-white/25 transition-all duration-500 hover:scale-110 hover:-translate-y-2 rounded-2xl"
                  >
                    <Brain className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    Start Learning Free
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  className="group border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-6 text-xl font-bold transition-all duration-500 hover:scale-105 hover:-translate-y-1 rounded-2xl bg-transparent backdrop-blur-sm"
                >
                  <Calendar className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer with Glassmorphism */}
        <footer className="bg-gray-900/95 dark:bg-black/95 backdrop-blur-xl text-white py-20 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-3xl font-bold">StudyGenie</span>
                </div>
                <p className="text-gray-400 dark:text-gray-500 mb-8 max-w-md leading-relaxed text-lg">
                  Empowering students worldwide with AI-powered learning tools. Transform your study experience and
                  achieve academic excellence.
                </p>
                <div className="flex space-x-4">
                  {[
                    { icon: Github, href: "https://github.com/Arpan110" },
                    { icon: Linkedin, href: "https://www.linkedin.com/in/arpan-paul-a204a3283" },
                    { icon: Mail, href: "mailto:arpan0325@gmail.com" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="w-12 h-12 bg-gray-800/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                    >
                      <social.icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-xl">Features</h4>
                <ul className="space-y-4 text-gray-400 dark:text-gray-500">
                  {[
                    { label: "AI Chat Assistant", href: "/chat" },
                    { label: "Smart Summarizer", href: "/summarizer" },
                    { label: "Study Planner", href: "/planner" },
                    { label: "Mobile App", href: "#" },
                  ].map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block font-medium"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-xl">Connect</h4>
                <ul className="space-y-4 text-gray-400 dark:text-gray-500">
                  {[
                    { label: "GitHub", href: "https://github.com/Arpan110" },
                    { label: "Contact Me", action: () => setShowContactModal(true) },
                    { label: "LinkedIn", href: "https://www.linkedin.com/in/arpan-paul-a204a3283" },
                    { label: "Email", href: "mailto:arpan0325@gmail.com" },
                  ].map((link, index) => (
                    <li key={index}>
                      {link.href ? (
                        <a
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block font-medium"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <button
                          onClick={link.action}
                          className="hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block font-medium text-left"
                        >
                          {link.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4 md:mb-0 text-lg">
                © 2025 StudyGenie. All rights reserved. Built with ❤️ by Arpan Paul.
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Contact Modal */}
      <ContactModal />
    </div>
  )
}
