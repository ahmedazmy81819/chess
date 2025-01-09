body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.container {
  text-align: center;
}

#chessboard {
  display: grid;
  grid-template-columns: repeat(8, 60px);
  grid-template-rows: repeat(8, 60px);
  gap: 2px;
  margin: 20px auto;
}

.square {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  cursor: pointer;
}

.square.light {
  background-color: #f0d9b5;
}

.square.dark {
  background-color: #b58863;
}

#status {
  margin-top: 20px;
  font-size: 18px;
}
