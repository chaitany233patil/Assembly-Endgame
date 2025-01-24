import { useState } from "react";
import "./App.css";
import { languages } from "./data/languages";
import clsx from "clsx";
import { getFarewellText, getRandomWorld } from "./utils";
import Confetti from "react-confetti";

function App() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWorld());
  const [guessLetter, setGuessLetter] = useState([]);

  function hanldeGameOver() {
    setGuessLetter([]);
    setCurrentWord(getRandomWorld());
  }

  const wrongGuessCount = guessLetter.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const alphabets = "abcdefghijklmnopqrstuvwxyz";

  let isGameWon = currentWord
    .split("")
    .every((letter) => guessLetter.includes(letter));
  let isGameLost = wrongGuessCount >= languages.length - 1;
  let isGameOver = isGameWon || isGameLost;

  function handleGuess(letter) {
    setGuessLetter((prevGuess) => {
      return prevGuess.includes(letter) ? prevGuess : [...prevGuess, letter];
    });
  }

  const currentWordEls = currentWord.split("").map((letter, index) => {
    return (
      <span key={index} id={!guessLetter.includes(letter) && "finish"}>
        {isGameOver
          ? letter.toUpperCase()
          : guessLetter.includes(letter)
          ? letter.toUpperCase()
          : ""}
      </span>
    );
  });

  const keyboardBtn = alphabets.split("").map((letter, index) => {
    let isGuessed = guessLetter.includes(letter);
    let isCorrect = isGuessed && currentWord.includes(letter);
    let isWrong = isGuessed && !currentWord.includes(letter);
    return (
      <button
        className={clsx(`key`, { correct: isCorrect, wrong: isWrong })}
        key={index}
        onClick={() => handleGuess(letter)}
        disabled={isGameOver && true}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const languagesEls = languages.map((lang, index) => {
    let isGuessWrong;
    if (wrongGuessCount <= languages.length - 1) {
      isGuessWrong = wrongGuessCount - 1 >= index;
    }
    return (
      <span
        style={{
          background: lang.backgroundColor,
          color: lang.color,
        }}
        key={lang.name}
        className={clsx(`chip`, { lost: isGuessWrong })}
      >
        {lang.name}
      </span>
    );
  });

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    wrong: wrongGuessCount && !isGameOver,
  });

  function gameRenderStatus() {
    if (!isGameOver) {
      if (wrongGuessCount == 0) return null;
      return getFarewellText(languages[wrongGuessCount - 1].name);
    }

    if (isGameWon) {
      return (
        <>
          <h3>You Win!</h3>
          <p>Well done! 🎉</p>
        </>
      );
    } else {
      return (
        <>
          <h3>Game over!</h3>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      );
    }
  }

  return (
    <>
      <header>
        {isGameWon && <Confetti />}
        <h1 className="title">Assembly: Endgame</h1>
        <p className="description">
          Guess the word in under 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>

      <section className={gameStatusClass}>{gameRenderStatus()}</section>

      <section className="languages-chips">{languagesEls}</section>

      <section className="word">{currentWordEls}</section>

      <section className="keyBoard">{keyboardBtn}</section>

      {isGameOver && (
        <button className="new-game-btn" onClick={hanldeGameOver}>
          New game
        </button>
      )}
    </>
  );
}

export default App;
