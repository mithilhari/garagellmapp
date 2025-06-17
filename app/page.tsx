"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Bot, User, Sparkles, AlertCircle } from "lucide-react"

const models = [
  { id: "openai-gpt-4o", name: "GPT-4o", provider: "OpenAI", description: "Most capable model" },
  { id: "openai-gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", description: "Fast and efficient" },
  {
    id: "anthropic-claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    description: "Excellent reasoning",
  },
  { id: "anthropic-claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", description: "Fast responses" },
  { id: "google-gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google", description: "Large context window" },
  { id: "xai-grok-3", name: "Grok 3", provider: "xAI", description: "Real-time knowledge" },
]

export default function Component() {
  const [selectedModel, setSelectedModel] = useState(models[0].id)
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    body: {
      model: selectedModel,
    },
  })

  const selectedModelInfo = models.find((m) => m.id === selectedModel)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-green-50 to-purple-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
              AI Model Hub
            </h1>
          </div>
          <p className="text-gray-600 mb-6">Query multiple LLM models from different providers</p>

          {/* API Key Setup Alert */}
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Setup Required:</strong> To use this app, you need to configure API keys for your chosen
              providers.
              <br />
              Add environment variables: OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, or XAI_API_KEY
            </AlertDescription>
          </Alert>

          {/* Model Selector */}
          <Card className="mb-6 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-purple-700">Select AI Model</CardTitle>
              <CardDescription>Choose from various AI providers and models</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full border-purple-200 focus:border-purple-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {model.provider}
                        </Badge>
                        <span className="font-medium">{model.name}</span>
                        <span className="text-sm text-gray-500">- {model.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedModelInfo && (
                <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600 hover:bg-purple-700">{selectedModelInfo.provider}</Badge>
                    <span className="font-medium text-purple-700">{selectedModelInfo.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{selectedModelInfo.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <Card className="border-purple-200 shadow-lg">
          <CardContent className="p-0">
            {/* Error Display */}
            {error && (
              <div className="p-4 border-b border-red-200">
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error.message || "An error occurred. Please check your API key configuration."}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                  <p>Start a conversation with your selected AI model</p>
                  <p className="text-sm mt-2">Make sure to configure your API keys first!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback
                          className={message.role === "user" ? "bg-green-600 text-white" : "bg-purple-600 text-white"}
                        >
                          {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.role === "user"
                            ? "bg-green-600 text-white"
                            : "bg-purple-50 text-gray-800 border border-purple-200"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-purple-600 text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="border-t border-purple-200 p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder={`Ask ${selectedModelInfo?.name} anything...`}
                  className="flex-1 min-h-[60px] resize-none border-purple-200 focus:border-purple-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e as any)
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-2 text-center">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
