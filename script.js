// ==================== THEME SYSTEM (ALL PAGES) ====================
const THEME_KEY = "stickWithItTheme";          // "light" | "dark" | "purple"
const CUSTOM_BG_KEY = "stickWithItCustomBg";   // dataURL string

function applyTheme(theme) {
  const validThemes = ["light", "dark", "purple"];
  const chosen = validThemes.includes(theme) ? theme : "light";

  document.body.classList.remove("theme-light", "theme-dark", "theme-purple");
  document.body.classList.add(`theme-${chosen}`);

  // apply custom background image if exists
  const bg = localStorage.getItem(CUSTOM_BG_KEY);
  if (bg) {
    document.body.style.backgroundImage = `url('${bg}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  } else {
    document.body.style.backgroundImage = "none";
  }
}

function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(saved);
  return saved;
}

function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

function setCustomBackground(dataUrl) {
  localStorage.setItem(CUSTOM_BG_KEY, dataUrl);
  applyTheme(localStorage.getItem(THEME_KEY) || "light");
}

function clearCustomBackground() {
  localStorage.removeItem(CUSTOM_BG_KEY);
  applyTheme(localStorage.getItem(THEME_KEY) || "light");
}

// run automatically on every page
loadTheme();

// expose helpers (optional)
window.setTheme = setTheme;
window.setCustomBackground = setCustomBackground;
window.clearCustomBackground = clearCustomBackground;

// ==================== MOTIVATIONAL QUOTES (START PAGE) ====================
const quoteEl = document.getElementById("quote-text");

if (quoteEl) {
  const quotes = [
    "Small progress is still progress.",
    "Discipline beats motivation every time.",
    "Start where you are. Use what you have.",
    "Consistency builds results.",
    "Your future self will thank you.",
    "One focused hour can change your day.",
    "Do it even when you don’t feel like it.",
    "Progress, not perfection.",
    "The work you avoid is the work you need.",
    "You don’t need motivation. You need a plan.",
    "Action creates clarity.",
    "Hard choices now, easy life later.",
    "What you do today matters.",
    "Focus on the process, not the outcome.",
    "Every day is a new chance to improve."
  ];

  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteEl.textContent = quotes[randomIndex];
}


// ==================== SHARED DATE (IF EXISTS) ====================
const dateEl = document.getElementById("date");
if (dateEl) dateEl.textContent = new Date().toLocaleDateString();

// ==================== CALENDAR GRID (IF EXISTS) ====================
const calendarGrid = document.querySelector(".calendar-grid");
if (calendarGrid) {
  const hours = 17; // 6:00–22:00
  const days = 7;

  // only build if not already built (prevents duplicates on refresh/hot reload)
  const alreadyBuilt = calendarGrid.querySelector(".grid-cell");
  if (!alreadyBuilt) {
    for (let i = 0; i < hours * days; i++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.dataset.hour = Math.floor(i / days) + 6;
      cell.dataset.day = i % days;

      cell.addEventListener("click", function() {
        if (!this.hasChildNodes()) {
          const block = document.createElement("div");
          block.className = "time-block";
          block.textContent = "Task";
          block.contentEditable = true;

          // ==================== DELETE TASK (CONFIRM) ====================
          const confirmDelete = () => confirm("Are you sure you want to delete this task?");

          // Double-click deletes
          block.addEventListener("dblclick", (e) => {
            e.stopPropagation(); // don't trigger cell click
            if (confirmDelete()) block.remove();
          });

          // Right-click deletes
          block.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirmDelete()) block.remove();
          });

          // Delete/backspace deletes if empty or still placeholder
          block.addEventListener("keydown", (e) => {
            if (e.key === "Delete" || e.key === "Backspace") {
              const text = block.textContent.trim();
              if (text === "" || text === "Task") {
                e.preventDefault();
                if (confirmDelete()) block.remove();
              }
            }
          });
          // ===============================================================

          this.appendChild(block);
          block.focus();
        }
      });

      calendarGrid.appendChild(cell);
    }
  }
}

// ==================== TASK CREATION (IF EXISTS) ====================
const labelButton = document.getElementById("labelButtonCreation");
const labelContainer = document.getElementById("labelContainer");
const inputLinked = document.getElementById("inputID");

if (labelButton && labelContainer && inputLinked) {
  labelButton.addEventListener("click", function() {
    const labelNameInput = document.getElementById("labelName");
    const labelTypeSelect = document.getElementById("labelType");

    if (!labelNameInput || !labelTypeSelect) return;

    const name = labelNameInput.value.trim();
    const type = labelTypeSelect.value;

    if (!name) {
      alert("Please enter a task name.");
      return;
    }

    const newLabel = document.createElement("span");
    newLabel.textContent = name;
    newLabel.classList.add("label-tag");

    if (type === "school") newLabel.classList.add("label-school");
    if (type === "work") newLabel.classList.add("label-work");
    if (type === "personal") newLabel.classList.add("label-personal");
    if (type === "health") newLabel.classList.add("label-health");

    newLabel.addEventListener("click", () => {
      inputLinked.value = newLabel.textContent;
    });

    labelContainer.appendChild(newLabel);

    labelNameInput.value = "";
    labelNameInput.focus();
  });
}

// ==================== PROFILE PAGE (IF EXISTS) ====================
const nameInput = document.getElementById("profileName");
if (nameInput) {
  const userInput = document.getElementById("profileUsername");
  const emailInput = document.getElementById("profileEmail");
  const themeSelect = document.getElementById("themeSelect");

  const previewName = document.getElementById("previewName");
  const previewUsername = document.getElementById("previewUsername");
  const previewEmail = document.getElementById("previewEmail");
  const previewTheme = document.getElementById("previewTheme");
  const savedMsg = document.getElementById("profileSavedMsg");

  // avatar bits (from your earlier work)
  const avatarCircle = document.getElementById("avatarCircle");
  const avatarPlaceholder = document.getElementById("avatarPlaceholder");
  const avatarInput = document.getElementById("avatarInput");

  // custom background bits (new)
  const bgInput = document.getElementById("bgInput");
  const clearBgBtn = document.getElementById("clearBgBtn");
  const bgStatus = document.getElementById("bgStatus");

  const PROFILE_KEY = "stickWithItProfile";
  const savedProfile = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");

  // fill inputs
  if (savedProfile.name) nameInput.value = savedProfile.name;
  if (savedProfile.username) userInput.value = savedProfile.username;
  if (savedProfile.email) emailInput.value = savedProfile.email;

  // set theme dropdown from localStorage theme
  const currentTheme = loadTheme();
  if (themeSelect) themeSelect.value = savedProfile.theme || currentTheme;

  // preview
  if (previewName) previewName.textContent = savedProfile.name || "-";
  if (previewUsername) previewUsername.textContent = savedProfile.username || "-";
  if (previewEmail) previewEmail.textContent = savedProfile.email || "-";
  if (previewTheme) previewTheme.textContent = savedProfile.theme || currentTheme;

  // load avatar if saved
  if (savedProfile.avatarDataUrl && avatarCircle) {
    avatarCircle.style.backgroundImage = `url('${savedProfile.avatarDataUrl}')`;
    avatarCircle.classList.add("has-avatar");
    if (avatarPlaceholder) avatarPlaceholder.style.display = "none";
  }

  // handle avatar upload
  if (avatarInput) {
    avatarInput.addEventListener("change", () => {
      const file = avatarInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;

        if (avatarCircle) {
          avatarCircle.style.backgroundImage = `url('${dataUrl}')`;
          avatarCircle.classList.add("has-avatar");
        }
        if (avatarPlaceholder) avatarPlaceholder.style.display = "none";

        const updated = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
        updated.avatarDataUrl = dataUrl;
        localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
      };
      reader.readAsDataURL(file);
    });
  }

  // theme change
  if (themeSelect) {
    themeSelect.addEventListener("change", () => {
      const newTheme = themeSelect.value;
      setTheme(newTheme);
      if (previewTheme) previewTheme.textContent = newTheme;

      // keep savedProfile.theme in sync for your profile save
      const updated = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
      updated.theme = newTheme;
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    });
  }

  // custom background upload
  if (bgInput) {
    bgInput.addEventListener("change", () => {
      const file = bgInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        setCustomBackground(reader.result);
        if (bgStatus) bgStatus.textContent = "Custom background: ON";
      };
      reader.readAsDataURL(file);
    });
  }

  // clear custom bg
  if (clearBgBtn) {
    clearBgBtn.addEventListener("click", () => {
      clearCustomBackground();
      if (bgStatus) bgStatus.textContent = "Custom background: OFF";
    });
  }

  // set bg status label on load
  if (bgStatus) {
    bgStatus.textContent = localStorage.getItem(CUSTOM_BG_KEY)
      ? "Custom background: ON"
      : "Custom background: OFF";
  }

  // save profile button (keeps avatar + theme)
  const saveBtn = document.getElementById("saveProfileBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const existing = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");

      const profileData = {
        name: nameInput.value.trim(),
        username: userInput.value.trim(),
        email: emailInput.value.trim(),
        theme: themeSelect ? themeSelect.value : (localStorage.getItem(THEME_KEY) || "light"),
        avatarDataUrl: existing.avatarDataUrl || ""
      };

      localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));

      if (previewName) previewName.textContent = profileData.name || "-";
      if (previewUsername) previewUsername.textContent = profileData.username || "-";
      if (previewEmail) previewEmail.textContent = profileData.email || "-";
      if (previewTheme) previewTheme.textContent = profileData.theme;

      setTheme(profileData.theme);

      if (savedMsg) {
        savedMsg.textContent = "Profile saved!";
        setTimeout(() => (savedMsg.textContent = ""), 2000);
      }
    });
  }
}
