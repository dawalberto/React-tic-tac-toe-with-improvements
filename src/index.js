import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


function Square(props) {
  return (
    <button 
      className={`square ${ props.highlight && 'bg-red' }`}
      onClick={ props.onClick }
    >
      { props.value }
    </button>
  );
}

class Board extends React.Component {
  render() {
    const rows = 3 
    const cols = 3
    const board = []
    let squares = []

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let x = j

        if (i === 1) {
         x += 3
        } else if (i === 2) {
          x += 6
        }

        squares.push(this.renderSquare(x))
      }

      board.push(
        <div 
          className="board-row" 
          key={ Date.now() + Math.random() }
        >
          { squares }
        </div>
      )

      squares = []
    }

    return <div>{ board }</div>
  }

  renderSquare(i) {
    const winnerLines = this.props.winner ? this.props.winner.lines : null
    const highlight = winnerLines ? winnerLines.some(line => line === i) : false

    return (
      <Square 
        key={ Date.now() + Math.random() }
        value={ this.props.squares[i] }
        highlight={ highlight }
        onClick={ () => this.props.onClick(i) } 
      />
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        colRowMoved: null
      }],
      xIsNext: true,
      stepNumber: 0,
      orderToggled: false
    }
  }

  render() {
    const history = this.state.history
    const currentHistory = history[this.state.stepNumber]
    let winner = calculateWinner(currentHistory.squares)

    const moves = history.map((historyItem, move) => {
      let desc

      if (this.state.orderToggled) {
        let i = history.length - move
        desc = i !== 1 ?
          `Go to move #${ i - 1 } ${ historyItem.colRowMoved }` :
          'Go to game start'
      } else {
        desc = move ?
        `Go to move #${ move } ${ historyItem.colRowMoved }` :
        'Go to game start'
      }

      if (move === this.state.stepNumber) {
        desc = `<b>${ desc }</b>`
      }

      return (
        <li key={ move }>
          <button 
            onClick={ () => this.jumpTo(move) } 
            dangerouslySetInnerHTML={{__html: desc}}
          ></button>
        </li>
      )
    })

    let status
    if (winner) {
      status = `Winner: ${ winner.winner }`
    } else {
      status = `Next player: ${ this.state.xIsNext ? 'X' : 'O' }`;
    }

    if (currentHistory.squares.every(square => square !== null)) {
      status = 'Draw'
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={ currentHistory.squares } 
            onClick={ (i) => this.handleClick(i) }
            winner={ winner }
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <button onClick={ () => this.toggleOrder() }>Toggle</button>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const currentHistory = history[history.length - 1]
    const squares = currentHistory.squares.slice()
    let colRowMoved = currentHistory.colRowMoved

    if (calculateWinner(squares) || squares[i]) {
      return
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O'
    colRowMoved = getColRowMoved(i)

    this.setState({ 
      history: history.concat([{ 
        squares,
        colRowMoved
      }]), 
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
     })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  toggleOrder() {
    const history = this.state.history.slice().reverse()
    this.setState({
      orderToggled: !this.state.orderToggled,
      history
    })
  }
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

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a], 
        lines: lines[i]
      }
    }
  }

  return null
}

function getColRowMoved(i) {
  let col, row

  switch (i) {
    case 0:
    case 1:
    case 2:
      row = '1'
      break;
  
    case 3:
    case 4:
    case 5:
      row = '2'
      break;

    case 6:
    case 7:
    case 8:
      row = '3'
      break;

    default:
      row = ''
  }

  switch (i) {
    case 0:
    case 3:
    case 6:
      col = '1'
      break;
  
    case 1:
    case 4:
    case 7:
      col = '2'
      break;

    case 2:
    case 5:
    case 8:
      col = '3'
      break;

    default:
      col = ''
  }

  return `(${col}, ${row})`
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
