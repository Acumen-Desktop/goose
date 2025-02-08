import type { Message as APIMessage } from "../../types/api";

// API interface for communicating with Goose instance
interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  args: Record<string, any>;
  state: "call" | "result";
  result?: any;
}

interface Message {
  id: string;
  content: string;
  type: "user" | "ai";
  toolInvocations?: ToolInvocation[];
  timestamp: Date;
}

class GooseAPI {
  private baseUrl: string;

  constructor(port: number) {
    this.baseUrl = `http://127.0.0.1:${port}`;
  }

  // Check if Goose instance is available
  async checkStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/status`);
      return response.ok;
    } catch (error) {
      console.error("Failed to check Goose status:", error);
      return false;
    }
  }

  // Send a message to Goose
  async sendMessage(content: string): Promise<Message> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        id: data.id,
        content: data.content,
        type: "ai",
        toolInvocations: data.toolInvocations,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }

  // Get chat history
  async getChatHistory(): Promise<Message[]> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/history`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.messages.map((msg: Partial<Message>) => {
        const timestamp =
          msg.timestamp instanceof Date
            ? msg.timestamp
            : typeof msg.timestamp === "string" ||
              typeof msg.timestamp === "number"
            ? new Date(msg.timestamp)
            : new Date();

        return {
          ...msg,
          timestamp,
        };
      });
    } catch (error) {
      console.error("Failed to get chat history:", error);
      throw error;
    }
  }
}

export default GooseAPI;
