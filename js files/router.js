// Определяем маршруты для страниц
const routes = {
  menu: "pages/menu.html",
  game: "pages/game.html",
  solver: "pages/solver.html",
};

// Определяем стили для страниц
const styles = {
  menu: "css/menu.css",
  game: "css/game.css",
  solver: "css/solver.css",
};

// Определяем скрипты для страниц
const scripts = {
  menu: "js/menu.js",
  game: "js/game.js",
  solver: "js/solver.js",
};

// Асинхронная функция для обработки изменения хэша в URL
async function handleHash() {
  // Получаем текущий хэш из URL и удаляем символ #
  let hash = window.location.hash.replace("#", "");

  // Если хэш пустой, перенаправляем на страницу меню
  if (hash.length === 0) {
    document.location.hash = "menu";
  }

  // Получаем путь к странице на основе хэша
  const route = routes[hash];
  // Получаем путь к стилю на основе хэша
  const style = styles[hash];
  // Получаем путь к скрипту на основе хэша
  const script = scripts[hash];

  // Находим и удаляем предыдущий стиль, если он существует
  const pageStyle = document.getElementById("page-style");
  if (pageStyle) {
    pageStyle.remove();
  }

  // Находим и удаляем предыдущий скрипт, если он существует
  const pageScript = document.getElementById("page-script");
  if (pageScript) {
    pageScript.remove();
  }

  // Создаем новый элемент <link> для стиля
  const linkElement = document.createElement("link");

  // Устанавливаем атрибуты для элемента <link>
  linkElement.id = "page-style";
  linkElement.rel = "stylesheet";
  linkElement.href = style;

  // Создаем новый элемент <script> для скрипта
  let pageScriptElement = document.createElement("script");

  // Устанавливаем атрибуты для элемента <script>
  pageScriptElement.id = "page-script";
  pageScriptElement.src = script;

  // Находим корневой элемент для вставки содержимого страницы
  const root = document.getElementById("root");

  // Загружаем содержимое страницы и вставляем его в корневой элемент
  root.innerHTML = await fetch(route).then((data) => data.text());

  // Добавляем новый стиль к элементу <head>
  document.head.appendChild(linkElement);
  // Добавляем новый скрипт к элементу <body>
  document.body.appendChild(pageScriptElement);

  // Если хэш равен "game", подключаем MathJax для отображения формул
  if (hash === "game") {
    MathJax.typeset()
  }
}

// Добавляем обработчик события изменения хэша в URL
window.addEventListener("hashchange", handleHash);
// Добавляем обработчик события загрузки страницы
window.addEventListener("load", handleHash);
