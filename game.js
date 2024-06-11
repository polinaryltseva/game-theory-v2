//console.log("game.js loaded successfully!");

class Game {
  constructor() {
    this.maxMoves = 6; //параметр, определяющий максимальное количество ходов
    this.matrix = this.genRandomMatrix(); //вызывает функцию, которая генерирует матрицу игры

    this.scores = { player: 0, bot: 0 }; 
    this.history = { player: [], bot: [] };

    this.strategies = {
      random: this.randomStrategy.bind(this),
      "always defect": this.alwaysDefectStrategy.bind(this),
      "always cooperate": this.alwaysCooperateStrategy.bind(this),
      grudger: this.grudgerStrategy.bind(this),
      copycat: this.copycatStrategy.bind(this),
      forgiver: this.forgiverStrategy.bind(this),
      tester: this.testerStrategy.bind(this),
    }; // с помощью bind привязываем констекст при вызове функций, реализующих стратегии

    this.botStrategy = this.chooseRandomStrategy(this.strategies); //рандомизированно выбираем стратегию бота для раунда 
    this.finished = false; //переменная, показывающая статус раунда
  }

  genRandomMatrix() {
    /*
      Матрица игры размера 2Х2
    */
    const getRandomValue = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    const R = getRandomValue(1, 5);
    const T = getRandomValue(R + 1, 15); // T > R
    const P = getRandomValue(-R + 1, R - 1); // P < R
    const S = getRandomValue(-P + 1, P - 1); // S < P

    return {
      "cooperate-cooperate": [R, R],
      "cooperate-defect": [S, T],
      "defect-cooperate": [T, S],
      "defect-defect": [P, P],
    };
  }

   /*
   Стратегии бота 
  */
  randomStrategy() { 
    return Math.random() < 0.5 ? "cooperate" : "defect"; //Рандом - рандомизированно выбирает кооперацию или предательство
  }

  alwaysDefectStrategy() {
    return "defect"; //Предатель - всегда предает 
  }

  alwaysCooperateStrategy() {
    return "cooperate"; //Всегда кооперирует
  }

  grudgerStrategy() {
    return this.history.player.includes("defect") ? "defect" : "cooperate"; //Кооперирует до первого предательства, после - всегда предает 
  }

  copycatStrategy() {
    //return this.history.player.length === 0 ? "cooperate" : this.history.player[this.history.player.length - 1]; 
    return this.history.player[this.history.player.length - 1]; 
    //Копирует поведение игрока (игрок всегда ходит первым)
  }

  forgiverStrategy() {
    const lastTwoMoves = this.history.player.slice(-2);
    return lastTwoMoves.includes("defect") ? "defect" : "cooperate"; //Кооперирует до первого предательства, но если после 
    //одного предательства игрок начинает кооперировать - прощает его и возвращается к кооперации
  }

  testerStrategy() {
    if (this.history.bot.length === 0) return "cooperate";
    const defectCount = this.history.bot.filter(
      (move) => move === "defect",
    ).length;
    const defectThreshold = Math.floor(this.history.bot.length / 5);

    if (defectCount < defectThreshold) return "defect"; //Кооперирует на первом ходе, далее копирует игрока, при этом один раз 
    //за раунд должен предать 

    return this.history.player[this.history.player.length - 1];
  }

  chooseRandomStrategy(strategies) {
    //Метод, выбирающий рандомизированно стратегию для бота в каждом раунде
    const strategyKeys = Object.keys(strategies);
    const randomIndex = Math.floor(Math.random() * strategyKeys.length);
    return strategyKeys[randomIndex];
  }

  makePlayerMove(playerMove) {
    //При ходе игрока, определяем ход бота и обновляем score

    if (!this.isMovesLeft() || this.isFinished()) return;

    const botMove = this.strategies[this.botStrategy]();
    const moveKey = `${playerMove}-${botMove}`;  
    const [playerScore, botScore] = this.matrix[moveKey];

    this.scores.player += playerScore;
    this.scores.bot += botScore;

    this.history.player.push(playerMove);
    this.history.bot.push(botMove);
  }

  guessStrategy(strategy) {
    //При вызове метода игра завершается и игрок угадывает стратегию
    if (this.isFinished()) return;
    this.finished = true;
    return this.botStrategy === strategy;
  }

  getBotStrategy() {
    //Получаем настоящую стратегию бота, по которой он играл раунд
    if (!this.isFinished()) return;
    return this.botStrategy;
  }

  isMovesLeft() {
    //Проверка на максимальное число ходов 
    return this.history.player.length < this.maxMoves;
  }

  isFinished() {
    //Возвращает параметр завершенности игры
    return this.finished;
  }
}
