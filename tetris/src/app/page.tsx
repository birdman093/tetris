"use client"
import Link from "next/link";
import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";
import _ from 'lodash';
import { Piece, Location } from "./piece";

import styles from "./index.module.css";

const ROWS = 20;
const COLS = 10;
const NOGAME = "NONE";
const PLAYING = "PLAYING";
const PAUSED = "PAUSED";
const GAMESTATES = [PLAYING, NOGAME, PAUSED];
const BOUNDARY = "BOUNDARY";
const BOTTOM = "BOTTOM";
const PIECE = "PIECE";
const NONE = "NONE"
const COLLISIONSTATES = [BOUNDARY, BOTTOM, PIECE, NONE];

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
  return new Piece(ROWS/2,2,0,-1,"red");
}

export default function Home() {

  const [game, setGame] = useState(NOGAME);
  const [board, setBoard] = useState(resetBoard());
  const [piece, setPiece] = useState<Piece|null>(null);
  const [score, setScore] = useState(0);
  const [highscore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(1000);

  // Handles stale state from functions defined in useEffect
  const gameRef = useRef(game);
    useEffect(() => {
        gameRef.current = game;
    }, [game]);
  const pieceRef = useRef(piece);
  useEffect(() => {
      pieceRef.current = piece;
  }, [piece]);

  // game arrow handlers
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameRef.current === PLAYING && pieceRef.current != null){
        switch (event.key) {
          case 'ArrowUp':
            movePiece(0,0,1);
            console.log('Up key pressed');
            break;
          case 'ArrowDown':
            movePiece(0,1,0);
            console.log('Down key pressed');
            break;
          case 'ArrowLeft':
            movePiece(-1,0,0);
            console.log('Left key pressed');
            break;
          case 'ArrowRight':
            movePiece(1,0,0);
            console.log('Right key pressed');
            break;
          default:
            // Handle other keys
            break;
          }
      }
    };

    // Add event listener to the window object
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup function to remove the event listener
    return () => {
        window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const startPiece = (newPiece: Piece) => {
    // clear current piece
    if (piece != null){
      clearInterval(piece.speed)
    }

    // set timer on new piece
    newPiece.speed = setInterval(movePiece, speed, [0,1,0])
    setPiece(newPiece);
  }

  const movePiece = 
  (xOffset: number, yOffset: number, rotationOffset: number) => {
    if (piece != null) {
      // side boundary collision -- do not move piece
      if (sideCollisionCheck(piece.getAllOffsetPoints(xOffset, yOffset)))
      {
        return;
      }

      // bottom boundary collision -- update board, create new piece
      if (bottomCollisionCheck(piece.getAllOffsetPoints(xOffset, yOffset)))
      {
        updateBoard(piece.getAllPoints());
        startPiece(createPiece());
        return;
      }

      // piece collision -- update board, create new piece
      if (pieceCollisonCheck(piece.getAllOffsetPoints(xOffset, yOffset))) {
        updateBoard(piece.getAllPoints());
        startPiece(createPiece());
        return;
      }

      // no collision -- update piece
     startPiece(new Piece(
        piece.x() + xOffset, 
        piece.y() + yOffset, 
        piece.rotation + rotationOffset,
        piece.speed, 
        piece.color
      ))
    }
    
  };

  const pieceCollisonCheck = (points: Location[]) => {
    points.forEach(point => {
      if (board && board.length > point.x() && point.x() >= 0){
        const boardrow = board[point.x()]
        if (boardrow && boardrow.length > point.y() && point.y() >= 0 
        && boardrow[point.y()] == true){
          return true;
        }
      }
    });
    return false;
  }

  const sideCollisionCheck = (points: Location[]): boolean => {
    points.forEach(point => {
      if (point.x() < 0 || point.x() >= COLS){
        return true;
      }
    });
    return false;
  }

  const bottomCollisionCheck = (points: Location[]): boolean => {
    points.forEach(point => {
      if (point.y() >= ROWS){
        return true;
      }
    });
    return false;
  }

  const updateBoard = (points: Location[]) => {
    const newBoard = _.cloneDeep(board);
    if (!newBoard){
      console.log("ERROR: Update Board - Cloning")
      return;
    }
    points.forEach(point => {
      const x = point.x();
      const y = point.y();
      if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
        const row = newBoard[x];
        if (row && y < row.length) {
            row[y] = true;
        }
      }
    });

    setBoard(newBoard);

    // Clear Lines

  }



  function handleNewGame() {
    if (game != NOGAME) {
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

  const displayBoard = () => {

    const grid = []
    for (let i = 0; i < ROWS; i++) {
      const row = [];
      for (let j = 0; j < COLS; j++) {
          row.push(
              <div key={`${i}-${j}`} className={styles.gridSquare}></div>
          );
      }
      grid.push(
          <div key={i} className={styles.gridRow}>{row}</div>
      );
    }


    return (
      <div className={styles.board}>
      </div>)
  }

  

  return (
    <main className={styles.main}>
      <div className = {styles.gamestats}>
        <button onClick={handleNewGame}>New Game</button>
        <h6 className = {styles.scores}>High Score : {score}</h6>
        <h3 className = {styles.scores}>Score : {highscore}</h3>
        <h3>Game State : {game}</h3>
      </div>
      <div className={styles.canvas}>
        {displayBoard()}
      </div>
    </main>
  );
}
