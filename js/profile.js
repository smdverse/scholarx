
/* =========================================
   SCHOLARX - STUDENT PROFILE
   Phase 1: Profile Overview
   ========================================= */

(function () {
  "use strict";

  function initializeProfile() {
    const dashboard = document.getElementById("dashboard");
    const client = window.scholarXClient;

    if (!dashboard || !client) {
      console.error("ScholarX profile: Dashboard or Supabase client missing.");
      return;
    }

    // Prevent duplicate profile sections.
    if (document.getElementById("sx-profile-card")) return;

    // Profile styling.
    const style = document.createElement("style");

    style.textContent = `
      .sx-profile-card {
        margin-top: 22px;
        padding: 22px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 15px;
      }

      .sx-profile-card h3 {
        margin-bottom: 18px;
        font-size: 19px;
      }

      .sx-profile-details {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }

      .sx-profile-item {
        padding: 14px;
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: 10px;
        min-width: 0;
      }

      .sx-profile-label {
        display: block;
        margin-bottom: 7px;
        color: var(--muted);
        font-size: 12px;
      }

      .sx-profile-value {
        display: block;
        font-size: 14px;
        font-weight: 700;
        overflow-wrap: anywhere;
      }

      .sx-profile-progress {
        margin-top: 20px;
      }

      .sx-profile-progress-track {
        height: 8px;
        margin-top: 10px;
        overflow: hidden;
        border-radius: 10px;
        background: var(--border);
      }

      .sx-profile-progress-fill {
        width: 66.67%;
        height: 100%;
        background: var(--primary);
        border-radius: 10px;
      }

      .sx-profile-note {
        margin-top: 10px;
        color: var(--muted);
        font-size: 13px;
        line-height: 1.6;
      }

      @media (max-width: 600px) {
        .sx-profile-details {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(style);

    // Create profile section.
    const profile = document.createElement("section");

    profile.id = "sx-profile-card";
    profile.className = "sx-profile-card";

    profile.innerHTML = `
      <h3>👤 My Profile</h3>

      <div class="sx-profile-details">

        <div class="sx-profile-item">
          <span class="sx-profile-label">Full Name</span>
          <span class="sx-profile-value" id="sx-profile-name">
            Loading...
          </span>
        </div>

        <div class="sx-profile-item">
          <span class="sx-profile-label">Email Address</span>
          <span class="sx-profile-value" id="sx-profile-email">
            Loading...
          </span>
        </div>

        <div class="sx-profile-item">
          <span class="sx-profile-label">Account Status</span>
          <span class="sx-profile-value" id="sx-profile-status">
            Checking...
          </span>
        </div>

        <div class="sx-profile-item">
          <span class="sx-profile-label">UTME Subjects</span>
          <span class="sx-profile-value" id="sx-profile-subjects">
            Not selected yet
          </span>
        </div>

      </div>

      <div class="sx-profile-progress">
        <strong>Profile Completion</strong>

        <div class="sx-profile-progress-track">
          <div class="sx-profile-progress-fill"></div>
        </div>

        <p class="sx-profile-note" id="sx-profile-completion">
          Checking your profile...
        </p>
      </div>
    `;

    dashboard.appendChild(profile);

    // Display authenticated student information.
    function displayProfile(user) {
      if (!user) return;

      const name =
        user.user_metadata?.full_name || "Name not provided";

      const userEmail = user.email || "Email unavailable";

      const emailVerified =
        Boolean(user.email_confirmed_at);

      document.getElementById("sx-profile-name").textContent = name;

      document.getElementById("sx-profile-email").textContent =
        userEmail;

      document.getElementById("sx-profile-status").textContent =
        emailVerified ? "Verified account" : "Email not verified";

      const hasName =
        Boolean(user.user_metadata?.full_name?.trim());

      const hasEmail = Boolean(user.email);

      const completed = [hasName, hasEmail].filter(Boolean).length;

      const percentage = Math.round((completed / 3) * 100);

      document.querySelector(
        ".sx-profile-progress-fill"
      ).style.width = percentage + "%";

      document.getElementById(
        "sx-profile-completion"
      ).textContent =
        percentage + "% complete. Your UTME subjects are still awaiting selection.";
    }

    // Load the current student's session.
    async function loadProfile() {
      const { data, error } = await client.auth.getUser();

      if (error) {
        console.error("Unable to load profile:", error.message);
        return;
      }

      if (data.user) {
        displayProfile(data.user);
      }
    }

    loadProfile();

    // Keep profile information updated after authentication changes.
    client.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        displayProfile(session.user);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeProfile
    );
  } else {
    initializeProfile();
  }
})();
