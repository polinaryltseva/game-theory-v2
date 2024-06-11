console.log("main.js loaded successfully!");

const game = new Game();

console.log("init game:", game);

initBoard(game.matrix); //Инициализация доски при начале игры
initStrategyMenu(game); //Инициализация меню, которое открывается при выборе стретегии

const cooperateBtn = document.querySelector("#cooperate-btn"); 
cooperateBtn.addEventListener("click", cooperate(game)); 

const defectBtn = document.querySelector("#defect-btn");
defectBtn.addEventListener("click", defect(game));

const guessBtn = document.querySelector("#guess-btn");
guessBtn.addEventListener("click", showStrategyMenu(game));

const closeGuessBtn = document.querySelector("#close-guess-btn");
closeGuessBtn.addEventListener("click", hideStrategyMenu);

const tryAgainBtn = document.querySelector("#try-again-btn");
tryAgainBtn.addEventListener("click", restartGame);


function initBoard(matrix) {
  const board = document.querySelector("#board");
  const fields = board.querySelectorAll(".field"); //выделяем все элементы из .field

  Object.keys(matrix).forEach((key, index) => {
    const playerScore = document.createElement("span");
    const botScore = document.createElement("span");

    //установка значений в матрице 
    playerScore.innerText = matrix[key][0];
    botScore.innerText = matrix[key][1];

    fields[index].appendChild(playerScore); 
    fields[index].appendChild(botScore);
  });
}

function initStrategyMenu(game) {
  // Инициализация изначально скрытого меню, в котором отображены стратегии (появляется при нажатии на guess strategy btn)
  const strategyMenu = document.querySelector("#strategy-menu");

  for (let key in game.strategies) {
    //динамическое создание объектов скрытого меню, в которых отображается название стратегии при выборе
    const strategy = document.createElement("div");
    const circle = document.createElement("div");
    const span = document.createElement("span");

    strategy.id = key;
    span.innerText = key;
    
    strategy.classList.add("strategy");
    circle.classList.add("circle");

    strategy.appendChild(circle);
    strategy.appendChild(span);
    strategy.addEventListener("click", selectStrategy(game));

    strategyMenu.appendChild(strategy);
  }
}

function selectStrategy(game) {
  /*
     Проверка правильности выбранного игроком ответа и вызов функции, отображющей результат 
    */
  return (event) => {
    hideStrategyMenu();

    const strategyIndicator = document.querySelector("#strategy-indicator");
    const correctStrategy = document.querySelector("#correct-strategy");

    const strategyID = event.currentTarget.id;

    const correct = game.guessStrategy(strategyID);

    strategyIndicator.innerText = correct ? "correct 🙂" : "incorrect 🙁";
    correctStrategy.innerText = game.getBotStrategy();

    showStrategyResult();
  };
}

function showStrategyResult() {
  //Окно, отображающее результат угадывания стратегии (отображается только после окна выбора и клика на один из вариантов)
  const strategyResult = document.querySelector("#strategy-result");
  strategyResult.classList.add("show");
}

function cooperate(game) {
  /*
    Обработка одного из двух возможный действий игрока, которые происходят в момент клика на + 
    */
  return () => {
    if (!game.isMovesLeft()) showGuessMsg();
    if (game.isFinished()) return;

    game.makePlayerMove("cooperate");
    updateScores(game.scores);
  };
}

function defect(game) {
  /*
    Обработка одного из двух возможный действий игрока, которые происходят в момент клика на -
    */
  return () => {
    if (!game.isMovesLeft()) showGuessMsg();
    if (game.isFinished()) return;

    game.makePlayerMove("defect");
    updateScores(game.scores);
  };
}

function showGuessMsg() {
  /*
    Отображает сообщение о выборе стратегии при достижении максимального числа ходов
    */
  const guessMsg = document.querySelector("#guess-msg");
  guessMsg.classList.add("show");
}

function updateScores(scores) {
  //Обновление счета игрока и бота после каждого хода
  document.querySelector("#player-score").innerHTML = scores.player;
  document.querySelector("#bot-score").innerHTML = scores.bot;
}

function showStrategyMenu(game) {
    /*
    Отображает меню со стратегиями при клике на guess the strategy
    */
  return () => {
    if (game.isFinished()) return;

    const strategyMenu = document.getElementById("strategy-menu");
    strategyMenu.classList.add("show");
  };
}

function hideStrategyMenu() {
  /*
   Скрывает меню со стратегиями после выбора ответа игроком
    */
  const strategyMenu = document.getElementById("strategy-menu");
  strategyMenu.classList.remove("show");
}

function restartGame() {
  location.reload();
}
