"use client"
import Link from "next/link";
import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";
import _ from 'lodash';
import { AbstractPiece, Location, createPiece, recreatePieceWOffset} from "./piece";

import styles from "./index.module.css";
import "../styles/pieces.css";

const ROWS = 20;
const COLS = 10;
const NOGAME = "NONE";
const PLAYING = "PLAYING";
const PAUSED = "PAUSED";
const GAMESTATES = [PLAYING, NOGAME, PAUSED];

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



export default function Home() {

  const [game, setGame] = useState(NOGAME);
  const [board, setBoard] = useState(resetBoard());
  const [piece, setPiece] = useState<AbstractPiece|null>(null);
  const [score, setScore] = useState(0);
  const [highscore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(1000);

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

  const startPiece = (newPiece: AbstractPiece) => {
    const currpiece = pieceRef.current;
    const currboard = boardRef.current;
    // clear current piece
    if (currpiece != null){
      clearInterval(currpiece.speed)
    }

    // check if piece can be created
    for (const point of newPiece.getAllPoints()) {
      const currentrow = currboard[point.y()];
      if (currentrow && currentrow[point.x()] === true) {
        setGame("NONE");
        setScore(1000);
      }
    }

    // timer confused for Node.js timeout -- assert return type
    newPiece.speed = 
    setInterval(movePiece, speedRef.current, 0,1,0) as unknown as number;
    setPiece(newPiece);
  }

  const movePiece = 
  (xOffset: number, yOffset: number, rotationOffset: number) => {
    const currpiece = pieceRef.current
    if (currpiece != null) {
      // side boundary collision -- do not move piece
      if (sideCollisionCheck(currpiece.getAllOffsetPoints(xOffset, yOffset)))
      {
        return;
      }

      // bottom boundary collision -- update board, create new piece
      if (bottomCollisionCheck(currpiece.getAllOffsetPoints(xOffset, yOffset)))
      {
        updateBoard(currpiece.getAllPoints());
        startPiece(createPiece(COLS/2, 1));
        return;
      }

      // piece collision -- update board, create new piece
      if (pieceCollisonCheck(currpiece.getAllOffsetPoints(xOffset, yOffset))) {
        updateBoard(currpiece.getAllPoints());
        startPiece(createPiece(COLS/2, 1));
        return;
      }

      // no collision -- update piece
      startPiece(recreatePieceWOffset(
        xOffset, yOffset, rotationOffset, currpiece))
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
        <h3 className = {styles.scores}>High Score : {score}</h3>
        <h3 className = {styles.scores}>Score : {highscore}</h3>
        <h3 className = {styles.scores}>Game State : {game}</h3>
      </div>
      {displayBoard()}
    </main>
  );
}
