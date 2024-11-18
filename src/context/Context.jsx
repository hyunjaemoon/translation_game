import { createContext, useState } from "react";
import { Gemini } from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState({});
  const [isKorean, setIsKorean] = useState(false);
  const [languageFrom, setLanguageFrom] = useState("en");
  const [languageTo, setLanguageTo] = useState("ko");
  const [questions, setQuestions] = useState({});
  const [answers, setAnswers] = useState([""]);
  const [gemini, setGemini] = useState(new Gemini());
  const [numQuestions, setNumQuestions] = useState(1);

  const onTranslationEvaluation = async (languageFrom, languageTo, questions, answers, numQuestions) => {
    setResultData({});
    setLoading(true);
    setShowResult(true);
    let response = await gemini.evaluateChat(languageFrom, languageTo, questions, answers, numQuestions);
    setResultData(response);
    setLoading(false);
  };

  const onNewGame = async() => {
    
  }

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    setRecentPrompt,
    recentPrompt,
    showResult,
    setShowResult,
    loading,
    setLoading,
    resultData,
    setResultData,
    input,
    setInput,
    isKorean,
    setIsKorean,
    languageFrom,
    setLanguageFrom,
    languageTo,
    setLanguageTo,
    questions,
    setQuestions,
    answers,
    setAnswers,
    gemini,
    setGemini,
    onTranslationEvaluation,
    numQuestions,
    setNumQuestions,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
