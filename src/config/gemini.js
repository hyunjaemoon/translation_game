import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const GENERATION_CONFIG = {
  temperature: 0.75,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const LANGUAGE_OPTIONS = {
  en: "English",
  ko: "Korean",
  zh: "Chinese",
  ja: "Japanese",
  hi: "Hindi",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
};

class Gemini {
  constructor() {
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: MODEL_NAME });
    this.obtainQuestionsChat = this.model.startChat({
      GENERATION_CONFIG,
      SAFETY_SETTINGS,
    });
    this.evaluationChat = this.model.startChat({
      GENERATION_CONFIG,
      SAFETY_SETTINGS,
    });
  }

  async obtainQuestions(languageFrom, numQuestions) {
    languageFrom = LANGUAGE_OPTIONS[languageFrom];

    const result = await this.obtainQuestionsChat.sendMessage(`
      Construct ${numQuestions} complete ${languageFrom} sentences for translation questions.
      Make it a moderate difficulty.
      The response MUST be in JSON format with the following structure:
      { 
        "questions": ["sentence 1", "sentence 2", "sentence 3", "sentence 4", "sentence 5"]
      }
    `);
    const response = result.response;
    try {
      const questions = JSON.parse(
        response
          .text()
          .replace(/```json|```/g, "")
          .trim()
      );
      return questions;
    } catch (error) {
      alert("An error occurred while parsing the response: " + error.message);
      return {};
    }
  }

  async evaluateChat(
    languageFrom,
    languageTo,
    questions,
    answers,
    numQuestions
  ) {
    if (
      !(
        questions &&
        questions.questions &&
        questions.questions.length == numQuestions
      )
    ) {
      alert("Invalid questions object");
      return {};
    }

    languageFrom = LANGUAGE_OPTIONS[languageFrom];
    languageTo = LANGUAGE_OPTIONS[languageTo];

    const inputArray = [];
    for (let i = 0; i < numQuestions; i++) {
      inputArray.push({
        question: `${questions.questions[i]}`,
        user_input: `${answers[i]}`,
      });
    }

    let message = `
      Consider yourself as a translation video game where you score how well the user 
      translated the given ${numQuestions} ${languageFrom} sentences into ${numQuestions} ${languageTo} sentences. 
      Give me a proper game-like response. The game-like response should be concise in 
      a single sentence. Here are the set of questions and user inputs:
      {
        'input': ${JSON.stringify(inputArray)}
      }

      MUST provide a score from 1 to 100. Return the score and description 
      (strictly in ${languageTo}) of the translation evaluation.
      EVEN IF THE ANSWERS ARE EMPTY, the response MUST be in JSON format with the 
      following structure in respective order as input:
      { 
        "evaluation": [
          ${Array.from(
      { length: numQuestions },
      () => "{score: int, description: str}"
    ).join(", ")}
        ]
      }
    `;
    const result = await this.evaluationChat.sendMessage(message);
    const response = result.response;
    try {
      const evaluationResult = JSON.parse(
        response
          .text()
          .replace(/```json|```/g, "")
          .trim()
      );
      return evaluationResult;
    } catch (error) {
      alert("An error occurred while parsing the response: " + error.message);
      return {};
    }
  }

  async runChat(prompt) {
    const chat = this.model.startChat({
      GENERATION_CONFIG,
      SAFETY_SETTINGS,
      history: [],
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    return response.text();
  }
}

export { Gemini };
