import React, { useContext } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

function Landing({ onPlay }) {
  const {
    setIsKorean,
    isKorean,
    setLanguageFrom,
    languageFrom,
    setLanguageTo,
    languageTo,
  } = useContext(Context);

  const handleLanguageFromChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === languageTo) {
      setLanguageTo(languageFrom);
    }
    setLanguageFrom(selectedValue);
  };

  const handleLanguageToChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === languageFrom) {
      setLanguageFrom(languageTo);
    }
    setLanguageTo(selectedValue);
  };

  return (
    <div className="main">
      <div className="nav">
        <p>LinguaGhost</p>
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
        <div className="greet">
          <p>
            <span>
              {isKorean
                ? "LinguaGhost에 오신걸 환영합니다!"
                : "Welcome to LinguaGhost!"}
            </span>
          </p>
          <p>{isKorean ? "번역 할 준비가 되셨나요?" : "Ready to translate?"}</p>
        </div>
        <div className="select-boxes">
          <div className="select-box">
            <label htmlFor="translate-from">
              {isKorean ? "번역 원문:" : "Translate from:"}
            </label>
            <select
              id="translate-from"
              onChange={handleLanguageFromChange}
              value={languageFrom}
            >
              <option value="en">English</option>
              <option value="ko">Korean</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="ru">Russian</option>
            </select>
          </div>
          <div className="select-box">
            <label htmlFor="translate-to">
              {isKorean ? "번역 대상:" : "Translate to:"}
            </label>
            <select
              id="translate-to"
              onChange={handleLanguageToChange}
              value={languageTo}
            >
              <option value="en">English</option>
              <option value="ko">Korean</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="ru">Russian</option>
            </select>
          </div>
        </div>
        <div className="play-button-div">
          <button className="play-button" onClick={onPlay}>
            {isKorean ? "시작" : "Start"}
          </button>
        </div>
        <div className="main-bottom">
          <p className="bottom-info">
            Translation game is powered by Gemini, a Google AI language model.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
