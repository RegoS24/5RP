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


  // Устанавливаем сохранённую или светлую тему при загрузке
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggle.textContent = '🌙';
  }

  // Обработчик переключения темы
  themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');

    if (currentTheme === 'dark') {
      // Переключаем на светлую
      document.documentElement.setAttribute('data-theme', 'light');
      themeToggle.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    } else {
      // Переключаем на тёмную
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    }
  });

  // Функция обновления наград в таблице
  function updateRewards() {
    const vip = vipCheckbox.checked;
    const x2 = x2Checkbox.checked;

    document.querySelectorAll('.reward').forEach(cell => {
      const base = parseInt(cell.getAttribute('data-without'));
      const vipValue = parseInt(cell.getAttribute('data-with'));
      let reward = vip ? vipValue : base;
      if (x2) reward *= 2;
      cell.textContent = reward + ' BP';
    });

    updateTotal();
  }

  // Функция подсчёта общего количества BP
  function updateTotal() {
    let total = 0;
    let remaining = 0;
    const vip = vipCheckbox.checked;
    const x2 = x2Checkbox.checked;

    // Подсчёт выполненных заданий
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const rewardCell = checkbox.closest('tr').querySelector('.reward');
        const base = parseInt(rewardCell.getAttribute('data-without'));
        const vipValue = parseInt(rewardCell.getAttribute('data-with'));
        let reward = vip ? vipValue : base;
        if (x2) reward *= 2;
        total += reward;
      }
    });

    // Подсчёт оставшихся заданий
    checkboxes.forEach(checkbox => {
      if (!checkbox.checked) {
        const rewardCell = checkbox.closest('tr').querySelector('.reward');
        const base = parseInt(rewardCell.getAttribute('data-without'));
        const vipValue = parseInt(rewardCell.getAttribute('data-with'));
        let reward = vip ? vipValue : base;
        if (x2) reward *= 2;
        remaining += reward;
      }
    });

    totalDisplay.textContent = total + ' BP';
    remainingDisplay.textContent = remaining + ' BP';
  }

  // Функция сброса всех чекбоксов
  function resetAllCheckboxes() {
    // Сбрасываем все чекбоксы заданий
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    // Обновляем отображение наград и подсчёт
    updateRewards();
  }

  // Обработчики для VIP и X2 чекбоксов
  vipCheckbox.addEventListener('change', updateRewards);
  x2Checkbox.addEventListener('change', updateRewards);

  // Обработчик для всех чекбоксов заданий
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateTotal);
  });

  // Обработчик для кнопки сброса
  resetBtn.addEventListener('click', resetAllCheckboxes);

  // Инициализация — первое обновление
  updateRewards();
});