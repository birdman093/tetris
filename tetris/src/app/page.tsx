"use client"
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import _ from 'lodash';
import { createPiece, recreatePieceWOffset} from "./piece";
import type {AbstractPiece, Location} from "./piece";

import styles from "./index.module.css";
import "../styles/pieces.css";

const ROWS = 20;
const COLS = 10;
const NOGAME = "NONE";
const PLAYING = "PLAYING";
const PAUSED = "PAUSED";
const GAMESTATES = [PLAYING, NOGAME, PAUSED];

function resetBoard() { 
  const matrix = [];
  for (let i = 0; i < ROWS; i++) {
      const row = [];
      for (let j = 0; j < COLS; j++) {
          row.push(false);
      }
      matrix.push(row);
  }
  return matrix
}



export default function Home() {

  const [game, setGame] = useState(NOGAME);
  const [board, setBoard] = useState(resetBoard());
  const [piece, setPiece] = useState<AbstractPiece|null>(null);
  const [score, setScore] = useState(0);
  const [highscore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const [fallintervalID, setFallIntervalID] = useState(0);

  // Handles stale state for functions in useEffect
  const gameRef = useRef(game);
    useEffect(() => {
        gameRef.current = game;
    }, [game]);
  const pieceRef = useRef(piece);
  useEffect(() => {
      pieceRef.current = piece;
  }, [piece]);
  const boardRef = useRef(board);
  useEffect(() => {
    boardRef.current = board;
  }, [board]);
  
  const speedRef = useRef(speed);
    useEffect(() => {
      speedRef.current = speed;
  }, [speed]);

  const scoreRef = useRef(score);
    useEffect(() => {
      scoreRef.current = score;
  }, [score]);

  const highscoreRef = useRef(highscore);
    useEffect(() => {
      highscoreRef.current = highscore;
  }, [highscore]);
  const fallintervalRef = useRef(fallintervalID);
    useEffect(() => {
      fallintervalRef.current = fallintervalID;
  }, [fallintervalID]);


  // game arrow handlers
  useEffect(() => {
    // Handling keyPress in the useEffect causes all the useRef usages
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameRef.current === PLAYING && pieceRef.current != null){
        switch (event.key) {
          case 'ArrowUp':
            movePiece(0,0,1);
            break;
          case 'ArrowDown':
            movePiece(0,1,0);
            break;
          case 'ArrowLeft':
            movePiece(-1,0,0);
            break;
          case 'ArrowRight':
            movePiece(1,0,0);
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

  const startPiece = (newPiece: AbstractPiece, resetTimer: boolean) => {
    const currpiece = pieceRef.current;
    const currboard = boardRef.current;
    const fallinterval = fallintervalRef.current;

    // check if piece can be created
    for (const point of newPiece.getAllPoints()) {
      const currentrow = currboard[point.y()];
      if (currentrow && currentrow[point.x()] === true) {
        setGame("NONE"); 
        setHighScore(Math.max(scoreRef.current, highscoreRef.current));
        if (currpiece != null){
          clearInterval(fallinterval)
          setFallIntervalID(0);
        }
        setPiece(null);
        return;
      }
    }

    if (resetTimer) {
      clearInterval(fallinterval)
      // timer confused by Node.js timeout -- assert return type
      setFallIntervalID(setInterval(movePiece, speedRef.current, 0,1,0) as unknown as number);
    }
    

    setPiece(newPiece);
  }

  const movePiece = 
  (xOffset: number, yOffset: number, rotationOffset: number) => {
    const currpiece = pieceRef.current
    if (currpiece != null) {
      // side boundary collision -- do not move piece
      if (sideCollisionCheck(currpiece.getAllOffsetPoints(xOffset, yOffset, rotationOffset)))
      {
        return;
      }

      // bottom boundary collision -- update board, create new piece
      if (bottomCollisionCheck(currpiece.getAllOffsetPoints(xOffset, yOffset, rotationOffset)))
      {
        updateBoard(currpiece.getAllPoints());
        startPiece(createPiece(COLS/2, 1), true);
        return;
      }

      // piece collision -- update board if piece is moving down, and create new piece
      const pieceCollison = pieceCollisonCheck(currpiece.getAllOffsetPoints(xOffset, yOffset, rotationOffset));
      if (yOffset === 1 && pieceCollison) {
        updateBoard(currpiece.getAllPoints());
        startPiece(createPiece(COLS/2, 1), true);
        return;
      } else if (pieceCollison) {
        return;
      }

      // no collision -- update piece
      startPiece(recreatePieceWOffset(
        xOffset, yOffset, rotationOffset, currpiece), yOffset === 1)
    }
    
  };

  const pieceCollisonCheck = (points: Location[]) => {
    const currBoard = boardRef.current;
    if(!currBoard){
      return false;
    }
    for (const point of points) {
      const boardrow = currBoard[point.y()]
      if (boardrow && boardrow[point.x()] == true) {
        return true;
      }
    };
    return false;
  }

  const sideCollisionCheck = (points: Location[]): boolean => {
    for (const point of points) {
      if (point.x() < 0 || point.x() >= COLS) {
        return true;
      }
    }
    return false;
  }

  const bottomCollisionCheck = (points: Location[]): boolean => {
    for (const point of points) {
      if (point.y() >= ROWS){
        return true;
      }
    };
    return false;
  }

  const updateBoard = (points: Location[]) => {
    const currBoard = boardRef.current;
    const newBoard: boolean[][] = _.cloneDeep(currBoard);
    if (!newBoard){
      console.log("ERROR: Update Board - Cloning")
      return;
    }
    for (const point of points) {
      const x = point.x();
      const y = point.y();
      if (x >= 0 && x < COLS && y >= 0 && y < ROWS) 
      {
        // Typescript gymnastics to not have an undefined type issue
        const row = newBoard[y]
        if (row){
          row[x] = true;
          newBoard[y] = row;
        }
      }
    };

    //setBoard(newBoard);
    const clearedRows = rowsToClear(newBoard);
    if (clearedRows.length > 0)
    {
      const previouslines = scoreRef.current;
      const newlines = previouslines + clearedRows.length
      setScore(newlines);
      console.log(`Current: ${newlines} Previous: ${previouslines}`);
      updateSpeed(previouslines, newlines);
      
      // TODO: BLINK cleared rows

      // Remove rows
      for (const rowIndex of clearedRows) {
        if (rowIndex >= 0 && rowIndex < newBoard.length) {
            newBoard.splice(rowIndex, 1);
        }
      }

      // Add rows
      for (const rowIndex of clearedRows) {
        const newrow: boolean[] = new Array<boolean>(COLS).fill(false)
        newBoard.unshift(newrow);
      }
      
    }
    setBoard(newBoard);
    
  }

  function updateSpeed(previouslines: number, completedlines: number){
    const currspeed = speedRef.current;
    const curr10 = Math.floor(completedlines / 10);
    const prev10 = Math.floor(previouslines / 10);
    if (curr10 > prev10){
      const newspeed = currspeed * Math.pow(0.80,curr10-prev10);
      console.log(`Current: ${curr10} Previous: ${prev10} Speed: ${newspeed}`);
      setSpeed(newspeed);
    }
  }

  // Returns full rows in reverse order 
  function rowsToClear(currBoard: boolean[][]): number[] {
    const completed = []
    for (let rowIndex = currBoard.length - 1; rowIndex >= 0; rowIndex--) {
      const row = currBoard[rowIndex];
      if (!row){
        continue;
      }
      let complete = true;
      for (const elm of row){
        if (elm === false){
          complete = false;
          break;
        }
      }
      if (complete){
        completed.push(rowIndex)
      }
    }
    return completed;
  }

  function handleNewGame() {
    if (game != NOGAME) {
      const userResponse = 
      confirm('Game is ongoing! Do you want to start a new game anyway?');
      if (!userResponse){ return;}
    }
    setHighScore(Math.max(highscore, score));
    setScore(0);
    setGame(PLAYING)
    setBoard(resetBoard());
    setPiece(createPiece(COLS/2, 1));
  }

  const displayBoard = () => {
    const grid = []
    for (let y = 0; y < ROWS; y++) {
      const row = [];
      for (let x = 0; x < COLS; x++) {
          let pieceClass = `${styles.gridSquare} ${styles.blankSquare}`;

          // color board
          if (board){
            const currentrow = board[y];
            if (!currentrow){
              continue;
            }
            const currelm = currentrow[x];
            if (currelm === true) {
              pieceClass = `${styles.gridSquare} ${styles.lockedBlock}`;
            }
          }

          // color piece
          if (piece && piece.isPieceAtPoint(x, y))
          {
            pieceClass = `${styles.gridSquare} ${piece.style}`;
          }

          row.push(
              <div key={`${y}-${x}`} className={pieceClass}></div>
          );
      }
      grid.push(
          <div key={y} className={styles.gridRow}>{row}</div>
      );
    }

    return (
      <div className={styles.board}>
        {grid}
      </div>)
  }

  

  return (
    <main className={styles.main}>
      <div className = {styles.gamestats}>
        <button onClick={handleNewGame}>New Game</button>
        <h3 className = {styles.scores}>High Score : {highscore}</h3>
        <h3 className = {styles.scores}>Score : {score}</h3>
        <h3 className = {styles.scores}>Game State : {game}</h3>
      </div>
      {displayBoard()}
    </main>
  );
}
