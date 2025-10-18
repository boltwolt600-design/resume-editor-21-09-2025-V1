
import { GoogleGenAI } from "@google/genai";
import { ResumeData } from '../types';

const getAi = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const resumeToText = (resumeData: ResumeData): string => {
    let text = `${resumeData.name}\n${resumeData.title}\n${resumeData.contact.email} | ${resumeData.contact.phone} | ${resumeData.contact.linkedin}\n\n`;
    resumeData.sections.forEach(section => {
        text += `${section.title}\n${section.content}\n\n`;
    });
    return text;
};

export const getAtsSuggestions = async (resumeData: ResumeData): Promise<{ score: number, suggestions: string }> => {
    try {
        const ai = getAi();
        const resumeText = resumeToText(resumeData);
        const prompt = `Analyze the following resume for Applicant Tracking System (ATS) compatibility. 
        Provide a score from 0-100 and a list of actionable suggestions for improvement.
        Format the output as a JSON object with two keys: "score" (a number) and "suggestions" (a string with bullet points).
        
        Resume:
        ---
        ${resumeText}
        ---`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            }
        });

        const jsonText = response.text.replace(/```json|```/g, '').trim();
        const result = JSON.parse(jsonText);
        
        return {
            score: result.score || 0,
            suggestions: result.suggestions || 'No suggestions available.'
        };
    } catch (error) {
        console.error("Error getting ATS suggestions:", error);
        return { score: 0, suggestions: 'Failed to get suggestions. Please try again.' };
    }
};

export const enhanceText = async (text: string): Promise<string> => {
    try {
        const ai = getAi();
        const prompt = `Rewrite the following resume bullet point to be more impactful, using action verbs and quantifying achievements where possible. Return only the rewritten text.
        
        Original text: "${text}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error enhancing text:", error);
        return 'Failed to enhance text. Please try again.';
    }
};

export const getGapJustification = async (): Promise<string> => {
    try {
        const ai = getAi();
        const prompt = `Provide 3 professional and concise options to explain a recent employment gap. The tone should be positive and confident. Format as a bulleted list.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text.trim();
    } catch (error) {
        console.error("Error getting gap justification:", error);
        return 'Failed to get suggestions. Please try again.';
    }
};
