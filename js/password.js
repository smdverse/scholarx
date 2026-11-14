
/* =========================================
   SCHOLARX - SHOW / HIDE PASSWORD
   ========================================= */

(function () {
  "use strict";

  function initializePasswordVisibility() {

    const passwordFields = [
      document.getElementById("password"),
      document.getElementById("newPassword"),
      document.getElementById("confirmPassword")
    ];

    const eyeIcon = `
      <svg viewBox="0 0 24 24" width="21" height="21"
        fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    `;

    const eyeOffIcon = `
      <svg viewBox="0 0 24 24" width="21" height="21"
        fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 3l18 18"/>
        <path d="M10.6 10.6a2 2 0 002.8 2.8"/>
        <path d="M9.9 5.2A11 11 0 0112 5c6.5 0 10 7 10 7a15 15 0 01-4 4.8"/>
        <path d="M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8"/>
      </svg>
    `;

    const style = document.createElement("style");

    style.textContent = `
      .password-input-wrap {
        position: relative;
        width: 100%;
      }

      .password-input-wrap input {
        width: 100%;
        padding-right: 52px !important;
      }

      .password-visibility-button {
        position: absolute;
        right: 9px;
        top: 50%;
        transform: translateY(-50%);
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: var(--muted);
        cursor: pointer;
      }

      .password-visibility-button:hover {
        background: var(--soft);
        color: var(--primary);
      }

      .password-visibility-button:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
      }
    `;

    document.head.appendChild(style);

    passwordFields.forEach(function (input) {

      if (!input) return;

      const wrapper = document.createElement("div");
      wrapper.className = "password-input-wrap";

      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);

      const toggle = document.createElement("button");

      toggle.type = "button";
      toggle.className = "password-visibility-button";
      toggle.innerHTML = eyeIcon;
      toggle.setAttribute("aria-label", "Show password");
      toggle.setAttribute("aria-pressed", "false");
      toggle.title = "Show password";

      wrapper.appendChild(toggle);

      toggle.addEventListener("click", function () {

        const isHidden = input.type === "password";

        input.type = isHidden ? "text" : "password";

        toggle.innerHTML = isHidden ? eyeOffIcon : eyeIcon;

        toggle.setAttribute(
          "aria-label",
          isHidden ? "Hide password" : "Show password"
        );

        toggle.setAttribute(
          "aria-pressed",
          String(isHidden)
        );

        toggle.title = isHidden ? "Hide password" : "Show password";

      });

      // Hide the password again when its form is reset.
      const form = input.closest("form");

      if (form) {
        form.addEventListener("reset", function () {
          input.type = "password";
          toggle.innerHTML = eyeIcon;
          toggle.setAttribute("aria-label", "Show password");
          toggle.setAttribute("aria-pressed", "false");
          toggle.title = "Show password";
        });
      }

    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializePasswordVisibility
    );
  } else {
    initializePasswordVisibility();
  }

})();
