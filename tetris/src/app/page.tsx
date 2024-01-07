"use client"
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { Piece } from "./piece";

import styles from "./index.module.css";
import { boolean } from "zod";

const ROWS = 20;
const COLS = 10;
const GAMESTATES = ["PLAYING", "NONE", "PAUSED"];

function resetBoard() { 
  let matrix = [];
  for (let i = 0; i < ROWS; i++) {
      let row = [];
      for (let j = 0; j < COLS; j++) {
          row.push(false);
      }
      matrix.push(row);
  }
  return matrix
}

function createPiece() {
  //TODO:
  return new Piece(0,0,0,"red");
}

export default function Home() {

  const [game, setGame] = useState("NONE");
  const [board, setBoard] = useState(resetBoard());
  const [piece, setPiece] = useState<Piece|null>(null);
  const [score, setScore] = useState(0);
  const [highscore, setHighScore] = useState(0);
  
  function handleNewGame() {
    if (game != "NONE") {
      const userResponse = 
      confirm('Game is ongoing! Do you want to start a new game anyway?');
      if (!userResponse){ return;}
    }
    setHighScore(Math.max(highscore, score));
    setScore(0);
    setGame("PLAYING")
    setBoard(resetBoard());
    setPiece(createPiece());
  }

  return (
    <main className={styles.main}>
      <div className = {styles.gamestats}>
        <button onClick={handleNewGame}>New Game</button>
        <h6 className = {styles.scores}>High Score: {score}</h6>
        <h3 className = {styles.scores}>Score: {highscore}</h3>
      </div>
      <div className={styles.canvas}>
          <div className={styles.board}>
            {/* Board content goes here */}
          </div>
      </div>
    </main>
  );
}
