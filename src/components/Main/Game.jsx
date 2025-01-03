import React, { useContext, useRef, useEffect } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import { TypeAnimation } from "react-type-animation";

const Game = ({ onLogo }) => {
  const {
    showResult,
    setShowResult,
    loading,
    resultData,
    setIsKorean,
    isKorean,
    languageFrom,
    languageTo,
    questions,
    setQuestions,
    answers,
    setAnswers,
    gemini,
    onTranslationEvaluation,
    numQuestions,
    difficulty,
  } = useContext(Context);

  const renderQuestions = (questions, answers, setAnswers) => {
    return questions && questions.questions
      ? questions.questions.map((question, index) => (
        <>
          <div
            className="card"
            key={`card-${index}`}
            onClick={() => {
              const promptText = isKorean
                ? `다음 문장을 번역하세요\n\n${question}`
                : `Enter your translation for\n\n${question}`;
              const userInput = prompt(
                promptText,
                answers[index]
              );
              if (userInput === null) return;
              answers[index] = userInput;
              setAnswers([...answers]);
            }}
          >
            <p>{question}</p>
            <br></br>
            <p>{answers[index]}</p>
            <img src={assets.bulb_icon} alt="" />
          </div>
          <br />
        </> // Add vertical spacing here
      ))
      : null;
  };

  const divRef = useRef(null);

  const fetchData = async () => {
    // Clear questions first
    setQuestions({});
    try {
      const response = await gemini.obtainQuestions(
        languageFrom,
        numQuestions,
        difficulty
      );
      setQuestions(response);
      setAnswers(Array(numQuestions).fill(""));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const divElement = divRef.current;
    divElement.addEventListener("click", onLogo);

    fetchData();

    // Cleanup function to remove the event listener
    return () => {
      divElement.removeEventListener("click", onLogo);
      setQuestions({});
      setAnswers(Array(numQuestions).fill(""));
      setShowResult(false);
    };
  }, []);

  const calculateScore = () => {
    let score = 0;
    resultData.evaluation.forEach((item) => {
      score += item.score;
    });
    return score;
  };

  return (
    <div className="main">
      <div className="nav">
        <p id="logo" ref={divRef} style={{ cursor: "pointer" }}>
          LinguaGhost
        </p>
        <img src={assets.game_logo} alt="" />
      </div>
      <div className="main-container">
        <div className="language-toggle">
          <span id="languageLabel">English</span>
          <label className="switch">
            <input
              type="checkbox"
              id="languageSwitch"
              checked={isKorean}
              onChange={(e) => {
                setIsKorean(e.target.checked);
              }}
            />
            <span className="slider round"></span>
          </label>
          <span id="languageLabel">한글</span>
        </div>
        {showResult ? (
          <div className="result">
            <div className="result-data">
              {loading ? (
                <div className="loader-div">
                  <div className="loader"></div>
                </div>
              ) : (
                <>
                  <div className="translation-evaluation">
                    <TypeAnimation
                      sequence={[
                        `
                          ${isKorean ? "총 점수" : "Total Score"
                        }: ${calculateScore()} / ${numQuestions * 100}
                          `,
                      ]}
                      wrapper="span"
                      style={{ fontSize: "25px" }}
                      speed={50}
                      repeat={0}
                    />
                    <br />
                    <br />
                    {resultData.evaluation.map((item, index) => (
                      <>
                        <div key={index}>
                          <p>
                            {isKorean ? "질문" : "Question"}:{" "}
                            {questions.questions[index]}
                          </p>
                          <p>
                            {isKorean ? "유저 답변" : "User Input"}:{" "}
                            {answers[index]}
                          </p>
                          <p>
                            {isKorean ? "점수" : "Score"}: {item.score}
                          </p>
                          <p>
                            {isKorean ? "평가" : "Evaluation Description"}:{" "}
                            {item.description}
                          </p>
                        </div>
                        <br />
                      </>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="greet">
              <p>
                <span>
                  {isKorean ? "번역하려면 클릭하세요!" : "Click to translate!"}
                </span>
              </p>
              {questions && questions.questions && (
                <button
                  className="refresh-button"
                  onClick={fetchData}
                >
                  {isKorean ? "새로운 문제" : "New Questions"}
                </button>
              )}
            </div>
            {renderQuestions(questions, answers, setAnswers)}
            {questions && questions.questions ? (
              <div className="play-button-div">
                <button
                  className="play-button"
                  onClick={() =>
                    onTranslationEvaluation(
                      languageFrom,
                      languageTo,
                      questions,
                      answers,
                      numQuestions
                    )
                  }
                >
                  {isKorean ? "제출" : "Submit"}
                </button>
              </div>
            ) : (
              <div className="loader-div">
                <div className="loader"></div>
              </div>
            )}
          </>
        )}
        <div className="main-bottom">
          <p className="bottom-info">
            Translation game is powered by Gemini, a Google AI language model.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Game;
