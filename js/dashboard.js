
/* =========================================
   SCHOLARX - STUDENT DASHBOARD
   Phase 1: Dashboard Homepage
   ========================================= */

(function () {
  "use strict";

  function initializeDashboard() {
    const dashboard = document.getElementById("dashboard");

    if (!dashboard) return;

    // Preserve the original logout button and its working event listener.
    const logoutButton = document.getElementById("logoutButton");

    if (!logoutButton) return;

    // Dashboard styling
    const style = document.createElement("style");

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
        margin-bottom: 10px;
      }

      .sx-welcome p {
        color: white !important;
        opacity: .92;
        line-height: 1.7;
      }

      .sx-eyebrow {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        margin-bottom: 12px;
      }

      .sx-section-title {
        font-size: 20px;
        margin: 28px 0 15px;
      }

      .sx-dashboard-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      .sx-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 15px;
        padding: 21px;
        min-width: 0;
      }

      .sx-card-icon {
        font-size: 27px;
        margin-bottom: 15px;
      }

      .sx-card h3 {
        font-size: 16px;
        margin-bottom: 9px;
      }

      .sx-card p {
        font-size: 13px;
        line-height: 1.7;
        color: var(--muted);
      }

      .sx-card-status {
        display: inline-block;
        margin-top: 15px;
        padding: 6px 10px;
        border-radius: 20px;
        background: var(--soft);
        color: var(--primary);
        font-size: 11px;
        font-weight: 700;
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

        .sx-dashboard-grid {
          grid-template-columns: 1fr;
        }

        .sx-card {
          padding: 19px;
        }
      }
    `;

    document.head.appendChild(style);

    // Build the dashboard homepage.
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

      <div class="sx-dashboard-grid">

        <article class="sx-card">
          <div class="sx-card-icon">📚</div>
          <h3>My Subjects</h3>
          <p>
            Choose your four UTME subjects and organise
            your examination preparation.
          </p>
          <span class="sx-card-status">Setup coming soon</span>
        </article>

        <article class="sx-card">
          <div class="sx-card-icon">✍️</div>
          <h3>Practice Centre</h3>
          <p>
            Practise examination questions and improve
            your understanding topic by topic.
          </p>
          <span class="sx-card-status">Coming soon</span>
        </article>

        <article class="sx-card">
          <div class="sx-card-icon">📊</div>
          <h3>My Performance</h3>
          <p>
            Follow your scores, identify weak areas
            and monitor your academic progress.
          </p>
          <span class="sx-card-status">Coming soon</span>
        </article>

      </div>

      <h2 class="sx-section-title">
        Your Progress
      </h2>

      <section class="sx-card sx-progress-card">
        <h3>Your learning journey</h3>
        <p>
          Your practice statistics and learning progress
          will appear here as you begin practising.
        </p>

        <div class="sx-progress-line">
          <span></span>
        </div>

        <span class="sx-card-status">Ready to get started</span>
      </section>

      <div class="sx-dashboard-bottom">
        <p>Keep learning. Keep improving. Keep excelling.</p>
        <div id="sx-logout-container"></div>
      </div>
    `;

    // Reattach the original logout button.
    // This keeps its existing Supabase logout functionality.
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