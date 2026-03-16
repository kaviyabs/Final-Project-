export interface AnalysisResult {
  verdict: 'REAL' | 'FAKE' | 'SUSPICIOUS';
  confidence: number;
  explanation: string;
  overallScore?: number;
  text?: string;
}

export const countWords = (text: string): number => {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
};

export const detectLanguage = (text: string): string => {
  // Simple heuristic for demo purposes
  if (!text) return "—";
  return "English";
};

export const isGibberish = (text: string): boolean => {
  if (!text) return false;
  // Very simple check: if average word length is > 20 or < 2 (mostly)
  const words = text.trim().split(/\s+/);
  if (words.length === 0) return false;
  const avgLength = words.reduce((acc, word) => acc + word.length, 0) / words.length;
  return avgLength > 15 || (words.length > 10 && avgLength < 2);
};

/**
 * Resolves the backend API base URL.
 * - In Docker (local): VITE_API_URL is empty → uses relative "/api" path
 *   which Nginx proxies to the backend container.
 * - In development (npm run dev): falls back to http://localhost:8000
 * - On Render/Railway: set VITE_API_URL to the deployed backend URL.
 */
export const getApiBase = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.trim();
  }
  // When running behind nginx in Docker, use relative /api path
  if (typeof window !== "undefined" && window.location.port !== "5173") {
    return "/api";
  }
  // Local development fallback
  return "http://localhost:8000";
};

export const analyzeNews = async (input: string, isUrl: boolean = false): Promise<AnalysisResult> => {
  const API_BASE_URL = getApiBase();

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: isUrl ? "" : input,
      url: isUrl ? input : "",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Analysis failed. Please ensure the backend is running.");
  }

  return response.json();
};
