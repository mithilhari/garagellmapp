import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"
import { xai } from "@ai-sdk/xai"
import { streamText } from "ai"

export const maxDuration = 30

// Check which providers have API keys configured
const hasOpenAI = !!process.env.OPENAI_API_KEY
const hasAnthropic = !!process.env.ANTHROPIC_API_KEY
const hasGoogle = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
const hasXAI = !!process.env.XAI_API_KEY

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json()

    let selectedModel
    let providerName = ""

    // Map model IDs to actual model instances with API key checks
    switch (model) {
      case "openai-gpt-4o":
        if (!hasOpenAI) {
          return new Response(
            JSON.stringify({
              error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          )
        }
        selectedModel = openai("gpt-4o")
        providerName = "OpenAI"
        break
      case "openai-gpt-4o-mini":
        if (!hasOpenAI) {
          return new Response(
            JSON.stringify({
              error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          )
        }
        selectedModel = openai("gpt-4o-mini")
        providerName = "OpenAI"
        break
      case "anthropic-claude-3-5-sonnet":
        if (!hasAnthropic) {
          return new Response(
            JSON.stringify({
              error: "Anthropic API key not configured. Please add ANTHROPIC_API_KEY to your environment variables.",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          )
        }
        selectedModel = anthropic("claude-3-5-sonnet-20241022")
        providerName = "Anthropic"
        break
      case "anthropic-claude-3-haiku":
        if (!hasAnthropic) {
          return new Response(
            JSON.stringify({
              error: "Anthropic API key not configured. Please add ANTHROPIC_API_KEY to your environment variables.",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          )
        }
        selectedModel = anthropic("claude-3-haiku-20240307")
        providerName = "Anthropic"
        break
      case "google-gemini-1.5-pro":
        if (!hasGoogle) {
          return new Response(
            JSON.stringify({
              error:
                "Google API key not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables.",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          )
        }
        selectedModel = google("gemini-1.5-pro-latest")
        providerName = "Google"
        break
      case "xai-grok-3":
        if (!hasXAI) {
          return new Response(
            JSON.stringify({
              error: "xAI API key not configured. Please add XAI_API_KEY to your environment variables.",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          )
        }
        selectedModel = xai("grok-3")
        providerName = "xAI"
        break
      default:
        // Default to a mock response if no API keys are available
        return new Response(
          JSON.stringify({
            error:
              "No API keys configured. Please add at least one of: OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, or XAI_API_KEY to your environment variables.",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        )
    }

    console.log(`Using ${providerName} model: ${model}`)

    const result = await streamText({
      model: selectedModel,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API Error:", error)

    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return new Response(
          JSON.stringify({ error: "API key configuration error. Please check your environment variables." }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        )
      }
    }

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
