import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button type="button" className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Status({squares, xIsNext, move}) {
  const result = calculateWinner(squares);
  let statusText;
  if (result === null && move === 9) {
    statusText = 'draw 🤝🏽';
  } else if (result === null) {
    statusText = `${xIsNext ? 'X' : 'O'} play`;
  } else {
    statusText = `${result} win 🎉`;
  }

  return (
    <div className='status'>Status: <b>{statusText}</b></div>
  );
}

function Board({xIsNext, squares, move, onPlay}) {
  function handleClick(squareIndex) {
    if (calculateWinner(squares) || squares[squareIndex]) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[squareIndex] = 'X';
    } else {
      nextSquares[squareIndex] = 'O';
    }
    onPlay(nextSquares);
  }

  return (
    <>
      <Status  xIsNext={xIsNext} squares={squares} move={move} />
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handlePlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function reset() {
    setCurrentMove(0);
    setHistory([Array(9).fill(null)]);
  }

  const moves = history.map((squares, move) => {
    let description = 'Game Start';
    if (move > 0) {
      description = `Move #${move}`;
    }

    return (
      // eslint-disable-next-line react/no-array-index-key
      <li key={move}>
        Go to <button className="btn" type="button" onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );    
  });

  return (
    <div className="container">
      <button className="btn" type="button" onClick={() => reset()}>Reset</button>
      <div className="title">
        Tic-Tac-Toe
      </div>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} move={currentMove} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          Move History:
          <ol>{moves}</ol>
        </div>
      </div>
    </div>
  );
}
