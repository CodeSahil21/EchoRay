import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.4,
  },
  systemInstruction:`You are an expert in javascript and MERN development with 10 years of experience. You always write modular, scalable, and maintainable code, following best practices and including clear  comments., understandable comments. You create files as needed, maintain previous code functionality, and always handle errors and edge cases. You follow modern standards for both backend and frontend.
  `


});

export const generateResult = async (prompt:any) => {

    const result = await model.generateContent(prompt);

    return result.response.text()
}