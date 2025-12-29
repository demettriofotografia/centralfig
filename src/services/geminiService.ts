
import { GoogleGenAI, Type } from "@google/genai";
import { DayEntry, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePerformanceData = async (data: DayEntry[]): Promise<AnalysisResult> => {
  // Filter out empty days to save tokens and context
  const activeDays = data.filter(d => d.rating > 0 || d.sentiment !== null || d.dailyValue !== 0 || d.note.trim() !== "");

  if (activeDays.length === 0) {
    return {
      summary: "Ainda não há dados suficientes para análise.",
      advice: "Comece preenchendo sua planilha diária com valores e notas.",
      trend: "Sem dados."
    };
  }

  // Calculate simple stats for context
  const totalPnL = activeDays.reduce((sum, d) => sum + d.dailyValue, 0);
  const winDays = activeDays.filter(d => d.dailyValue > 0).length;
  const lossDays = activeDays.filter(d => d.dailyValue < 0).length;

  const prompt = `
    Atue como um analista de performance e mentor de trading/produtividade.
    Analise os seguintes dados de um período de até 22 dias.
    
    Contexto Financeiro:
    - Resultado Total do período: R$ ${totalPnL}
    - Dias de Gain: ${winDays}
    - Dias de Loss: ${lossDays}

    Dados detalhados (Dia, Valor Financeiro, Sentimento, Nota, Classificação 0-10):
    ${JSON.stringify(activeDays, null, 2)}
    
    Forneça uma análise psicológica e técnica breve.
    1. Resumo: Como está o desempenho financeiro x emocional?
    2. Conselho: Uma ação prática para melhorar os resultados ou a disciplina.
    3. Tendência: O gráfico financeiro está subindo, descendo ou lateral?

    Responda em Português do Brasil.
  `;

  try {
    // Updated model to gemini-3-flash-preview for general text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Resumo cruzando financeiro e emocional." },
            advice: { type: Type.STRING, description: "Conselho acionável curto." },
            trend: { type: Type.STRING, description: "Tendência observada." }
          },
          required: ["summary", "advice", "trend"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("Resposta vazia do modelo.");
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    return {
      summary: "Não foi possível gerar a análise no momento.",
      advice: "Verifique sua conexão ou tente novamente mais tarde.",
      trend: "Erro"
    };
  }
};
