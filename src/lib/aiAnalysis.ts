// AI Analysis Engine - NLP-based Fake News Detection
// This module simulates advanced AI analysis using pattern recognition,
// sentiment analysis, and credibility scoring algorithms.

export interface AnalysisResult {
  verdict: "REAL" | "FAKE" | "SUSPICIOUS";
  confidence: number;
  overallScore: number;
  metrics: {
    sentimentPolarity: {
      score: number;
      label: string;
      details: string;
    };
    emotionalManipulation: {
      score: number;
      level: string;
      triggers: string[];
    };
    clickbaitProbability: {
      score: number;
      indicators: string[];
    };
    sourceCredibility: {
      score: number;
      factors: string[];
    };
    keywordBias: {
      score: number;
      biasedTerms: string[];
      category: string;
    };
    factConsistency: {
      score: number;
      issues: string[];
    };
    writingTone: {
      score: number;
      tone: string;
      characteristics: string[];
    };
    fakePatternMatch: {
      score: number;
      patterns: string[];
    };
  };
  explanation: string;
  misleadingSentences: string[];
  recommendation: string;
  mutatedVersions: string[];
  biasRadar: {
    political: number;
    emotional: number;
    sensational: number;
    commercial: number;
    ideological: number;
  };
}

// Emotional trigger words database
const emotionalTriggers = {
  fear: ["shocking", "terrifying", "alarming", "dangerous", "threat", "crisis", "emergency", "devastating", "catastrophic", "deadly"],
  anger: ["outrageous", "disgusting", "shameful", "corrupt", "betrayal", "scandal", "exposed", "liar", "fraud", "conspiracy"],
  urgency: ["breaking", "urgent", "immediately", "now", "alert", "warning", "must see", "don't miss", "exclusive", "leaked"],
  exaggeration: ["always", "never", "everyone", "nobody", "all", "none", "best", "worst", "incredible", "unbelievable"]
};

// Clickbait patterns
const clickbaitPatterns = [
  /you won't believe/i,
  /what happens next/i,
  /will shock you/i,
  /doctors hate/i,
  /one weird trick/i,
  /this is why/i,
  /exposed!/i,
  /breaking:/i,
  /\d+ reasons why/i,
  /here's what/i,
  /the truth about/i,
  /they don't want you to know/i
];

// Biased language indicators
const biasedTerms = {
  political: ["leftist", "right-wing", "socialist", "fascist", "liberal agenda", "conservative values", "radical", "extremist"],
  sensational: ["explosive", "bombshell", "jaw-dropping", "mind-blowing", "earth-shattering", "game-changing"],
  loaded: ["regime", "cronies", "puppet", "sheeple", "elite", "establishment", "deep state", "mainstream media"]
};

// Fake news pattern indicators
const fakeNewsPatterns = [
  "according to anonymous sources",
  "some people say",
  "it is reported that",
  "many believe",
  "experts claim",
  "studies show" // without citation
];

function calculateSentimentPolarity(text: string): { score: number; label: string; details: string } {
  const words = text.toLowerCase().split(/\s+/);
  let fearCount = 0;
  let angerCount = 0;
  let urgencyCount = 0;
  let exaggerationCount = 0;

  words.forEach(word => {
    if (emotionalTriggers.fear.some(t => word.includes(t))) fearCount++;
    if (emotionalTriggers.anger.some(t => word.includes(t))) angerCount++;
    if (emotionalTriggers.urgency.some(t => word.includes(t))) urgencyCount++;
    if (emotionalTriggers.exaggeration.some(t => word.includes(t))) exaggerationCount++;
  });

  const totalTriggers = fearCount + angerCount + urgencyCount + exaggerationCount;
  const triggerDensity = totalTriggers / words.length;
  const score = Math.max(0, 100 - triggerDensity * 500);

  let label = "Neutral";
  if (fearCount > 2) label = "Fear-inducing";
  else if (angerCount > 2) label = "Anger-provoking";
  else if (urgencyCount > 2) label = "Urgency-driven";
  else if (exaggerationCount > 2) label = "Exaggerated";

  const details = `Detected ${fearCount} fear, ${angerCount} anger, ${urgencyCount} urgency, ${exaggerationCount} exaggeration triggers.`;

  return { score, label, details };
}

function calculateEmotionalManipulation(text: string): { score: number; level: string; triggers: string[] } {
  const detectedTriggers: string[] = [];
  const lowerText = text.toLowerCase();

  Object.values(emotionalTriggers).flat().forEach(trigger => {
    if (lowerText.includes(trigger)) {
      detectedTriggers.push(trigger);
    }
  });

  const score = Math.max(0, 100 - detectedTriggers.length * 10);
  let level = "Low";
  if (detectedTriggers.length > 5) level = "High";
  else if (detectedTriggers.length > 2) level = "Medium";

  return { score, level, triggers: detectedTriggers.slice(0, 5) };
}

function calculateClickbaitProbability(text: string): { score: number; indicators: string[] } {
  const indicators: string[] = [];
  
  clickbaitPatterns.forEach(pattern => {
    if (pattern.test(text)) {
      const match = text.match(pattern);
      if (match) indicators.push(match[0]);
    }
  });

  // Check for excessive punctuation
  if ((text.match(/!/g) || []).length > 2) indicators.push("Excessive exclamation marks");
  if ((text.match(/\?/g) || []).length > 3) indicators.push("Multiple question marks");
  if (text === text.toUpperCase() && text.length > 20) indicators.push("ALL CAPS text");

  const score = Math.max(0, 100 - indicators.length * 20);
  return { score, indicators };
}

function calculateSourceCredibility(text: string): { score: number; factors: string[] } {
  const factors: string[] = [];
  let score = 70; // Base score

  // Check for citations
  if (!/\b(according to|source:|cited|reference|study by)\b/i.test(text)) {
    factors.push("No citations or sources mentioned");
    score -= 15;
  }

  // Check for vague attributions
  if (/\b(some people say|many believe|experts claim|sources say)\b/i.test(text)) {
    factors.push("Vague source attribution");
    score -= 20;
  }

  // Check for specific data points
  if (/\d+%|\d+ (million|billion|thousand)/i.test(text)) {
    if (!/\b(study|report|survey|research)\b/i.test(text)) {
      factors.push("Statistics without source");
      score -= 10;
    }
  }

  // Check for professional language
  const professionalScore = text.split(' ').filter(w => w.length > 8).length / text.split(' ').length;
  if (professionalScore > 0.3) {
    factors.push("Professional vocabulary detected");
    score += 10;
  }

  return { score: Math.min(100, Math.max(0, score)), factors };
}

function calculateKeywordBias(text: string): { score: number; biasedTerms: string[]; category: string } {
  const found: string[] = [];
  const lowerText = text.toLowerCase();
  let category = "Neutral";

  Object.entries(biasedTerms).forEach(([cat, terms]) => {
    terms.forEach(term => {
      if (lowerText.includes(term)) {
        found.push(term);
        category = cat.charAt(0).toUpperCase() + cat.slice(1);
      }
    });
  });

  const score = Math.max(0, 100 - found.length * 15);
  return { score, biasedTerms: found, category };
}

function calculateFactConsistency(text: string): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 85;

  // Check for contradictions (simplified)
  if (/\b(but|however|although|despite|nevertheless)\b/gi.test(text)) {
    const matches = text.match(/\b(but|however|although|despite|nevertheless)\b/gi) || [];
    if (matches.length > 3) {
      issues.push("Multiple contradictory statements");
      score -= 15;
    }
  }

  // Check for absolute statements
  const absoluteWords = text.match(/\b(always|never|everyone|nobody|all|none)\b/gi) || [];
  if (absoluteWords.length > 2) {
    issues.push("Excessive absolute statements");
    score -= 10;
  }

  // Check for unverifiable claims
  if (/\b(secret|hidden|they don't want|cover-up)\b/i.test(text)) {
    issues.push("Unverifiable conspiracy-type claims");
    score -= 20;
  }

  return { score: Math.max(0, score), issues };
}

function calculateWritingTone(text: string): { score: number; tone: string; characteristics: string[] } {
  const characteristics: string[] = [];
  let score = 75;
  let tone = "Neutral";

  // Sentence length analysis
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;

  if (avgSentenceLength < 8) {
    characteristics.push("Short, punchy sentences");
    tone = "Sensational";
    score -= 10;
  } else if (avgSentenceLength > 25) {
    characteristics.push("Long, complex sentences");
    tone = "Academic";
    score += 5;
  }

  // Question usage
  const questionCount = (text.match(/\?/g) || []).length;
  if (questionCount > sentences.length * 0.3) {
    characteristics.push("Heavy use of rhetorical questions");
    tone = "Persuasive";
    score -= 5;
  }

  // Personal pronouns
  if (/\b(you|your|we|our|they|them)\b/gi.test(text)) {
    characteristics.push("Direct reader address");
  }

  // Propaganda indicators
  if (/\b(wake up|open your eyes|think about it|connect the dots)\b/i.test(text)) {
    characteristics.push("Propaganda-style language");
    tone = "Propaganda";
    score -= 25;
  }

  return { score: Math.max(0, score), tone, characteristics };
}

function calculateFakePatternMatch(text: string): { score: number; patterns: string[] } {
  const foundPatterns: string[] = [];
  const lowerText = text.toLowerCase();

  fakeNewsPatterns.forEach(pattern => {
    if (lowerText.includes(pattern)) {
      foundPatterns.push(pattern);
    }
  });

  const score = Math.max(0, 100 - foundPatterns.length * 20);
  return { score, patterns: foundPatterns };
}

function identifyMisleadingSentences(text: string): string[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const misleading: string[] = [];

  sentences.forEach(sentence => {
    const lower = sentence.toLowerCase();
    let isProblematic = false;

    // Check for various red flags
    if (clickbaitPatterns.some(p => p.test(sentence))) isProblematic = true;
    if (Object.values(emotionalTriggers).flat().some(t => lower.includes(t))) isProblematic = true;
    if (fakeNewsPatterns.some(p => lower.includes(p))) isProblematic = true;

    if (isProblematic && misleading.length < 3) {
      misleading.push(sentence.trim());
    }
  });

  return misleading;
}

function generateMutatedVersions(text: string): string[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  if (sentences.length === 0) return [];

  const original = sentences[0];
  const mutations: string[] = [];

  // Sensationalized version
  mutations.push(`BREAKING: ${original.trim().toUpperCase()}! You won't believe what happens next!`);

  // Fear-mongering version
  mutations.push(`URGENT WARNING: ${original.trim()} - Experts are terrified by these alarming findings!`);

  // Conspiracy version
  mutations.push(`What they don't want you to know: ${original.trim()} - The truth is finally exposed!`);

  return mutations;
}

function calculateBiasRadar(text: string): { political: number; emotional: number; sensational: number; commercial: number; ideological: number } {
  const lowerText = text.toLowerCase();

  // Political bias detection
  const politicalTerms = biasedTerms.political.filter(t => lowerText.includes(t)).length;
  const political = Math.min(100, politicalTerms * 25);

  // Emotional bias
  const emotionalTerms = Object.values(emotionalTriggers).flat().filter(t => lowerText.includes(t)).length;
  const emotional = Math.min(100, emotionalTerms * 12);

  // Sensational bias
  const sensationalTerms = biasedTerms.sensational.filter(t => lowerText.includes(t)).length;
  const clickbaitCount = clickbaitPatterns.filter(p => p.test(text)).length;
  const sensational = Math.min(100, (sensationalTerms + clickbaitCount) * 15);

  // Commercial bias
  const commercialTerms = ["buy", "sale", "discount", "offer", "limited time", "exclusive deal", "free", "win"].filter(t => lowerText.includes(t)).length;
  const commercial = Math.min(100, commercialTerms * 20);

  // Ideological bias
  const ideological = Math.min(100, biasedTerms.loaded.filter(t => lowerText.includes(t)).length * 20);

  return { political, emotional, sensational, commercial, ideological };
}

function generateExplanation(metrics: AnalysisResult["metrics"], verdict: string): string {
  const issues: string[] = [];

  if (metrics.emotionalManipulation.level !== "Low") {
    issues.push(`uses emotional manipulation tactics (${metrics.emotionalManipulation.triggers.slice(0, 2).join(", ")})`);
  }

  if (metrics.clickbaitProbability.score < 60) {
    issues.push("contains clickbait patterns");
  }

  if (metrics.sourceCredibility.score < 50) {
    issues.push("lacks credible source attribution");
  }

  if (metrics.keywordBias.biasedTerms.length > 0) {
    issues.push(`shows ${metrics.keywordBias.category.toLowerCase()} bias`);
  }

  if (metrics.fakePatternMatch.patterns.length > 0) {
    issues.push("matches known fake news patterns");
  }

  if (verdict === "REAL") {
    return "This content appears to be credible. It uses balanced language, provides or implies proper source attribution, and doesn't exhibit common fake news patterns. However, always verify information from multiple trusted sources.";
  } else if (verdict === "SUSPICIOUS") {
    return `This content requires verification. It ${issues.slice(0, 2).join(" and ")}. We recommend checking multiple reputable sources before sharing.`;
  } else {
    return `This content shows multiple red flags for misinformation. It ${issues.join(", ")}. We strongly advise against sharing this content without thorough fact-checking.`;
  }
}

export function analyzeNews(text: string): AnalysisResult {
  if (!text || text.trim().length < 20) {
    throw new Error("Please provide at least 20 characters of text to analyze.");
  }

  const metrics = {
    sentimentPolarity: calculateSentimentPolarity(text),
    emotionalManipulation: calculateEmotionalManipulation(text),
    clickbaitProbability: calculateClickbaitProbability(text),
    sourceCredibility: calculateSourceCredibility(text),
    keywordBias: calculateKeywordBias(text),
    factConsistency: calculateFactConsistency(text),
    writingTone: calculateWritingTone(text),
    fakePatternMatch: calculateFakePatternMatch(text),
  };

  // Calculate overall score (weighted average)
  const weights = {
    sentimentPolarity: 0.10,
    emotionalManipulation: 0.15,
    clickbaitProbability: 0.15,
    sourceCredibility: 0.20,
    keywordBias: 0.10,
    factConsistency: 0.15,
    writingTone: 0.05,
    fakePatternMatch: 0.10,
  };

  const overallScore = Object.entries(weights).reduce((sum, [key, weight]) => {
    return sum + metrics[key as keyof typeof metrics].score * weight;
  }, 0);

  // Determine verdict
  let verdict: "REAL" | "FAKE" | "SUSPICIOUS";
  if (overallScore >= 70) {
    verdict = "REAL";
  } else if (overallScore >= 45) {
    verdict = "SUSPICIOUS";
  } else {
    verdict = "FAKE";
  }

  // Calculate confidence
  const scoreVariance = Object.values(metrics).map(m => m.score);
  const avgScore = scoreVariance.reduce((a, b) => a + b, 0) / scoreVariance.length;
  const variance = scoreVariance.reduce((sum, s) => sum + Math.pow(s - avgScore, 2), 0) / scoreVariance.length;
  const confidence = Math.max(60, Math.min(98, 100 - Math.sqrt(variance) / 2));

  const explanation = generateExplanation(metrics, verdict);
  const misleadingSentences = identifyMisleadingSentences(text);
  const mutatedVersions = generateMutatedVersions(text);
  const biasRadar = calculateBiasRadar(text);

  let recommendation: string;
  if (verdict === "REAL") {
    recommendation = "This content appears credible, but always cross-reference with trusted sources.";
  } else if (verdict === "SUSPICIOUS") {
    recommendation = "⚠️ Verify before sharing. Check multiple reputable sources for confirmation.";
  } else {
    recommendation = "🚫 Do not share. This content shows significant signs of misinformation.";
  }

  return {
    verdict,
    confidence,
    overallScore,
    metrics,
    explanation,
    misleadingSentences,
    recommendation,
    mutatedVersions,
    biasRadar,
  };
}

// Language detection (simplified)
export function detectLanguage(text: string): string {
  const englishWords = ["the", "is", "are", "was", "were", "have", "has", "been", "will", "would", "could", "should"];
  const words = text.toLowerCase().split(/\s+/);
  const englishCount = words.filter(w => englishWords.includes(w)).length;
  
  if (englishCount > words.length * 0.1) {
    return "English";
  }
  return "Unknown";
}

// Word count utility
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// Check for gibberish/spam
export function isGibberish(text: string): boolean {
  const words = text.split(/\s+/);
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
  
  // Too short or too long average word length
  if (avgWordLength < 2 || avgWordLength > 15) return true;
  
  // Too many repeated characters
  if (/(.)\1{4,}/i.test(text)) return true;
  
  // No vowels in most words
  const wordsWithVowels = words.filter(w => /[aeiou]/i.test(w)).length;
  if (wordsWithVowels < words.length * 0.5) return true;
  
  return false;
}
