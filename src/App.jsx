import React, { useState } from "react";
import Landing from "./components/Main/Landing";
import Game from "./components/Main/Game";
import Login from "./components/Main/Login";

const App = () => {
  const [showMain, setShowMain] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const handlePlayButtonClick = () => {
    setShowMain(true);
  };

  const handleLogoButtonClick = () => {
    setShowMain(false);
  };

  const handleLoginSuccess = (response) => {
    setAuthenticated(true);
    console.log('Login Success:', response);
    setAccessToken(response.credentials);
    // Handle login success (e.g., send the token to your server)
  };

  const handleLoginFailure = (error) => {
    setAuthenticated(false);
    console.error('Login Failed:', error);
    // Handle login failure
  };

  return (
    <>
      {!authenticated && <Login></Login>}
      {authenticated && (
        <>
          {!showMain && <Landing onPlay={handlePlayButtonClick} />}
          {showMain && <Game onLogo={handleLogoButtonClick} />}
        </>
      )}
    </>
  );
};

export default App;
