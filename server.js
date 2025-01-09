// عناصر الواجهة
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const accountScreen = document.getElementById('account-screen');
const playWithFriendBtn = document.getElementById('play-with-friend');
const playWithComputerBtn = document.getElementById('play-with-computer');
const createAccountBtn = document.getElementById('create-account');
const deleteAccountBtn = document.getElementById('delete-account');
const backToStartBtn = document.getElementById('back-to-start');
const submitAccountBtn = document.getElementById('submit-account');
const cancelAccountBtn = document.getElementById('cancel-account');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// بيانات الحسابات
let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

// عرض واجهة البداية
function showStartScreen() {
  startScreen.style.display = 'block';
  gameScreen.style.display = 'none';
  accountScreen.style.display = 'none';
}

// عرض واجهة اللعبة
function showGameScreen() {
  startScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  accountScreen.style.display = 'none';
}

// عرض واجهة إنشاء الحساب
function showAccountScreen() {
  startScreen.style.display = 'none';
  gameScreen.style.display = 'none';
  accountScreen.style.display = 'block';
}

// إنشاء حساب جديد
function createAccount(username, password) {
  const account = { username, password };
  accounts.push(account);
  localStorage.setItem('accounts', JSON.stringify(accounts));
  alert('تم إنشاء الحساب بنجاح!');
}

// حذف حساب
function deleteAccount(username) {
  accounts = accounts.filter(account => account.username !== username);
  localStorage.setItem('accounts', JSON.stringify(accounts));
  alert('تم حذف الحساب بنجاح!');
}

// التحقق من الحساب
function checkAccount(username, password) {
  return accounts.some(account => account.username === username && account.password === password);
}

// أحداث الأزرار
playWithFriendBtn.addEventListener('click', () => {
  showGameScreen();
  initializeGame();
});

playWithComputerBtn.addEventListener('click', () => {
  showGameScreen();
  initializeGame();
});

createAccountBtn.addEventListener('click', () => {
  showAccountScreen();
});

deleteAccountBtn.addEventListener('click', () => {
  const username = prompt('أدخل اسم المستخدم لحذف الحساب:');
  if (username) {
    deleteAccount(username);
  }
});

backToStartBtn.addEventListener('click', () => {
  showStartScreen();
});

submitAccountBtn.addEventListener('click', () => {
  const username = usernameInput.value;
  const password = passwordInput.value;
  if (username && password) {
    createAccount(username, password);
    showStartScreen();
  } else {
    alert('يرجى ملء جميع الحقول!');
  }
});

cancelAccountBtn.addEventListener('click', () => {
  showStartScreen();
});

// بدء اللعبة
function initializeGame() {
  const game = new Chess();
  let selectedSquare = null;

  function createBoard() {
    const squares = game.board();
    const chessboard = document.getElementById('chessboard');
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

  function getPieceSymbol(piece) {
    const symbols = {
      p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
      P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
    };
    return symbols[piece.type] || '';
  }

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

  function animateMove(from, to) {
    const fromSquare = document.querySelector(`[data-row="${8 - parseInt(from[1])}"][data-col="${from.charCodeAt(0) - 97}"]`);
    const toSquare = document.querySelector(`[data-row="${8 - parseInt(to[1])}"][data-col="${to.charCodeAt(0) - 97}"]`);

    const piece = fromSquare.textContent;
    fromSquare.textContent = '';
    toSquare.textContent = piece;

    gsap.fromTo(toSquare, { scale: 0 }, { scale: 1, duration: 0.5 });
  }

  function updateStatus() {
    const status = document.getElementById('status');
    if (game.in_checkmate()) {
      status.textContent = 'كش ملك! اللعبة انتهت.';
    } else if (game.in_draw()) {
      status.textContent = 'تعادل!';
    } else {
      status.textContent = game.turn() === 'w' ? 'دور الأبيض' : 'دور الأسود';
    }
  }

  createBoard();
  updateStatus();
}

// عرض واجهة البداية عند التحميل
showStartScreen();
