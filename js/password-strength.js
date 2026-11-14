
/* =========================================
   SCHOLARX - PASSWORD STRENGTH INDICATOR
   ========================================= */

(function () {
  "use strict";

  function initializePasswordStrength() {
    const password = document.getElementById("password");
    const nameField = document.getElementById("nameField");

    if (!password || !nameField) return;

    const field = password.closest(".field");
    if (!field) return;

    const indicator = document.createElement("div");
    indicator.className = "password-strength";
    indicator.innerHTML = `
      <div class="strength-track">
        <div class="strength-fill"></div>
      </div>
      <p class="strength-label">Password strength: <span>Not entered</span></p>
      <p class="strength-hint">Use at least 8 characters, including letters and numbers.</p>
    `;

    field.appendChild(indicator);

    const fill = indicator.querySelector(".strength-fill");
    const label = indicator.querySelector(".strength-label span");
    const hint = indicator.querySelector(".strength-hint");

    const style = document.createElement("style");
    style.textContent = `
      .password-strength {
        margin-top: 10px;
      }

      .strength-track {
        height: 6px;
        background: var(--border);
        border-radius: 10px;
        overflow: hidden;
      }

      .strength-fill {
        height: 100%;
        width: 0;
        border-radius: 10px;
        transition: width .25s, background .25s;
      }

      .strength-label {
        margin-top: 7px;
        color: var(--muted);
        font-size: 12px;
      }

      .strength-hint {
        margin-top: 5px;
        color: var(--muted);
        font-size: 12px;
        line-height: 1.5;
      }
    `;

    document.head.appendChild(style);

    function checkStrength() {
      const value = password.value;

      if (!value) {
        fill.style.width = "0";
        label.textContent = "Not entered";
        hint.textContent =
          "Use at least 8 characters, including letters and numbers.";
        return;
      }

      let score = 0;

      if (value.length >= 8) score++;
      if (/[a-z]/.test(value)) score++;
      if (/[A-Z]/.test(value)) score++;
      if (/[0-9]/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;

      const levels = [
        { name: "Very weak", width: "20%", color: "#dc3545" },
        { name: "Weak", width: "40%", color: "#fd7e14" },
        { name: "Fair", width: "60%", color: "#e0a800" },
        { name: "Good", width: "80%", color: "#198754" },
        { name: "Strong", width: "100%", color: "#16834b" }
      ];

      const level = levels[score - 1] || levels[0];

      fill.style.width = level.width;
      fill.style.background = level.color;
      label.textContent = level.name;

      if (value.length < 8) {
        hint.textContent = "Add at least 8 characters.";
      } else if (score < 4) {
        hint.textContent =
          "Try adding uppercase letters, numbers or symbols.";
      } else {
        hint.textContent = "Good job! Your password is stronger.";
      }
    }

    function updateVisibility() {
      indicator.style.display =
        nameField.classList.contains("hidden") ? "none" : "block";
    }

    password.addEventListener("input", checkStrength);

    new MutationObserver(updateVisibility).observe(nameField, {
      attributes: true,
      attributeFilter: ["class"]
    });

    updateVisibility();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializePasswordStrength
    );
  } else {
    initializePasswordStrength();
  }
})();
