document.addEventListener('DOMContentLoaded', function() {
  // Элементы DOM
const vipCheckbox = document.getElementById('vipCheckbox');
const x2Checkbox = document.getElementById('x2Checkbox');
const totalDisplay = document.getElementById('totalDisplay');
const remainingDisplay = document.getElementById('remainingDisplay');
const resetBtn = document.getElementById('resetBtn');
const checkboxes = document.querySelectorAll('.tasks-column input[type="checkbox"]');
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// Функция расчёта награды
function calculateReward(rewardCell) {
  const base = parseInt(rewardCell.getAttribute('data-without'));
  const vipValue = parseInt(rewardCell.getAttribute('data-with'));
  let reward = vipCheckbox.checked ? vipValue : base;
  if (x2Checkbox.checked) reward *= 2;
  return reward;
}

// Функция обновления наград в таблице
function updateRewards() {
  document.querySelectorAll('.reward').forEach(cell => {
    const reward = calculateReward(cell);
    cell.textContent = reward + ' BP';
  });
}

// Функция подсчёта общего количества BP и прогресса
function updateTotal() {
  let total = 0;
  let remaining = 0;
  let checkedCount = 0; // Количество отмеченных чекбоксов
  const totalCheckboxes = checkboxes.length; // Общее количество чекбоксов

  // Подсчёт выполненных заданий
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const rewardCell = checkbox.closest('tr').querySelector('.reward');
      const reward = calculateReward(rewardCell);
      total += reward;
      checkedCount++;
    }
  });

  // Подсчёт оставшихся заданий
  checkboxes.forEach(checkbox => {
    if (!checkbox.checked) {
      const rewardCell = checkbox.closest('tr').querySelector('.reward');
      const reward = calculateReward(rewardCell);
      remaining += reward;
    }
  });

  totalDisplay.textContent = total + ' BP';
  remainingDisplay.textContent = remaining + ' BP';

  // Расчёт прогресса по количеству отмеченных чекбоксов
  const progressPercent = Math.min((checkedCount / totalCheckboxes) * 100, 100);
  const progressFill = document.getElementById('progressFill');
  const progressPercentElement = document.getElementById('progressPercent');

  progressFill.style.width = progressPercent + '%';
  progressPercentElement.textContent = Math.round(progressPercent) + '%';

  // Обновление цвета прогресс‑бара
  if (progressPercent >= 80) {
    progressFill.style.background = '#f3bc07';
  } else {
    progressFill.style.background = 'linear-gradient(90deg, #f3bc07, #d4a006)';
  }
}

// Функция обновления отображения
function updateDisplay() {
  updateRewards();
  updateTotal();
}

// Обработчики изменений
vipCheckbox.addEventListener('change', updateDisplay);
x2Checkbox.addEventListener('change', updateDisplay);

checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    const row = this.closest('tr');
    if (this.checked) {
      row.classList.add('done');
    } else {
      row.classList.remove('done');
    }
    updateTotal();
  });
});

// обработчик для .task-item
  document.querySelectorAll('.task-item').forEach(item => {
    item.addEventListener('click', function(e) {
      // Находим связанный чекбокс через ближайшую строку таблицы
      const taskRow = this.closest('tr');
      const checkbox = taskRow.querySelector('.task-checkbox');

      // Переключаем состояние чекбокса
      checkbox.checked = !checkbox.checked;

      // Имитируем событие change для запуска существующей логики
      const changeEvent = new Event('change');
      checkbox.dispatchEvent(changeEvent);

      // Предотвращаем распространение события (чтобы не было двойного срабатывания)
      e.stopPropagation();
    });
  });

// Обработчик сброса
resetBtn.addEventListener('click', function() {
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
    checkbox.closest('tr').classList.remove('done');
  });

  // Сбрасываем счётчики лотереи
  document.querySelectorAll('.lottery-controls').forEach(counter => {
    counter.querySelector('.quantity-display').textContent = '0';
    counter.closest('tr').classList.remove('completed');

    // Активируем кнопки обратно, если они были отключены
    const upBtn = counter.querySelector('.up-arrow');
    const downBtn = counter.querySelector('.down-arrow');
    upBtn.classList.remove('disabled');
    downBtn.classList.remove('disabled');
  });

  updateDisplay();
});

// Обработчики для счётчиков лотереи
document.querySelectorAll('.lottery-controls').forEach(counter => {
  const upBtn = counter.querySelector('.up-arrow');
  const downBtn = counter.querySelector('.down-arrow');
  const display = counter.querySelector('.quantity-display');
  const target = parseInt(counter.getAttribute('data-target'));
  const checkbox = counter.closest('tr').querySelector('input[type="checkbox"]');

  upBtn.addEventListener('click', function() {
    let current = parseInt(display.textContent);
    if (current < target) {
      display.textContent = current + 1;
      if (current + 1 === target) {
        // Активируем чекбокс при достижении цели
        checkbox.checked = true;
        counter.closest('tr').classList.add('completed');
        // Деактивируем кнопки
        upBtn.classList.add('disabled');
        downBtn.classList.add('disabled');
      }
      updateTotal();
    }
  });

  downBtn.addEventListener('click', function() {
    let current = parseInt(display.textContent);
    if (current > 0) {
      display.textContent = current - 1;
      if (current === target) {
        // Если уменьшаем ниже цели, деактивируем чекбокс
        checkbox.checked = false;
        counter.closest('tr').classList.remove('completed');
        // Активируем кнопки обратно
        upBtn.classList.remove('disabled');
        downBtn.classList.remove('disabled');
      }
      updateTotal();
    }
  });

  // Обработчик для ручного клика по чекбоксу
  checkbox.addEventListener('change', function() {
    const currentCount = parseInt(display.textContent);

    if (this.checked) {
      // Если пользователь вручную поставил галочку, устанавливаем счётчик в целевое значение
      display.textContent = target;
      counter.closest('tr').classList.add('completed');
      // Блокируем кнопки
      upBtn.classList.add('disabled');
      downBtn.classList.add('disabled');
    } else {
      // Если пользователь снял галочку, сбрасываем счётчик
      display.textContent = '0';
      counter.closest('tr').classList.remove('completed');
      // Разблокируем кнопки
      upBtn.classList.remove('disabled');
      downBtn.classList.remove('disabled');
    }
    updateTotal();
  });
});

// Устанавливаем сохранённую или светлую тему при загрузке
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = ' ';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggle.textContent = ' ';
  }

// Обработчик переключения темы
themeToggle.addEventListener('click', function() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
});

// Инициализация темы при загрузке
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Первоначальное обновление отображения
updateDisplay();
});
