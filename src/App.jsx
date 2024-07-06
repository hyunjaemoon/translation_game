import React, { useState } from "react";
import Landing from "./components/Main/Landing";
import Game from "./components/Main/Game";

const App = () => {
  const [showMain, setShowMain] = useState(false);

  const handlePlayButtonClick = () => {
    setShowMain(true);
  };

  const handleLogoButtonClick = () => {
    setShowMain(false);
  };

  return (
    <>
      {!showMain && <Landing onPlay={handlePlayButtonClick} />}
      {showMain && <Game onLogo={handleLogoButtonClick} />}
    </>
  );
};

export default App;
