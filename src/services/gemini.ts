
import { GoogleGenAI } from "@google/genai";

// Fixed: Always use a named parameter and direct process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (history: {role: 'user' | 'model', text: string}[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
      config: {
        systemInstruction: `Você é um analista financeiro sênior da Nexus Invest.
        Seja profissional, elegante e forneça insights baseados em dados de mercado (simulados).
        Fale sempre em Português do Brasil.
        Ajude o usuário a entender seus lucros, taxas e como otimizar seus investimentos.
        Seja breve e direto.`
      }
    });
    // Correctly using .text property to extract output as per SDK requirements
    return response.text || "Desculpe, não consegui processar sua solicitação no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro na comunicação com o assistente de IA.";
  }
};
