import React, { useContext } from "react";
import { GoogleLogin } from '@react-oauth/google';
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
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
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
