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

export const analyzeNews = async (input: string, isUrl: boolean = false): Promise<AnalysisResult> => {
  // Try to use the environment variable if available, otherwise default to localhost:8000
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
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
