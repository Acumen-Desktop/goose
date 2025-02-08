export interface Model {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  maxTokens: number;
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences: string[];
}

export interface ModelContext {
  model: Model;
  setModel: (model: Model) => void;
}

export const defaultModel: Model = {
  id: "default",
  name: "Default Model",
  provider: "goose",
  contextLength: 4096,
  maxTokens: 1024,
  temperature: 0.7,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  stopSequences: [],
};
