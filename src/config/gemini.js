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

  async obtainQuestions(languageFrom) {
    const languageFromOptions = {
      en: "English",
      ko: "Korean",
      zh: "Chinese",
      ja: "Japanese",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ru: "Russian",
    };

    languageFrom = languageFromOptions[languageFrom];

    // Use selectOptions wherever you need the HTML options

    const result = await this.obtainQuestionsChat.sendMessage(`
      Construct 5 complete ${languageFrom} sentences for translation questions.
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

  async evaluateChat(languageFrom, languageTo, questions, answers) {
    if (
      !(questions && questions.questions && questions.questions.length === 5)
    ) {
      alert("Invalid questions object");
      return {};
    }

    const languageOptions = {
      en: "English",
      ko: "Korean",
      zh: "Chinese",
      ja: "Japanese",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ru: "Russian",
    };

    languageFrom = languageOptions[languageFrom];
    languageTo = languageOptions[languageTo];

    const result = await this.evaluationChat.sendMessage(`
      Consider yourself as a translation video game where you score how well the user 
      translated the given 5 ${languageFrom} sentences into 5 ${languageTo} sentences. 
      Give me a proper game-like response. The game-like response should be concise in 
      a single sentence. Here are the set of questions and user inputs:
      {
        'input': [
          { 'question': '${questions.questions[0]}', 'user_input': '${answers[0]}' },
          { 'question': '${questions.questions[1]}', 'user_input': '${answers[1]}' },
          { 'question': '${questions.questions[2]}', 'user_input': '${answers[2]}' },
          { 'question': '${questions.questions[3]}', 'user_input': '${answers[3]}' },
          { 'question': '${questions.questions[4]}', 'user_input': '${answers[4]}' }
        ]
      }

      MUST provide a score from 1 to 100. Return the score and description 
      (strictly in ${languageTo}) of the translation evaluation.
      EVEN IF THE ANSWERS ARE EMPTY, the response MUST be in JSON format with the 
      following structure in respective order as input:
      { 
        "evaluation": [
          { "score": int, "description": str },
          { "score": int, "description": str },
          { "score": int, "description": str },
          { "score": int, "description": str },
          { "score": int, "description": str }       
        ]
      }
    `);
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
