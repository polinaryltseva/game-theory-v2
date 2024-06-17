// Создаем начальную доску размером 3x3
generateBoard(3, 3);

// Устанавливаем обработчики событий для кнопок и полей ввода
setupEventListeners();

// Функция для отобржения доски (матрицы)
function generateBoard(rows, columns) {
  const board = document.getElementById("board"); // Получаем элемент с id "board"

  board.innerHTML = ""; // Очищаем содержимое элемента

  // Устанавливаем стиль для сетки, определяя количество строк и столбцов
  board.style.gridTemplateRows = `repeat(${rows}, 1fr`;
  board.style.gridTemplateColumns = `repeat(${columns}, 1fr`;

  for (let row = 0; row < rows; row++) {
    // Цикл по строкам
    for (let column = 0; column < columns; column++) {
      // Цикл по столбцам
      const field = document.createElement("div"); // Создаем новый элемент "div"

      // Задаем id для элемента "div"
      field.id = `${row}-${column}`;

      // Задаем класс для элемента "div", чередуя светлое и темное поле
      field.className = `field ${(row + column) % 2 === 0 ? "light-field" : "dark-field"}`;

      // Добавляем специфические классы для угловых полей
      if (row === 0 && column === 0) field.classList.add("top-left");
      if (row === 0 && column === columns - 1) field.classList.add("top-right");
      if (row === rows - 1 && column === 0) field.classList.add("bottom-left");
      if (row === rows - 1 && column === columns - 1) field.classList.add("bottom-right");

      const firstInput = document.createElement("input"); // Создаем первый input элемент
      firstInput.type = "text"; // Устанавливаем тип input
      firstInput.className = "field-input"; // Устанавливаем класс для input

      const secondInput = document.createElement("input"); // Создаем второй input элемент
      secondInput.type = "text"; // Устанавливаем тип input
      secondInput.className = "field-input"; // Устанавливаем класс для input

      // Добавляем input элементы в div
      field.appendChild(firstInput);
      field.appendChild(secondInput);

      // Добавляем div элемент в основную доску
      board.appendChild(field);
    }
  }
}

function setupEventListeners() {
  // Добавляем обработчик события для кнопки "Решить матрицу"
  document.querySelector("#solve-matrix-button").addEventListener("click", solveMatrix);

  // Добавляем обработчик события для кнопки "Создать матрицу"
  document.querySelector("#create-matrix-button").addEventListener("click", createMatrix);
}

function solveMatrix() {
  // Получаем ссылку на игровое поле
  const board = document.getElementById("board");
  // Получаем ссылки на все поля на игровом поле
  const fields = board.querySelectorAll(".field");

  // Получаем ссылки на поля ввода для числа строк и столбцов
  const [rowsInput, columnsInput] = document.querySelectorAll(".dimension-input");

  // Проверяем, что число строк и столбцов одинаково
  if (rowsInput.value !== columnsInput.value) return;

  // Преобразуем введенное значение в число
  const size = parseInt(rowsInput.value);

  // Создаем пустую матрицу заданного размера
  const matrix = Array.from({ length: size }, () => []);

  // Заполняем матрицу данными из полей ввода
  fields.forEach((field, index) => {
    // Получаем ссылки на поля ввода в каждой ячейке
    const inputs = field.querySelectorAll(".field-input");

    // Преобразуем введенные значения в числа
    const firstNumber = parseInt(inputs[0].value);
    const secondNumber = parseInt(inputs[1].value);

    // Получаем нужную строку для матрицы
    const row = field.id.split("-")[0];

    // Добавляем числа в матрицу
    matrix[row].push([firstNumber, secondNumber]);
  });

  // Создаем объект решателя
  const solver = new Solver(matrix);

  // Находим точку равновесия Нэша
  const coordinates = solver.findNashEquilibrium();

  // Выделяем поля, соответствующие точке равновесия Нэша
  highlightFields(coordinates);
}

function highlightFields(coordinates) {
  // Выделяем поля, заданные координатами
  coordinates.forEach(([row, column]) => {
    // Получаем ссылку на поле по координатам
    const field = document.getElementById(`${row}-${column}`);

    // Добавляем класс "highlight" для выделения
    field.classList.add("highlight");
  });
}

function createMatrix() {
  // Получаем ссылки на поля ввода для числа строк и столбцов
  const [rowsInput, columnsInput] = document.querySelectorAll(".dimension-input");

  // Проверяем, что число строк и столбцов одинаково
  if (rowsInput.value !== columnsInput.value) return;

  // Преобразуем введенное значение в число
  const size = parseInt(rowsInput.value);

  // Генерируем игровое поле заданного размера
  generateBoard(size, size);
}
