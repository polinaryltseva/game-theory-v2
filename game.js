// Создаем экземпляр игры
var game = new Game();

// Прокручиваем описание игры вверх
scrollTutorialTop()

// Добавляем очки на игровое поле
addScores(game.getMatrix());

// Добавляем стратегии в меню
addStrategies(game);

// Устанавливаем обработчики событий для кнопок
setupEventListeners();

// Функция для прокрутки описания игры
function scrollTutorialTop() {
  // Получаем описание игры
  const tutorial = document.getElementById("tutorial");
  // Прокручиваем описание игры вверх
  tutorial.scrollTo(0, 0);
}

function setupEventListeners() {
  // Обработчик кнопки "Сотрудничать"
  document.querySelector("#cooperate-button").addEventListener("click", makeMoveCooperate);

  // Обработчик кнопки "Предать"
  document.querySelector("#defect-button").addEventListener("click", makeMoveDefect);

  // Обработчик кнопки "Получить историю"
  document.querySelector("#get-history-button").addEventListener("click", getHistory);

  // Обработчик кнопки "Закрыть историю"
  document.querySelector("#close-history-button").addEventListener("click", hideHistory);

  // Обработчик кнопки "Угадать стратегию"
  document.querySelector("#guess-strategy-button").addEventListener("click", showStrategyMenu);

  // Обработчик кнопки "Закрыть меню"
  document.querySelector("#close-menu-button").addEventListener("click", hideStrategyMenu);

  // Обработчик кнопки "Попробовать снова"
  document.querySelector("#retry-button").addEventListener("click", restartGame);
}

// Функция добавления очков на игровое поле
function addScores(matrix) {
  const board = document.querySelector("#board");
  const fields = board.querySelectorAll(".field");

  // Проходим по каждому ключу в матрице
  Object.keys(matrix).forEach((key, index) => {
    // Создаем элементы для очков игрока и бота
    const playerScore = createScoreElement(matrix[key][0]);
    const botScore = createScoreElement(matrix[key][1]);

    // Добавляем элементы очков в соответствующие поля
    fields[index].appendChild(playerScore);
    fields[index].appendChild(botScore);
  });
}

// Утилитарная функция для создания элемента очков
function createScoreElement(score) {
  const scoreElement = document.createElement("span");
  scoreElement.innerText = score;
  return scoreElement;
}

// Функция добавления стратегий в меню
function addStrategies(game) {
  const strategyMenu = document.querySelector("#strategy-menu");

  // Проходим по каждому имени стратегии
  game.getStrategyNames().forEach((name) => {
    // Создаем элементы для стратегии
    const strategy = createStrategyElement(name, game);
    strategyMenu.appendChild(strategy);
  });
}

// Утилитарная функция для создания элемента стратегии
function createStrategyElement(name, game) {
  const strategy = document.createElement("div");
  const circle = document.createElement("div");
  const span = document.createElement("span");

  strategy.id = name; // Устанавливаем ID элемента стратегии
  span.innerText = name; // Устанавливаем текст с именем стратегии

  strategy.classList.add("strategy"); // Добавляем CSS-класс для стратегии
  circle.classList.add("strategy-circle"); // Добавляем CSS-класс для кружка

  // Собираем элементы стратегии
  strategy.appendChild(circle);
  strategy.appendChild(span);

  // Добавляем обработчик события для клика на стратегию
  strategy.addEventListener("click", guessStrategy(game));
  return strategy;
}

// Функция скрытия истории
function hideHistory() {
  document.querySelector("#history").classList.remove("show");
}

// Функция для показа истории
function showHistory() {
  document.querySelector("#history").classList.add("show");
}

function getHistory() {
  // Получаем ссылку на элемент таблицы с id "history-table"
  const historyTable = document.querySelector("#history-table");

  // Очищаем содержимое таблицы
  historyTable.innerHTML = "";

  // Создаем строку заголовка таблицы
  const headerRow = historyTable.insertRow();

  // Создаем ячейки заголовка
  const playerHeader = headerRow.insertCell();
  const botHeader = headerRow.insertCell();

  // Устанавливаем текст заголовков
  playerHeader.textContent = "player";
  botHeader.textContent = "bot";

  // Проходим по истории игры, добавляя строки в таблицу
  for (let i = 0; i < game.getHistory().player.length; i++) {
    // Создаем строку таблицы
    const row = historyTable.insertRow();

    // Создаем ячейки данных
    const playerCell = row.insertCell();
    const botCell = row.insertCell();

    // Устанавливаем текст ячеек данных
    playerCell.textContent = game.getHistory().player[i];
    botCell.textContent = game.getHistory().bot[i];
  }

  // Показываем таблицу с историей игры
  showHistory();
}

// Функция для угадывания стратегии
function guessStrategy(game) {
  return (event) => {
    hideStrategyMenu(); // Скрываем меню стратегий

    // Получаем элементы индикатора результата и правильной стратегии
    const strategyIndicator = document.querySelector("#result-indicator");
    const correctStrategy = document.querySelector("#correct-strategy");

    // Проверяем, угадана ли стратегия
    const isCorrect = game.guessStrategy(event.currentTarget.id);
    strategyIndicator.innerText = isCorrect ? "correct 🙂" : "incorrect 🙁"; // Устанавливаем текст результата
    correctStrategy.innerText = game.getCorrectStrategy(); // Показываем правильную стратегию

    showGameResult(); // Показываем результат игры
  };
}

// Функция для показа результата игры
function showGameResult() {
  document.querySelector("#game-result").classList.add("show"); // Добавляем CSS-класс для показа результата
}

// Функция для выполнения хода "Сотрудничать"
function makeMoveCooperate() {
  makeMove("cooperate");
}

// Функция для выполнения хода "Предать"
function makeMoveDefect() {
  makeMove("defect");
}

// Общая функция для выполнения хода
function makeMove(move) {
  // Проверяем, завершена ли игра или закончились ли ходы
  if (game.isGameFinished() || !game.isMovesLeft()) {
    if (!game.isMovesLeft()) {
      document.querySelector("#guess-message").classList.add("show"); // Показываем сообщение о необходимости угадать стратегию
    }
    return;
  }

  game.makeMove(move); // Делаем ход
  updateScores(game.getScores()); // Обновляем очки
  highlightMoveField(game.getLastPlayerBotMoves()); // Выделяем поле соответствующего хода
}

// Функция обновления очков на экране
function updateScores(scores) {
  // Обновляем текстовые значения для очков игрока и бота
  document.querySelector("#player-score-value").innerText = scores.player;
  document.querySelector("#bot-score-value").innerText = scores.bot;
}

// Функция выделения поля, соответствующего последнему ходу
function highlightMoveField([playerMove, botMove]) {
  const fieldIndexMap = {
    "cooperate-cooperate": 0,
    "cooperate-defect": 1,
    "defect-cooperate": 2,
    "defect-defect": 3,
  };
  const fieldIndex = fieldIndexMap[`${playerMove}-${botMove}`]; // Определяем индекс поля
  const fields = document.querySelectorAll(".field");

  // Удаляем класс "highlight" у предыдущего активного поля, если он есть
  document.querySelector(".field.highlight")?.classList.remove("highlight");
  fields[fieldIndex].classList.add("highlight"); // Добавляем класс "highlight" к текущему полю
}

// Функция для показа меню стратегий
function showStrategyMenu() {
  if (!game.isGameFinished()) { // Проверяем, завершена ли игра
    document.querySelector("#strategy-menu").classList.add("show"); // Показываем меню стратегий
  }
}

// Функция для скрытия меню стратегий
function hideStrategyMenu() {
  document.querySelector("#strategy-menu").classList.remove("show"); // Скрываем меню стратегий
}

// Функция для перезапуска игры
function restartGame() {
  window.location.hash = "#menu"; // Перенаправляем на страницу меню
}
