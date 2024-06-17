class Game {
  #matrix; // Приватное поле для хранения матрицы выигрышей
  #strategies; // Приватное поле для хранения доступных стратегий
  #strategy; // Приватное поле, представляющее текущую стратегию
  #scores; // Приватное поле для отслеживания счета игрока и бота
  #history; // Приватное поле для записи истории ходов
  #maxMoves; // Приватное поле, указывающее максимальное количество ходов
  #isGameFinished; // Приватное поле, указывающее завершена ли игра

  constructor(maxMoves = 6, maxScore = 15) {
    // Инициализация игры случайной матрицей выигрышей и стратегий
    this.#matrix = this.#generateRandomMatrix(maxScore);
    this.#strategies = this.#getStrategies();
    this.#strategy = this.#getRandomStrategy(this.#strategies);

    // Инициализация счета и истории ходов
    this.#scores = { player: 0, bot: 0 };
    this.#history = { player: [], bot: [] };

    // Установка максимального количества ходов и начального состояния игры
    this.#maxMoves = maxMoves;
    this.#isGameFinished = false;
  }

  // Публичный метод для получения матрицы выигрышей
  getMatrix() {
    return Object.assign({}, this.#matrix);
  }

  // Публичный метод для получения списка стратегий
  getStrategyNames() {
    return this.#strategies.map(strategy => strategy.name);
  }

  // Публичный метод для получения текущих счетов
  getScores() {
    return Object.assign({}, this.#scores);
  }

  // Публичный метод для получения истории ходов
  getHistory() {
    return Object.assign({}, this.#history);
  }

  // Публичный метод для получения последнего хода игрока и бота
  getLastPlayerBotMoves() {
    // Проверяем, есть ли хотя бы один ход у игрока и у бота
    if (this.#history.player.length === 0 || this.#history.bot.length === 0) {
      return;
    }

    // Получаем последний ход игрока
    const playerMove = this.#history.player[this.#history.player.length - 1];
    // Получаем последний ход бота
    const botMove = this.#history.bot[this.#history.bot.length - 1];

    // Возвращаем массив с последними ходами игрока и бота
    return [playerMove, botMove];
  }

  // Публичный метод для получения максимального количества ходов
  getMaxMoves() {
    return this.#maxMoves;
  }

  // Метод для выполнения хода игрока
  makeMove(playerMove) {
    if (!this.#isMovesLeft() || this.#isGameFinished) return;

    // Бот делает ход согласно текущей стратегии
    const botMove = this.#strategy.makeMove();
    // Формирование ключа для матрицы
    const moveKey = `${playerMove}-${botMove}`;
    // Получение выигрыша/потери от хода игрока и бота по текущей матрице выигрышей
    const [playerScore, botScore] = this.#matrix[moveKey];

    // Обновление счета игрока и бота
    this.#scores.player += playerScore;
    this.#scores.bot += botScore;

    // Запись хода игрока и бота в историю
    this.#history.player.push(playerMove);
    this.#history.bot.push(botMove);
  }

  // Публичный метод для угадывания текущей стратегии бота
  guessStrategy(strategy) {
    // Проверяем, завершена ли игра
    if (this.#isGameFinished) return;

    // Устанавливаем флаг завершения игры
    this.#isGameFinished = true;

    // Возвращаем результат сравнения заданной стратегии с текущей стратегией бота
    return strategy === this.#strategy.name;
  }

  // Публичный метод для получения названия текущей стратегии бота
  getCorrectStrategy() {
    return this.#isGameFinished ? this.#strategy.name : "";
  }

  // Публичный метод для проверки оставшихся ходов
  isMovesLeft() {
    return this.#isMovesLeft()
  }

  // Публичный метод для проверки завершена ли игра
  isGameFinished() {
    return this.#isGameFinished;
  }

  // Приватный метод для генерации случайной матрицы выигрышей
  #generateRandomMatrix(maxScore) {
    // Функция для получения случайного значения в заданном диапазоне
    const getRandomValue = (min, max) =>
      Math.floor(Math.random() * (max - min + 1) + min);

    // Генерация случайных значений для R, T, P, S согласно условиям
    const R = getRandomValue(1, maxScore);
    const T = getRandomValue(R + 1, maxScore);
    const P = getRandomValue(1, R - 1);
    const S = getRandomValue(1, P - 1);

    // Возвращение матрицы выигрышей с заданными значениями
    return {
      "cooperate-cooperate": [R, R],
      "cooperate-defect": [S, T],
      "defect-cooperate": [T, S],
      "defect-defect": [P, P],
    };
  }

  // Приватный метод для выбора случайной стратегии
  #getRandomStrategy(strategies) {
    // Выбор случайного индекса из списка стратегий
    const randomIndex = Math.floor(Math.random() * strategies.length);
    // Возврат случайной стратегии
    return strategies[randomIndex];
  }

  // Приватный метод для получения списка стратегий
  #getStrategies() {
    // Возвращение массива объектов с названиями и методами стратегий
    return [
      { name: "random", makeMove: this.#randomStrategy.bind(this) },
      { name: "always defect", makeMove: this.#alwaysDefectStrategy.bind(this) },
      { name: "always cooperate", makeMove: this.#alwaysCooperateStrategy.bind(this) },
      { name: "grudger", makeMove: this.#grudgerStrategy.bind(this) },
      { name: "copycat", makeMove: this.#copycatStrategy.bind(this) },
      { name: "forgiver", makeMove: this.#forgiverStrategy.bind(this) },
      { name: "tester", makeMove: this.#testerStrategy.bind(this) },
    ];
  }

  // Приватный метод для случайного выбора стратегии "cooperate" или "defect"
  #randomStrategy() {
    return Math.random() < 0.5 ? "cooperate" : "defect";
  }

  // Приватный метод для стратегии всегда "defect"
  #alwaysDefectStrategy() {
    return "defect";
  }

  // Приватный метод для стратегии всегда "cooperate"
  #alwaysCooperateStrategy() {
    return "cooperate";
  }

  // Приватный метод для стратегии "grudger"
  #grudgerStrategy() {
    // Если в истории игрока есть хотя бы один "defect", бот также выбирает "defect"
    return this.#history.player.includes("defect") ? "defect" : "cooperate";
  }

  // Приватный метод для стратегии "copycat"
  #copycatStrategy() {
    // Бот копирует последний ход игрока
    return this.#history.player.length === 0 ? "cooperate" : this.#history.player[this.#history.player.length - 1];
  }

  // Приватный метод для стратегии "forgiver"
  #forgiverStrategy() {
    // Если в последних двух ходах игрока был "defect", бот выбирает "defect"
    const lastTwoMoves = this.#history.player.slice(-2);
    return lastTwoMoves.includes("defect") ? "defect" : "cooperate";
  }

  // Приватный метод для стратегии "tester"
  #testerStrategy() {
    // Если бот еще не делал ходов, он всегда выбирает "cooperate"
    if (this.#history.bot.length === 0) return "cooperate";

    // Подсчет количества ходов "defect" бота
    const defectCount = this.#history.bot.filter((move) => move === "defect",).length;

    // Если бот ни разу не выбирал "defect" и случайное условие выполнено или это последний ход игры,
    // он выбирает "defect", он выбирает "defect"
    if (defectCount === 0) {
      const shouldDefect = Math.random() < 0.5 || this.#history.bot.length === this.#maxMoves - 1;

      if (shouldDefect) {
        return "defect";
      }

      // Иначе бот копирует последний ход игрока
      return this.#history.player[this.#history.player.length - 1];
    }

    // Если бот выбирал "defect" хотя бы раз, он копирует последний ход игрока
    return this.#history.player[this.#history.player.length - 1];
  }

  // Приватный метод для проверки оставшихся ходов
  #isMovesLeft() {
    return this.#history.player.length < this.#maxMoves;
  }
}

class Solver {
  #matrix; // Приватное поле для хранения матрицы
  #size; // Приватное поле для хранения размера матрицы

  constructor(matrix) {
    if (!this.#isSquareMatrix(matrix)) {
      // Проверка, является ли матрица квадратной
      throw new Error("The provided matrix is not square."); // Если нет, выбрасываем ошибку
    }
    this.#matrix = matrix; // Инициализация матрицы
    this.#size = matrix.length; // Установка размера матрицы
  }

  findNashEquilibrium() {
    // Нахождение лучших ходов для обоих игроков
    const { firstPlayerBestMoves, secondPlayerBestMoves } = this.#findPlayerBestMoves();

    const nashEquilibrium = []; // Массив для хранения равновесий Нэша

    // Поиск равновесий Нэша
    for (let row = 0; row < firstPlayerBestMoves.length; row++) {
      for (let column of firstPlayerBestMoves[row]) {
        if (secondPlayerBestMoves[column].includes(row)) {
          // Проверка наличия равновесия Нэша
          nashEquilibrium.push([row, column]); // Добавление равновесия Нэша в массив
        }
      }
    }

    return nashEquilibrium; // Возвращаем найденные равновесия Нэша
  }

  #findPlayerBestMoves() {
    const firstPlayerBestMoves = Array.from({ length: this.#size }, () => []); // Массив для хранения лучших ходов первого игрока
    const secondPlayerBestMoves = Array.from({ length: this.#size }, () => []); // Массив для хранения лучших ходов второго игрока

    // Нахождение лучших ходов для первого игрока
    for (let column = 0; column < this.#size; column++) {
      let maxFirstPlayerValue = -Infinity; // Инициализация максимального значения для первого игрока

      // Поиск максимального значения в текущем столбце для первого игрока
      for (let row = 0; row < this.#size; row++)
        if (this.#matrix[row][column][0] > maxFirstPlayerValue)
          maxFirstPlayerValue = this.#matrix[row][column][0];

      // Запись всех строк с максимальным значением для текущего столбца
      for (let row = 0; row < this.#size; row++)
        if (this.#matrix[row][column][0] === maxFirstPlayerValue)
          firstPlayerBestMoves[row].push(column);
    }

    // Нахождение лучших ходов для второго игрока
    for (let row = 0; row < this.#size; row++) {
      let maxSecondPlayerValue = -Infinity; // Инициализация максимального значения для второго игрока

      // Поиск максимального значения в текущей строке для второго игрока
      for (let column = 0; column < this.#size; column++)
        if (this.#matrix[row][column][1] > maxSecondPlayerValue)
          maxSecondPlayerValue = this.#matrix[row][column][1];

      // Запись всех столбцов с максимальным значением для текущей строки
      for (let column = 0; column < this.#size; column++)
        if (this.#matrix[row][column][1] === maxSecondPlayerValue)
          secondPlayerBestMoves[column].push(row);
    }

    // Возвращение наилучших ходов для обоих игроков
    return { firstPlayerBestMoves, secondPlayerBestMoves };
  }

  #isSquareMatrix(matrix) {
    if (!Array.isArray(matrix) || !Array.isArray(matrix[0]))
      // Проверка, что матрица является массивом массивов
      return false;
    // Проверка, что каждая строка имеет одинаковую длину, равную размеру матрицы
    return matrix.every((row) => Array.isArray(row) && row.length === matrix.length);
  }
}
