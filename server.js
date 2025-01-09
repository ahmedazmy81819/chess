// عناصر الواجهة
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const createAccountScreen = document.getElementById('create-account-screen');
const deleteAccountScreen = document.getElementById('delete-account-screen');
const playWithFriendBtn = document.getElementById('play-with-friend');
const playWithComputerBtn = document.getElementById('play-with-computer');
const createAccountBtn = document.getElementById('create-account');
const deleteAccountBtn = document.getElementById('delete-account');
const backToStartBtn = document.getElementById('back-to-start');
const submitCreateAccountBtn = document.getElementById('submit-create-account');
const cancelCreateAccountBtn = document.getElementById('cancel-create-account');
const submitDeleteAccountBtn = document.getElementById('submit-delete-account');
const cancelDeleteAccountBtn = document.getElementById('cancel-delete-account');
const newUsernameInput = document.getElementById('new-username');
const newPasswordInput = document.getElementById('new-password');
const deleteUsernameInput = document.getElementById('delete-username');
const deletePasswordInput = document.getElementById('delete-password');

// بيانات الحسابات
let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

// عرض واجهة البداية
function showStartScreen() {
  startScreen.style.display = 'block';
  gameScreen.style.display = 'none';
  createAccountScreen.style.display = 'none';
  deleteAccountScreen.style.display = 'none';
}

// عرض واجهة اللعبة
function showGameScreen() {
  startScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  createAccountScreen.style.display = 'none';
  deleteAccountScreen.style.display = 'none';
}

// عرض واجهة إنشاء الحساب
function showCreateAccountScreen() {
  startScreen.style.display = 'none';
  gameScreen.style.display = 'none';
  createAccountScreen.style.display = 'block';
  deleteAccountScreen.style.display = 'none';
}

// عرض واجهة حذف الحساب
function showDeleteAccountScreen() {
  startScreen.style.display = 'none';
  gameScreen.style.display = 'none';
  createAccountScreen.style.display = 'none';
  deleteAccountScreen.style.display = 'block';
}

// إنشاء حساب جديد
function createAccount(username, password) {
  const account = { username, password };
  accounts.push(account);
  localStorage.setItem('accounts', JSON.stringify(accounts));
  alert('تم إنشاء الحساب بنجاح!');
}

// حذف حساب
function deleteAccount(username, password) {
  accounts = accounts.filter(account => account.username !== username || account.password !== password);
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
  showCreateAccountScreen();
});

deleteAccountBtn.addEventListener('click', () => {
  showDeleteAccountScreen();
});

backToStartBtn.addEventListener('click', () => {
  showStartScreen();
});

submitCreateAccountBtn.addEventListener('click', () => {
  const username = newUsernameInput.value;
  const password = newPasswordInput.value;
  if (username && password) {
    createAccount(username, password);
    showStartScreen();
  } else {
    alert('يرجى ملء جميع الحقول!');
  }
});

cancelCreateAccountBtn.addEventListener('click', () => {
  showStartScreen();
});

submitDeleteAccountBtn.addEventListener('click', () => {
  const username = deleteUsernameInput.value;
  const password = deletePasswordInput.value;
  if (username && password) {
    deleteAccount(username, password);
    showStartScreen();
  } else {
    alert('يرجى ملء جميع الحقول!');
  }
});

cancelDeleteAccountBtn.addEventListener('click', () => {
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
