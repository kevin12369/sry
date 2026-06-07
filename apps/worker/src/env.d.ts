declare global {
  interface Env {
    AI: Ai;
    RL: KVNamespace;
    ANTHROPIC_API_KEY?: string;
    GEMINI_API_KEY?: string;
    LLM_KILL_SWITCH: string;
    DEFAULT_MODEL: string;
  }
}
export {};
