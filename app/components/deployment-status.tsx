"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface HealthStatus {
  status: string
  timestamp: string
  environment: string
  hasApiKey: boolean
  version: string
  services: {
    database: string
    ai: string
    cache: string
  }
}

export function DeploymentStatus() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/health")
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      setHealth(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check health")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "configured":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case "missing_key":
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "configured":
        return "bg-green-100 text-green-800 border-green-200"
      case "missing_key":
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Deployment Status</span>
          <Button onClick={checkHealth} disabled={loading} variant="outline" size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Health Check Failed</span>
            </div>
            <p className="text-red-700 mt-2">{error}</p>
          </div>
        )}

        {health && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Status:</span>
              <Badge className={getStatusColor(health.status)}>
                {getStatusIcon(health.status)}
                <span className="ml-2">{health.status}</span>
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Environment:</span>
                <span className="ml-2">{health.environment}</span>
              </div>
              <div>
                <span className="font-medium">Version:</span>
                <span className="ml-2">{health.version}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Services:</h4>
              <div className="space-y-2">
                {Object.entries(health.services).map(([service, status]) => (
                  <div key={service} className="flex items-center justify-between">
                    <span className="capitalize">{service}:</span>
                    <Badge className={getStatusColor(status)} variant="outline">
                      {getStatusIcon(status)}
                      <span className="ml-2">{status.replace("_", " ")}</span>
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-500">Last checked: {new Date(health.timestamp).toLocaleString()}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
