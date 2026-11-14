
/* =========================================
   SCHOLARX - STUDENT DASHBOARD
   Two Learning Modes
   ========================================= */

(function () {
  "use strict";

  function initializeDashboard() {
    const dashboard = document.getElementById("dashboard");
    const logoutButton = document.getElementById("logoutButton");

    if (!dashboard || !logoutButton) return;

    // Prevent duplicate dashboard styling.
    if (!document.getElementById("sx-dashboard-styles")) {
      const style = document.createElement("style");
      style.id = "sx-dashboard-styles";

      style.textContent = `
        #dashboard {
          max-width: 1100px;
          width: 100%;
          margin: 30px auto;
          padding: 0;
          text-align: left;
          background: transparent;
          border: none;
          box-shadow: none;
        }

        .sx-welcome {
          background: linear-gradient(135deg, #5546e8, #8275f5);
          color: white;
          padding: 30px;
          border-radius: 18px;
          margin-bottom: 25px;
        }

        .sx-welcome h2 {
          font-size: clamp(23px, 4vw, 32px);
          margin: 10px 0;
        }

        .sx-welcome p {
          color: white !important;
          opacity: .92;
          line-height: 1.7;
          margin: 0;
        }

        .sx-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .sx-section-title {
          font-size: 20px;
          margin: 28px 0 15px;
        }

        .sx-mode-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .sx-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 23px;
          min-width: 0;
        }

        .sx-mode-card {
          display: flex;
          flex-direction: column;
          min-height: 235px;
        }

        .sx-card-icon {
          font-size: 30px;
          margin-bottom: 14px;
        }

        .sx-card h3 {
          font-size: 17px;
          margin: 0 0 10px;
        }

        .sx-card p {
          font-size: 13px;
          line-height: 1.7;
          color: var(--muted);
          margin: 0;
        }

        .sx-card-status {
          display: inline-block;
          align-self: flex-start;
          margin-top: auto;
          padding: 7px 11px;
          border-radius: 20px;
          background: var(--soft);
          color: var(--primary);
          font-size: 11px;
          font-weight: 700;
        }

        .sx-tools-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 15px;
        }

        .sx-tool-card {
          min-height: 150px;
        }

        .sx-tool-card .sx-card-icon {
          font-size: 25px;
          margin-bottom: 10px;
        }

        .sx-progress-card {
          margin-top: 20px;
        }

        .sx-progress-line {
          height: 8px;
          border-radius: 10px;
          background: var(--border);
          margin-top: 15px;
          overflow: hidden;
        }

        .sx-progress-line span {
          display: block;
          width: 0;
          height: 100%;
          background: var(--primary);
        }

        .sx-dashboard-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }

        .sx-dashboard-bottom p {
          color: var(--muted);
          font-size: 13px;
          margin: 0;
        }

        #dashboard .logout-button {
          margin: 0;
        }

        @media (max-width: 700px) {
          #dashboard {
            margin: 20px auto;
          }

          .sx-welcome {
            padding: 23px;
          }

          .sx-mode-grid,
          .sx-tools-grid {
            grid-template-columns: 1fr;
          }

          .sx-card {
            padding: 19px;
          }

          .sx-mode-card {
            min-height: 210px;
          }
        }
      `;

      document.head.appendChild(style);
    }

    // Build the dashboard.
    dashboard.innerHTML = `
      <section class="sx-welcome">
        <div class="sx-eyebrow">STUDENT DASHBOARD</div>

        <h2>Welcome to ScholarX 👋</h2>

        <p id="studentGreeting">
          Your learning journey starts here.
        </p>
      </section>

      <h2 class="sx-section-title">
        Your Learning Space
      </h2>

      <div class="sx-mode-grid">

        <article class="sx-card sx-mode-card">
          <div class="sx-card-icon">📚</div>

          <h3>Subject Practice</h3>

          <p>
            Practise any UTME subject independently.
            Choose your subject, select available examination
            years or topics, answer questions and learn
            from explanations at your own pace.
          </p>

          <span class="sx-card-status">
            Coming soon
          </span>
        </article>

        <article class="sx-card sx-mode-card">
          <div class="sx-card-icon">📝</div>

          <h3>UTME CBT Examination</h3>

          <p>
            Experience a full JAMB-style CBT examination
            using your four selected UTME subjects.
            Practise with a timer, navigate questions
            and review your results.
          </p>

          <span class="sx-card-status">
            Coming soon
          </span>
        </article>

      </div>

      <h2 class="sx-section-title">
        UTME Preparation
      </h2>

      <div class="sx-tools-grid">

        <article class="sx-card sx-tool-card">
          <div class="sx-card-icon">🎓</div>

          <h3>Course & Institution</h3>

          <p>
            Choose your intended course and institution
            to discover the appropriate UTME subject
            combination.
          </p>

          <span class="sx-card-status">
            Setup coming soon
          </span>
        </article>

        <article class="sx-card sx-tool-card">
          <div class="sx-card-icon">📖</div>

          <h3>My Subjects</h3>

          <p>
            Select and organise your four UTME subjects.
            Use of English will be included automatically.
          </p>

          <span class="sx-card-status">
            Setup coming soon
          </span>
        </article>

      </div>

      <h2 class="sx-section-title">
        My Performance
      </h2>

      <section class="sx-card sx-progress-card">
        <h3>Your Learning Progress</h3>

        <p>
          Your practice scores, completed questions,
          strengths and areas for improvement will
          appear here as you begin learning.
        </p>

        <div class="sx-progress-line">
          <span></span>
        </div>

        <span class="sx-card-status">
          Ready to get started
        </span>
      </section>

      <div class="sx-dashboard-bottom">
        <p>
          Keep learning. Keep improving. Keep excelling.
        </p>

        <div id="sx-logout-container"></div>
      </div>
    `;

    // Preserve the original logout button and its event listener.
    document
      .getElementById("sx-logout-container")
      .appendChild(logoutButton);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeDashboard
    );
  } else {
    initializeDashboard();
  }
})();
