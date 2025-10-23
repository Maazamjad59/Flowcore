
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { Automation } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. App will not function correctly without a valid API key.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

const automationTool: FunctionDeclaration = {
  name: "create_automation",
  description: "Creates a structured automation workflow from a user's natural language description. The workflow consists of a trigger and an action.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      trigger: {
        type: Type.OBJECT,
        description: "The event that starts the automation.",
        properties: {
          service: {
            type: Type.STRING,
            description: "The application or service where the trigger originates, e.g., 'email', 'calendar', 'github'."
          },
          event: {
            type: Type.STRING,
            description: "The specific event that occurs, e.g., 'new_email_received', 'event_starts', 'new_pull_request'."
          },
          conditions: {
            type: Type.ARRAY,
            description: "A list of conditions that must be met for the trigger to fire.",
            items: {
              type: Type.OBJECT,
              properties: {
                field: { type: Type.STRING, description: "The field to check, e.g., 'subject', 'sender', 'title'." },
                operator: {
                  type: Type.STRING,
                  description: "The comparison operator.",
                  enum: ['contains', 'equals', 'starts_with', 'ends_with']
                },
                value: { type: Type.STRING, description: "The value to compare against." }
              },
              required: ["field", "operator", "value"]
            }
          }
        },
        required: ["service", "event"]
      },
      action: {
        type: Type.OBJECT,
        description: "The operation to perform when the trigger fires.",
        properties: {
          service: {
            type: Type.STRING,
            description: "The application or service where the action is performed, e.g., 'slack', 'google_drive', 'todoist'."
          },
          operation: {
            type: Type.STRING,
            description: "The specific operation to execute, e.g., 'send_message', 'upload_file', 'create_task'."
          },
          details: {
            type: Type.OBJECT,
            description: "A key-value map of parameters for the action, e.g., {'channel': '#general', 'message': 'New invoice received'}.",
            properties: {}
          }
        },
        required: ["service", "operation"]
      }
    },
    required: ["trigger", "action"]
  }
};

export const parseAutomationRequest = async (prompt: string): Promise<Automation | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Parse the following user request to create an automation workflow: "${prompt}"`,
      config: {
        tools: [{ functionDeclarations: [automationTool] }],
      },
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionCall = response.functionCalls[0];
      if (functionCall.name === 'create_automation') {
        // The arguments are directly the Automation object
        return functionCall.args as Automation;
      }
    }
    return null;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the AI. Please check your API key and try again.");
  }
};
