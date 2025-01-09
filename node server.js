// إنشاء لوحة شطرنج
const chessboard = document.getElementById('chessboard');
const status = document.getElementById('status');
const game = new Chess();
let selectedSquare = null;

// إنشاء لوحة الشطرنج
function createBoard() {
  const squares = game.board();
  chessboard.innerHTML = '';

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = document.createElement('div');
      square.classList.add('square');
      square.classList.add((i + j) % 2 === 0 ? 'light' : 'dark');
      square.dataset.row = i;
      square.dataset.col = j;

      const piece = squares[i][j];
      if (piece) {
        square.textContent = getPieceSymbol(piece);
      }

      square.addEventListener('click', () => onSquareClick(i, j));
      chessboard.appendChild(square);
    }
  }
}

// تحويل القطع إلى رموز
function getPieceSymbol(piece) {
  const symbols = {
    p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
    P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
  };
  return symbols[piece.type] || '';
}

// عند النقر على مربع
function onSquareClick(row, col) {
  const square = `${String.fromCharCode(97 + col)}${8 - row}`;

  if (selectedSquare) {
    const move = game.move({ from: selectedSquare, to: square });
    if (move) {
      animateMove(selectedSquare, square);
      selectedSquare = null;
      updateStatus();
    } else {
      selectedSquare = square;
    }
  } else {
    selectedSquare = square;
  }
}

// تحريك القطع مع رسوم متحركة
function animateMove(from, to) {
  const fromSquare = document.querySelector(`[data-row="${8 - parseInt(from[1])}"][data-col="${from.charCodeAt(0) - 97}"]`);
  const toSquare = document.querySelector(`[data-row="${8 - parseInt(to[1])}"][data-col="${to.charCodeAt(0) - 97}"]`);

  const piece = fromSquare.textContent;
  fromSquare.textContent = '';
  toSquare.textContent = piece;

  gsap.fromTo(toSquare, { scale: 0 }, { scale: 1, duration: 0.5 });
}

// تحديث حالة اللعبة
function updateStatus() {
  if (game.in_checkmate()) {
    status.textContent = 'كش ملك! اللعبة انتهت.';
  } else if (game.in_draw()) {
    status.textContent = 'تعادل!';
  } else {
    status.textContent = game.turn() === 'w' ? 'دور الأبيض' : 'دور الأسود';
  }
}

// بدء اللعبة
createBoard();
updateStatus();
