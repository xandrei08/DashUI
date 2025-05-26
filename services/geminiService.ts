import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { GEMINI_TEXT_MODEL } from '../constants';
import { GeminiContentSuggestion, TrendingTopicSuggestion } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API Key not found. Please set the API_KEY environment variable. AI features will be disabled.");
}

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
    console.error("Failed to parse JSON response after cleaning:", e, "Original text:", text);
    throw e; // Re-throw the error after logging
  }
};


export const generateContentIdea = async (platform: string, topic: string): Promise<GeminiContentSuggestion | null> => {
  if (!ai) return null;
  try {
    const prompt = `Generate a social media post idea for ${platform} about "${topic}". 
    Include a catchy caption (around 50-100 words) and 3-5 relevant hashtags.
    Format the response as a JSON object with keys: "idea", "caption", "hashtags" (array of strings).
    Example: {"idea": "A quick tutorial video", "caption": "Check out this easy way to...", "hashtags": ["#tutorial", "#DIY"]}`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const data = parseJsonFromText(response.text) as GeminiContentSuggestion;
    return data;

  } catch (error) {
    console.error("Error generating content idea with Gemini:", error);
    return null;
  }
};


export const getMonetizationTips = async (platform: string): Promise<string[] | null> => {
  if (!ai) return null;
  try {
    const prompt = `Provide 5 actionable monetization tips for a content creator on ${platform}.
    Format the response as a JSON array of strings.
    Example: ["Engage with your audience regularly.", "Collaborate with brands."]`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const tips = parseJsonFromText(response.text) as string[];
    return tips;

  } catch (error) {
    console.error("Error getting monetization tips from Gemini:", error);
    return null;
  }
};

export const analyzePostPerformance = async (platform: string, metrics: { likes: number; comments: number; shares: number; views?: number }, postContentSummary: string): Promise<string | null> => {
  if (!ai) return null;
  try {
    const prompt = `A post on ${platform} summarized as "${postContentSummary}" received the following engagement:
    Likes: ${metrics.likes}
    Comments: ${metrics.comments}
    Shares: ${metrics.shares}
    ${metrics.views ? `Views: ${metrics.views}` : ''}

    Provide a brief analysis (2-3 sentences) of this performance and suggest one specific improvement.
    Focus on constructive feedback.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
    });
    
    return response.text;

  } catch (error) {
    console.error("Error analyzing post performance with Gemini:", error);
    return null;
  }
};

export const suggestRevenueStreams = async (platform: string, niche: string): Promise<string[] | null> => {
  if (!ai) return null;
  try {
    const prompt = `For a content creator on the platform "${platform}" focused on the niche/topic "${niche}", suggest 5 diverse and actionable potential revenue streams.
    For each suggestion, provide a brief explanation (1-2 sentences).
    Format the response as a JSON array of strings, where each string is a revenue stream suggestion with its explanation.
    Example: ["Sponsored Content: Partner with brands relevant to ${niche} for paid posts or videos.", "Affiliate Marketing: Recommend products/services useful for ${niche} enthusiasts and earn a commission on sales."]`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const suggestions = parseJsonFromText(response.text) as string[];
    return suggestions;

  } catch (error) {
    console.error("Error suggesting revenue streams with Gemini:", error);
    return null;
  }
};

export const getTrendingTopics = async (platformName: string, niche: string): Promise<TrendingTopicSuggestion[] | null> => {
  if (!ai) return null;
  try {
    const prompt = `For the platform "${platformName}" and the niche/topic "${niche}", identify 3-5 current trending topics or discussions.
    For each trend, briefly explain why it might be trending or relevant, and suggest a simple content idea.
    Format the response as a JSON array of objects. Each object should have keys: "topic" (string), "reason" (string, optional), "contentIdea" (string, optional).
    Example: [{"topic": "Sustainable Living Hacks", "reason": "Growing environmental awareness", "contentIdea": "A short video showing 3 easy eco-friendly swaps at home."}]`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const trends = parseJsonFromText(response.text) as TrendingTopicSuggestion[];
    return trends;
  } catch (error) {
    console.error("Error fetching trending topics from Gemini:", error);
    return null;
  }
};

export const suggestTitlesOrHooks = async (postTopic: string, platformName: string): Promise<string[] | null> => {
  if (!ai) return null;
  try {
    const prompt = `Generate 3-5 catchy titles or opening hooks for a social media post about "${postTopic}" for the platform ${platformName}.
    Keep them concise and engaging.
    Format the response as a JSON array of strings.
    Example: ["You WON'T BELIEVE this about ${postTopic}!", "The ultimate guide to ${postTopic} for beginners." , "Is ${postTopic} the next big thing?"]`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const titles = parseJsonFromText(response.text) as string[];
    return titles;
  } catch (error) {
    console.error("Error suggesting titles/hooks from Gemini:", error);
    return null;
  }
};

export const suggestHashtags = async (postContent: string, platformName: string): Promise<string[] | null> => {
    if (!ai) return null;
    try {
      const prompt = `Based on the following post content for ${platformName}: "${postContent.substring(0, 300)}...", 
      suggest 5-7 relevant and effective hashtags. Include a mix of general and niche hashtags.
      Format the response as a JSON array of strings, where each string is a hashtag starting with '#'.
      Example: ["#socialmediamarketing", "#contentcreation", "#digitalstrategy", "#${platformName.toLowerCase()}tips", "#smm"]`;
  
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const hashtags = parseJsonFromText(response.text) as string[];
      // Ensure hashtags start with #
      return hashtags.map(h => h.startsWith('#') ? h : `#${h}`);
    } catch (error) {
      console.error("Error suggesting hashtags from Gemini:", error);
      return null;
    }
};

export const suggestBestPostingTimes = async (platformName: string, niche?: string): Promise<string[] | null> => {
    if (!ai) return null;
    try {
      const nicheContext = niche ? ` within the niche "${niche}"` : "";
      const prompt = `Provide 2-3 general suggestions for the best times to post on ${platformName}${nicheContext} to maximize engagement.
      These should be actionable insights or common strategies.
      Format the response as a JSON array of strings.
      Example: ["Weekdays during lunch breaks (12 PM - 2 PM local time).", "Evenings when users are typically browsing (7 PM - 9 PM).", "Experiment with weekends if your content is leisure-focused."]`;
  
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const suggestions = parseJsonFromText(response.text) as string[];
      return suggestions;
    } catch (error) {
      console.error("Error suggesting best posting times from Gemini:", error);
      return null;
    }
};


export const isGeminiAvailable = (): boolean => !!ai;