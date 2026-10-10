export interface PlanStep {
  step: number;
  title: string;
  durationMinutes: number;
  description: string;
  sensoryFocus?: string;
}

export interface PlanResponse {
  title: string;
  tagline: string;
  totalMinutes: number;
  steps: PlanStep[];
  screenFreePledge: string;
  groundingAdvice: string;
  modelUsed: string;
}

export interface PlanFormInput {
  duration: string;
  location: string;
  mood: string;
  preference: string;
}

export interface OllamaStatus {
  status: string;
  ollama_connected: boolean;
  available_models: string[];
  active_model: string;
  has_gemma: boolean;
  error?: string;
}
