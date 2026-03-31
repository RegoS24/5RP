document.addEventListener("DOMContentLoaded", function () {
  const vipCheckbox = document.getElementById("vipCheckbox");
  const x2Checkbox = document.getElementById("x2Checkbox");
  const totalDisplay = document.getElementById("totalDisplay");
  const remainingDisplay = document.getElementById("remainingDisplay");
  const resetBtn = document.getElementById("resetBtn");
  const themeToggle = document.getElementById("themeToggle");
  const progressFill = document.getElementById("progressFill");
  const progressPercentElement = document.getElementById("progressPercent");

  const getCheckboxes = () => document.querySelectorAll('.tasks-column input[type="checkbox"]');

  function calculateReward(rewardCell) {
    if (!rewardCell) return 0;
    const base = parseInt(rewardCell.getAttribute("data-without")) || 0;
    const vipValue = parseInt(rewardCell.getAttribute("data-with")) || 0;
    let reward = vipCheckbox.checked ? vipValue : base;
    return x2Checkbox.checked ? reward * 2 : reward;
  }

  function updateDisplay() {
    let total = 0;
    let remaining = 0;
    let checkedCount = 0;
    const checkboxes = getCheckboxes();

    checkboxes.forEach((checkbox) => {
      const row = checkbox.closest("tr");
      const rewardCell = row.querySelector(".reward");
      const reward = calculateReward(rewardCell);

      if (rewardCell) rewardCell.textContent = reward + " BP";

      if (checkbox.checked) {
        total += reward;
        checkedCount++;
        row.classList.add("done");
      } else {
        remaining += reward;
        row.classList.remove("done");
      }
    });

    totalDisplay.textContent = total + " BP";
    remainingDisplay.textContent = remaining + " BP";

    if (checkboxes.length > 0) {
      const progressPercent = Math.min((checkedCount / checkboxes.length) * 100, 100);
      progressFill.style.width = progressPercent + "%";
      progressPercentElement.textContent = Math.round(progressPercent) + "%";
      progressFill.style.background = progressPercent >= 100 
        ? "var(--progress-high-color)" 
        : "var(--progress-fill-gradient)";
    }
  }

  // Настройка лотерей
  document.querySelectorAll(".lottery-controls").forEach((counter) => {
    const upBtn = counter.querySelector(".up-arrow");
    const downBtn = counter.querySelector(".down-arrow");
    const display = counter.querySelector(".quantity-display");
    const target = parseInt(counter.getAttribute("data-target")) || 0;
    const checkbox = counter.closest("tr").querySelector('input[type="checkbox"]');

    function updateButtonStates() {
      const current = parseInt(display.textContent) || 0;
      
      downBtn.disabled = current === 0;
      
      if (current === target) {
        upBtn.disabled = true;
        if(!checkbox.checked) checkbox.checked = true;
      } else {
        upBtn.disabled = false;
        if(checkbox.checked) checkbox.checked = false;
      }
      updateDisplay();
    }

    upBtn.addEventListener("click", () => {
      let current = parseInt(display.textContent) || 0;
      if (current < target) {
        display.textContent = current + 1;
        updateButtonStates();
      }
    });

    downBtn.addEventListener("click", () => {
      let current = parseInt(display.textContent) || 0;
      if (current > 0) {
        display.textContent = current - 1;
        updateButtonStates();
      }
    });

    checkbox.addEventListener("change", function () {
      display.textContent = this.checked ? target : "0";
      updateButtonStates();
    });

    updateButtonStates();
  });

  document.querySelector('.tasks-column').addEventListener("change", (e) => {
    if (e.target.classList.contains('task-checkbox')) {
      updateDisplay();
    }
  });

  vipCheckbox.addEventListener("change", updateDisplay);
  x2Checkbox.addEventListener("change", updateDisplay);

  resetBtn.addEventListener("click", () => {
    getCheckboxes().forEach((cb) => {
      if (cb.checked) {
        cb.checked = false;
        cb.dispatchEvent(new Event("change")); 
      }
    });
  });

  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  };

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    setTheme(isDark ? "light" : "dark");
  });

  // Установим темную тему по умолчанию, так как скрины в ней
  setTheme(localStorage.getItem("theme") || "dark");
  updateDisplay();
});