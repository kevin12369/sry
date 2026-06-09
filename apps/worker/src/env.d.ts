declare global {
  interface Env {
    AI: Ai;
    RL: KVNamespace;
    ANTHROPIC_API_KEY?: string;
    GEMINI_API_KEY?: string;
    LLM_KILL_SWITCH: string;
    DEFAULT_MODEL: string;
    PROJECT_DAILY_NEURONS_CAP: string;
    PROJECT_MONTHLY_NEURONS_CAP: string;
  }
}
export {};
