"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  Sparkles,
  Github,
  Linkedin,
  CheckCircle2,
  AlertCircle,
  User,
  BookOpen,
  Brain,
  Calendar,
} from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isVisible, setIsVisible] = useState(false)

  // Trigger entrance animations
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // For demo purposes, just show success
      alert("Sign in successful! (Demo mode)")
    }, 2000)
  }

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Get personalized study assistance",
    },
    {
      icon: BookOpen,
      title: "Smart Summarization",
      description: "Transform content into insights",
    },
    {
      icon: Calendar,
      title: "Study Planning",
      description: "Organize your learning journey",
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 animate-gradient">
        {/* Primary Animated Gradient Orbs */}
        <div className="absolute inset-0 will-change-transform">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse-glow"></div>
          <div
            className="absolute top-40 right-32 w-80 h-80 bg-purple-500/25 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-drift"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-40 right-20 w-64 h-64 bg-indigo-500/25 rounded-full blur-3xl animate-bounce-slow"
            style={{ animationDelay: "0.5s" }}
          ></div>

          {/* Additional floating orbs */}
          <div
            className="absolute top-1/2 left-10 w-32 h-32 bg-cyan-400/15 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "3s" }}
          ></div>
          <div
            className="absolute top-3/4 right-1/4 w-48 h-48 bg-violet-400/20 rounded-full blur-3xl animate-drift"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        {/* Enhanced Geometric Patterns */}
        <div className="absolute inset-0 opacity-15 will-change-transform">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-white/30 rotate-45 animate-rotate-slow"></div>
          <div
            className="absolute top-3/4 right-1/4 w-24 h-24 border border-white/25 rotate-12 animate-bounce-slow"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/6 w-16 h-16 bg-white/15 rounded-full animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/3 right-1/3 w-20 h-20 bg-white/10 rounded-full animate-drift"
            style={{ animationDelay: "0.5s" }}
          ></div>

          {/* Additional geometric shapes */}
          <div className="absolute top-1/6 right-1/6 w-12 h-12 border border-white/20 rounded-lg animate-spin-slow"></div>
          <div
            className="absolute bottom-1/4 left-1/5 w-28 h-28 border-2 border-white/20 rounded-full animate-pulse-glow"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        {/* Animated Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-8">
          <div
            className="w-full h-full animate-shimmer"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 will-change-opacity">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${6 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Enhanced Header with Animation */}
      <header className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover-lift">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg hover-glow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">StudyGenie</h1>
                <p className="text-xs text-white/70">AI-Powered Learning</p>
              </div>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover-lift">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content with Enhanced Animations */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-[calc(100vh-80px)] flex items-center">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Welcome Content with Staggered Animations */}
            <div
              className={`text-white space-y-8 order-2 lg:order-1 transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
            >
              <div className="space-y-6">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 backdrop-blur-sm hover-lift animate-shimmer">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Welcome Back to StudyGenie
                </Badge>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                    Continue Your
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Learning Journey
                  </span>
                </h2>

                <p className="text-xl text-white/80 leading-relaxed max-w-lg">
                  Access your personalized AI study assistant, smart summarization tools, and intelligent study planner.
                </p>
              </div>

              {/* Features List with Staggered Animation */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-500 hover-lift will-change-transform ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg hover-glow">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{feature.title}</h3>
                      <p className="text-white/70 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats with Counter Animation */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                {[
                  { value: "25K+", label: "Students" },
                  { value: "100K+", label: "Questions" },
                  { value: "98%", label: "Success Rate" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                    style={{ transitionDelay: `${600 + index * 100}ms` }}
                  >
                    <div className="text-3xl font-bold text-white mb-1 hover-glow">{stat.value}</div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Sign In Form with Enhanced Animation */}
            <div
              className={`order-1 lg:order-2 transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
              style={{ transitionDelay: "300ms" }}
            >
              <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl hover-lift animate-slide-in-up">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover-glow">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Sign In to StudyGenie</CardTitle>
                  <p className="text-gray-600">Access your personalized learning dashboard</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field with Enhanced Animation */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-200" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className={`pl-12 py-3 text-base border-2 rounded-xl input-focus transition-all duration-300 ${
                            errors.email
                              ? "border-red-300 focus:border-red-400 bg-red-50"
                              : "border-gray-200 focus:border-blue-400 bg-gray-50 focus:bg-white hover:border-gray-300"
                          }`}
                        />
                        {errors.email && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-bounce">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-600 flex items-center animate-slide-in-up">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Password Field with Enhanced Animation */}
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-200" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter your password"
                          className={`pl-12 pr-12 py-3 text-base border-2 rounded-xl input-focus transition-all duration-300 ${
                            errors.password
                              ? "border-red-300 focus:border-red-400 bg-red-50"
                              : "border-gray-200 focus:border-blue-400 bg-gray-50 focus:bg-white hover:border-gray-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-600 flex items-center animate-slide-in-up">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 cursor-pointer hover-lift">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-200"
                        />
                        <span className="text-sm text-gray-600">Remember me</span>
                      </label>
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Enhanced Sign In Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 hover-lift hover-glow"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin-fast mr-2" />
                          Signing In...
                        </div>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Divider with Animation */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  {/* Enhanced Social Sign In */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mt-4">
  {/* GitHub Button */}
  <a
    href="https://github.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-full sm:w-1/2"
  >
    <Button
      type="button"
      variant="outline"
      className="
        w-full 
        py-3 
        bg-transparent 
        border-2 border-gray-300 
        hover:bg-gray-50 
        transition-all duration-300 
        flex justify-center 
        items-center
        transform 
        hover:-translate-y-1 
        hover:shadow-md
        hover:brightness-110
      "
    >
      <Github className="w-6 h-6 text-gray-600" />
    </Button>
  </a>

  {/* LinkedIn Button */}
  <a
    href="https://www.linkedin.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-full sm:w-1/2"
  >
    <Button
      type="button"
      variant="outline"
      className="
        w-full 
        py-3 
        bg-transparent 
        border-2 border-blue-200 
        hover:bg-blue-50 
        transition-all duration-300 
        flex justify-center 
        items-center
        transform 
        hover:-translate-y-1 
        hover:shadow-md
        hover:brightness-110
      "
    >
      <Linkedin className="w-6 h-6 text-blue-600" />
    </Button>
  </a>
</div>
                  {/* Sign Up Link with Animation */}
                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <button className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:underline hover-lift">
                        Sign up for free
                      </button>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
