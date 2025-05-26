import { GoogleGenAI, GenerateContentResponse } from "@google/genai"; // Am eliminat GenerateContentResult și alias-ul
import { GEMINI_TEXT_MODEL } from "../constants";
import { GeminiContentSuggestion, TrendingTopicSuggestion } from "../types";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = GEMINI_TEXT_MODEL;

if (!API_KEY) {
  console.warn(
    "Gemini API Key not found. Please set the API_KEY environment variable. AI features will be disabled."
  );
}

if (API_KEY && !MODEL_NAME) {
  // Adăugăm un avertisment și pentru model, dacă API_KEY există
  console.warn(
    "Gemini Model Name (GEMINI_TEXT_MODEL) not found or is undefined. Please ensure it's correctly set in constants. AI text generation features may be disabled or fail."
  );
}

// Folosim numele 'ai' ca în codul original, dacă preferi, sau 'genAI'
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const parseJsonFromText = (text: string): any => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error(
      "Failed to parse JSON response after cleaning:",
      e,
      "Original text:",
      text
    );
    throw e;
  }
};

export const generateContentIdea = async (
  platform: string,
  topic: string
): Promise<GeminiContentSuggestion | null> => {
  if (!ai || !MODEL_NAME) return null;
  try {
    const prompt = `Generate a social media post idea for ${platform} about "${topic}".
    Include a catchy caption (around 50-100 words) and 3-5 relevant hashtags.
    Format the response as a JSON object with keys: "idea", "caption", "hashtags" (array of strings).
    Example: {"idea": "A quick tutorial video", "caption": "Check out this easy way to...", "hashtags": ["#tutorial", "#DIY"]}`;

    // Revenim la structura inițială de apel, dar cu 'contents' corectat și 'config'
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }], // Structura corectă pentru contents
      config: {
        // Folosim 'config' în loc de 'generationConfig'
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text; // Accesăm direct .text
    if (responseText === undefined) {
      console.error("Gemini response missing text for generateContentIdea");
      return null;
    }
    const data = parseJsonFromText(responseText) as GeminiContentSuggestion;
    return data;
  } catch (error) {
    console.error("Error generating content idea with Gemini:", error);
    return null;
  }
};

export const getMonetizationTips = async (
  platform: string
): Promise<string[] | null> => {
  if (!ai || !MODEL_NAME) return null;
  try {
    const prompt = `Provide 5 actionable monetization tips for a content creator on ${platform}.
    Format the response as a JSON array of strings.
    Example: ["Engage with your audience regularly.", "Collaborate with brands."]`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (responseText === undefined) {
      console.error("Gemini response missing text for getMonetizationTips");
      return null;
    }
    const tips = parseJsonFromText(responseText) as string[];
    return tips;
  } catch (error) {
    console.error("Error getting monetization tips from Gemini:", error);
    return null;
  }
};

export const analyzePostPerformance = async (
  platform: string,
  metrics: { likes: number; comments: number; shares: number; views?: number },
  postContentSummary: string
): Promise<string | null> => {
  if (!ai || !MODEL_NAME) return null;
  try {
    const prompt = `A post on ${platform} summarized as "${postContentSummary}" received the following engagement:
    Likes: ${metrics.likes}
    Comments: ${metrics.comments}
    Shares: ${metrics.shares}
    ${metrics.views ? `Views: ${metrics.views}` : ""}

    Provide a brief analysis (2-3 sentences) of this performance and suggest one specific improvement.
    Focus on constructive feedback.`;

    // Aici nu specificăm responseMimeType, deci 'config' poate lipsi sau fi gol
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response.text ?? null; // .text poate fi undefined, deci ?? null e bun
  } catch (error) {
    console.error("Error analyzing post performance with Gemini:", error);
    return null;
  }
};

export const suggestRevenueStreams = async (
  platform: string,
  niche: string
): Promise<string[] | null> => {
  if (!ai || !MODEL_NAME) return null;
  try {
    const prompt = `For a content creator on the platform "${platform}" focused on the niche/topic "${niche}", suggest 5 diverse and actionable potential revenue streams.
    For each suggestion, provide a brief explanation (1-2 sentences).
    Format the response as a JSON array of strings, where each string is a revenue stream suggestion with its explanation.
    Example: ["Sponsored Content: Partner with brands relevant to ${niche} for paid posts or videos.", "Affiliate Marketing: Recommend products/services useful for ${niche} enthusiasts and earn a commission on sales."]`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (responseText === undefined) {
      console.error("Gemini response missing text for suggestRevenueStreams");
      return null;
    }
    const suggestions = parseJsonFromText(responseText) as string[];
    return suggestions;
  } catch (error) {
    console.error("Error suggesting revenue streams with Gemini:", error);
    return null;
  }
};

export const getTrendingTopics = async (
  platformName: string,
  niche: string
): Promise<TrendingTopicSuggestion[] | null> => {
  if (!ai || !MODEL_NAME) return null;
  try {
    const prompt = `For the platform "${platformName}" and the niche/topic "${niche}", identify 3-5 current trending topics or discussions.
    For each trend, briefly explain why it might be trending or relevant, and suggest a simple content idea.
    Format the response as a JSON array of objects. Each object should have keys: "topic" (string), "reason" (string, optional), "contentIdea" (string, optional).
    Example: [{"topic": "Sustainable Living Hacks", "reason": "Growing environmental awareness", "contentIdea": "A short video showing 3 easy eco-friendly swaps at home."}]`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (responseText === undefined) {
      console.error("Gemini response missing text for getTrendingTopics");
      return null;
    }
    const trends = parseJsonFromText(responseText) as TrendingTopicSuggestion[];
    return trends;
  } catch (error) {
    console.error("Error fetching trending topics from Gemini:", error);
    return null;
  }
};

export const suggestTitlesOrHooks = async (
  postTopic: string,
  platformName: string
): Promise<string[] | null> => {
  if (!ai || !MODEL_NAME) return null;
  try {
    const prompt = `Generate 3-5 catchy titles or opening hooks for a social media post about "${postTopic}" for the platform ${platformName}.
    Keep them concise and engaging.
    Format the response as a JSON array of strings.
    Example: ["You WON'T BELIEVE this about ${postTopic}!", "The ultimate guide to ${postTopic} for beginners." , "Is ${postTopic} the next big thing?"]`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (responseText === undefined) {
      console.error("Gemini response missing text for suggestTitlesOrHooks");
      return null;
    }
    const titles = parseJsonFromText(responseText) as string[];
    return titles;
  } catch (error) {
    console.error("Error suggesting titles/hooks from Gemini:", error);
    return null;
  }
};

export const suggestHashtags = async (
  postContent: string,
  platformName: string
): Promise<string[] | null> => {
  if (!ai || !MODEL_NAME) return null;
  try {
    const prompt = `Based on the following post content for ${platformName}: "${postContent.substring(
      0,
      300
    )}...",
      suggest 5-7 relevant and effective hashtags. Include a mix of general and niche hashtags.
      Format the response as a JSON array of strings, where each string is a hashtag starting with '#'.
      Example: ["#socialmediamarketing", "#contentcreation", "#digitalstrategy", "#${platformName.toLowerCase()}tips", "#smm"]`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (responseText === undefined) {
      console.error("Gemini response missing text for suggestHashtags");
      return null;
    }
    const hashtags = parseJsonFromText(responseText) as string[];
    return hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`));
  } catch (error) {
    console.error("Error suggesting hashtags from Gemini:", error);
    return null;
  }
};

export const suggestBestPostingTimes = async (
  platformName: string,
  niche?: string
): Promise<string[] | null> => {
  if (!ai || !MODEL_NAME) return null;
  try {
    const nicheContext = niche ? ` within the niche "${niche}"` : "";
    const prompt = `Provide 2-3 general suggestions for the best times to post on ${platformName}${nicheContext} to maximize engagement.
      These should be actionable insights or common strategies.
      Format the response as a JSON array of strings.
      Example: ["Weekdays during lunch breaks (12 PM - 2 PM local time).", "Evenings when users are typically browsing (7 PM - 9 PM).", "Experiment with weekends if your content is leisure-focused."]`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (responseText === undefined) {
      console.error("Gemini response missing text for suggestBestPostingTimes");
      return null;
    }
    const suggestions = parseJsonFromText(responseText) as string[];
    return suggestions;
  } catch (error) {
    console.error("Error suggesting best posting times from Gemini:", error);
    return null;
  }
};

export const isGeminiAvailable = (): boolean => !!ai && !!MODEL_NAME; // Am eliminat verificarea getModel()
