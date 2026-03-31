document.addEventListener("DOMContentLoaded", function () {
  // Элементы DOM
  const vipCheckbox = document.getElementById("vipCheckbox");
  const x2Checkbox = document.getElementById("x2Checkbox");
  const totalDisplay = document.getElementById("totalDisplay");
  const remainingDisplay = document.getElementById("remainingDisplay");
  const resetBtn = document.getElementById("resetBtn");
  const checkboxes = document.querySelectorAll('.tasks-column input[type="checkbox"]');
  const themeToggle = document.getElementById("themeToggle");

  // Проверка существования всех ключевых элементов
  if (!vipCheckbox || !x2Checkbox || !totalDisplay || !remainingDisplay || !resetBtn || !themeToggle) {
    console.error("Не все элементы DOM найдены");
    return;
  }

  const savedTheme = localStorage.getItem("theme") || "light";

  // Функция расчёта награды
  function calculateReward(rewardCell) {
    const base = parseInt(rewardCell.getAttribute("data-without")) || 0;
    const vipValue = parseInt(rewardCell.getAttribute("data-with")) || 0;
    let reward = vipCheckbox.checked ? vipValue : base;
    if (x2Checkbox.checked) reward *= 2;
    return reward;
  }

  // Функция обновления наград в таблице
  function updateRewards() {
    document.querySelectorAll(".reward").forEach((cell) => {
      const reward = calculateReward(cell);
      cell.textContent = reward + " BP";
    });
  }

  // Функция подсчёта общего количества BP и прогресса
  function updateTotal() {
    let total = 0;
    let remaining = 0;
    let checkedCount = 0; // Количество отмеченных чекбоксов
    const totalCheckboxes = checkboxes.length; // Общее количество чекбоксов
  
    // Подсчёт выполненных и оставшихся заданий за один проход
    checkboxes.forEach((checkbox) => {
      const rewardCell = checkbox.closest("tr").querySelector(".reward");
      const reward = calculateReward(rewardCell);
  
      if (checkbox.checked) {
        total += reward;
        checkedCount++;
      } else {
        remaining += reward;
      }
    });
  
    totalDisplay.textContent = total + " BP";
    remainingDisplay.textContent = remaining + " BP";
  
    // Безопасный расчёт прогресса
    let progressPercent = 0;
    if (totalCheckboxes > 0) {
      progressPercent = Math.min((checkedCount / totalCheckboxes) * 100, 100);
    } else {
      console.warn("Нет чекбоксов для расчёта прогресса.");
    }
  
    const progressFill = document.getElementById("progressFill");
    const progressPercentElement = document.getElementById("progressPercent");
  
    if (progressFill && progressPercentElement) {
      // Устанавливаем ширину прогресс‑бара
      progressFill.style.width = progressPercent + "%";
      progressPercentElement.textContent = Math.round(progressPercent) + "%";
  
      // Обновление цвета прогресс‑бара
      
    if (progressPercent >= 80) {
      progressFill.style.background = "#f3bc07";
    } else {
      progressFill.style.background = "linear-gradient(90deg, #f3bc07, #d4a006)";
    }
    } else {
      console.error("Элементы прогресс‑бара не найдены. Проверьте HTML.");
    }
  }
  

  // Функция обновления отображения
  function updateDisplay() {
    updateRewards();
    updateTotal();
  }

  // Обработчики изменений
  vipCheckbox.addEventListener("change", updateDisplay);
  x2Checkbox.addEventListener("change", updateDisplay);

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const row = this.closest("tr");
      if (this.checked) {
        row.classList.add("done");
      } else {
        row.classList.remove("done");
      }
      updateTotal();
    });
  });

  // Обработчик сброса
  resetBtn.addEventListener("click", function () {
    // Сбрасываем обычные задания — имитируем ручное снятие галочки
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
      const changeEvent = new Event("change");
      checkbox.dispatchEvent(changeEvent);
    });
  
    // Сбрасываем счётчики лотереи и их кнопки
    document.querySelectorAll(".lottery-controls").forEach((counter) => {
      const display = counter.querySelector(".quantity-display");
      const upBtn = counter.querySelector(".up-arrow");
      const downBtn = counter.querySelector(".down-arrow");
      const checkbox = counter
        .closest("tr")
        .querySelector('input[type="checkbox"]');
      const row = counter.closest("tr");
      const target = parseInt(counter.getAttribute("data-target")) || 0;
  
      // Устанавливаем счётчик в 0
      display.textContent = "0";
  
      // Имитируем ручное снятие галочки с чекбокса лотереи
      checkbox.checked = false;
      const changeEvent = new Event("change");
      checkbox.dispatchEvent(changeEvent);
  
      // Возвращаем кнопки в исходное состояние через updateButtonStates
      function updateButtonStates() {
        const current = parseInt(display.textContent) || 0;
  
        // Кнопка «вниз» должна быть заблокирована при 0
        if (current === 0) {
          downBtn.classList.add("disabled");
          downBtn.disabled = true;
        } else {
          downBtn.classList.remove("disabled");
          downBtn.disabled = false;
        }
  
        // Кнопка «вверх» разблокирована, если не достигли цели
        if (current === target) {
          upBtn.classList.add("disabled");
          upBtn.disabled = true;
        } else {
          upBtn.classList.remove("disabled");
          upBtn.disabled = false;
        }
      }
  
      updateButtonStates();
    });
  
    // Обновляем общее отображение после сброса всех элементов
    updateDisplay();
  });

  // Обработчики для счётчиков лотереи
  document.querySelectorAll(".lottery-controls").forEach((counter) => {
    const upBtn = counter.querySelector(".up-arrow");
    const downBtn = counter.querySelector(".down-arrow");
    const display = counter.querySelector(".quantity-display");
    const target = parseInt(counter.getAttribute("data-target")) || 0;
    const checkbox = counter
      .closest("tr")
      .querySelector('input[type="checkbox"]');
    const row = counter.closest("tr"); // Сохраняем ссылку на строку

    // Функция обновления состояния кнопок
    function updateButtonStates() {
      const current = parseInt(display.textContent) || 0;

      // Деактивируем кнопку «вниз» при 0
      if (current === 0) {
        downBtn.classList.add("disabled");
        downBtn.disabled = true;
        // Устанавливаем стиль для невыполненной лотереи
        row.classList.remove("completed");
        row.style.backgroundColor = ""; // или конкретный цвет для невыполненной
      } else {
        downBtn.classList.remove("disabled");
        downBtn.disabled = false;
      }

      // Деактивируем кнопку «вверх» при достижении цели
      if (current === target) {
        upBtn.classList.add("disabled");
        upBtn.disabled = true;
        // Активируем чекбокс и отмечаем строку как завершённую
        checkbox.checked = true;
        row.classList.add("completed");
      } else {
        upBtn.classList.remove("disabled");
        upBtn.disabled = false;
        checkbox.checked = false;
      }
    }

    // Инициализация состояния кнопок при загрузке
    updateButtonStates();

    upBtn.addEventListener("click", function () {
      let current = parseInt(display.textContent) || 0;
      if (current < target) {
        display.textContent = current + 1;
        updateButtonStates(); // Обновляем состояние кнопок после изменения
        updateTotal();
      }
    });

    downBtn.addEventListener("click", function () {
      let current = parseInt(display.textContent) || 0;
      if (current > 0) {
        display.textContent = current - 1;
        updateButtonStates(); // Обновляем состояние кнопок после изменения
        updateTotal();
      }
    });

    // Обработчик для ручного клика по чекбоксу
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        // ЕСЛИ ПОЛЬЗОВАТЕЛЬ РУЧНО ПОСТАВИЛ ГАЛОЧКУ, УСТАНАВЛИВАЕМ СЧЁТЧИК В ЦЕЛЕВОЕ ЗНАЧЕНИЕ
        display.textContent = target;
        row.classList.add("completed");
    
        // Блокируем ОБЕ кнопки
        upBtn.classList.add("disabled");
        downBtn.classList.add("disabled");
        upBtn.disabled = true;
        downBtn.disabled = true;
      } else {
        // Если пользователь снял галочку, сбрасываем счётчик
        display.textContent = "0";
        row.classList.remove("completed");
        row.style.backgroundColor = ""; // сбрасываем цвет для невыполненной
    
        // Разблокируем ОБЕ кнопки и обновляем их состояние
        upBtn.classList.remove("disabled");
        downBtn.classList.remove("disabled");
        upBtn.disabled = false;
        downBtn.disabled = false;
      }
    
      // Обязательно вызываем updateButtonStates() для синхронизации состояния кнопок
      updateButtonStates();
      updateTotal();
    });
  });

  // Функция для установки темы
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Обновляем текст кнопки в зависимости от текущей темы
    if (theme === "dark") {
      themeToggle.textContent = " "; // Солнце для тёмной темы
    } else {
      themeToggle.textContent = " "; // Луна для светлой темы
    }
  }

  // Инициализация темы при загрузке
  setTheme(savedTheme);

  // Обработчик переключения темы
  themeToggle.addEventListener("click", function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  });

  // Первоначальное обновление отображения
  updateDisplay();
});
