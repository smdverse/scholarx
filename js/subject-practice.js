
/* ==========================================
   SCHOLARX - SUBJECT PRACTICE
   Uses existing Supabase Edge Functions
   ========================================== */

(function () {
  "use strict";

  const client = window.scholarXClient;

  if (!client) {
    console.error("ScholarX: Supabase client not found.");
    return;
  }

  let subjects = [];
  let topics = [];
  let questions = [];
  let currentIndex = 0;
  let attemptId = null;
  let selectedSubject = null;
  let submittedQuestions = new Set();
  let isSubmitting = false;
  let isFinished = false;

  const YEARS = Array.from(
    { length: 27 },
    (_, index) => 2000 + index
  ).reverse();

  function addStyles() {
    if (document.getElementById("sx-practice-styles")) return;

    const style = document.createElement("style");
    style.id = "sx-practice-styles";

    style.textContent = `
      #sx-practice-modal {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(0,0,0,.65);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 14px;
        overflow-y: auto;
      }

      #sx-practice-modal.sx-open {
        display: flex;
      }

      .sx-practice-panel {
        width: 100%;
        max-width: 650px;
        max-height: 94vh;
        overflow-y: auto;
        background: var(--surface, #fff);
        color: var(--text, #222);
        border: 1px solid var(--border, #ddd);
        border-radius: 18px;
        padding: 22px;
      }

      .sx-practice-panel h2,
      .sx-practice-panel h3 {
        margin-top: 0;
      }

      .sx-practice-close {
        float: right;
        border: 0;
        background: transparent;
        color: inherit;
        font-size: 25px;
        cursor: pointer;
      }

      .sx-practice-field {
        margin: 17px 0;
      }

      .sx-practice-field label {
        display: block;
        margin-bottom: 7px;
        font-weight: 600;
        font-size: 13px;
      }

      .sx-practice-field select {
        width: 100%;
        padding: 12px;
        border: 1px solid var(--border, #ccc);
        border-radius: 9px;
        background: var(--surface, #fff);
        color: inherit;
        font-size: 14px;
      }

      .sx-practice-button {
        display: inline-block;
        border: 0;
        border-radius: 9px;
        padding: 12px 18px;
        background: var(--primary, #5546e8);
        color: white;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
      }

      .sx-practice-button:disabled {
        opacity: .5;
        cursor: not-allowed;
      }

      .sx-practice-secondary {
        background: var(--soft, #eee);
        color: var(--text, #222);
      }

      .sx-practice-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 22px;
      }

      .sx-practice-question {
        padding: 17px;
        border: 1px solid var(--border, #ddd);
        border-radius: 12px;
        margin: 17px 0;
        line-height: 1.7;
        white-space: pre-wrap;
      }

      .sx-practice-option {
        display: block;
        width: 100%;
        text-align: left;
        padding: 13px;
        margin: 9px 0;
        border: 1px solid var(--border, #ddd);
        border-radius: 10px;
        background: var(--surface, #fff);
        color: inherit;
        cursor: pointer;
        font-size: 14px;
      }

      .sx-practice-option:disabled {
        cursor: default;
        opacity: .8;
      }

      .sx-practice-option.sx-selected {
        border: 2px solid var(--primary, #5546e8);
      }

      .sx-practice-feedback {
        padding: 12px;
        border-radius: 9px;
        margin-top: 14px;
        background: var(--soft, #eee);
        line-height: 1.6;
      }

      .sx-practice-muted {
        color: var(--muted, #777);
        font-size: 13px;
      }

      .sx-practice-progress {
        height: 7px;
        border-radius: 10px;
        background: var(--border, #ddd);
        overflow: hidden;
        margin: 12px 0;
      }

      .sx-practice-progress span {
        display: block;
        height: 100%;
        background: var(--primary, #5546e8);
      }

      @media(max-width: 480px) {
        .sx-practice-panel {
          padding: 17px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createModal() {
    if (document.getElementById("sx-practice-modal")) return;

    const modal = document.createElement("div");
    modal.id = "sx-practice-modal";

    modal.innerHTML = `
      <div class="sx-practice-panel">
        <button class="sx-practice-close"
          type="button"
          aria-label="Close">&times;</button>

        <div id="sx-practice-content"></div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".sx-practice-close")
      .addEventListener("click", closeModal);

    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });
  }

  function openModal() {
    document.getElementById("sx-practice-modal")
      .classList.add("sx-open");
  }

  function closeModal() {
    if (isSubmitting) return;

    document.getElementById("sx-practice-modal")
      .classList.remove("sx-open");
  }

  function showMessage(message, isError) {
    const content = document.getElementById("sx-practice-content");

    content.innerHTML = "";

    const heading = document.createElement("h2");
    heading.textContent = isError ? "Something went wrong" : "ScholarX";

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    const button = document.createElement("button");
    button.className = "sx-practice-button";
    button.textContent = "Close";
    button.addEventListener("click", closeModal);

    content.append(heading, paragraph, button);
  }

  async function loadSubjects() {
    const { data, error } = await client
      .from("subjects")
      .select("id,name,slug,is_compulsory")
      .eq("is_active", true)
      .order("name");

    if (error) throw error;

    subjects = data || [];
  }

  async function loadTopics(subjectId) {
    const { data, error } = await client
      .from("topics")
      .select("*")
      .eq("subject_id", subjectId);

    if (error) throw error;

    topics = data || [];
  }

  function topicName(topic) {
    return topic.name || topic.title || topic.topic_name || "Topic";
  }

  function showSetup() {
    const content = document.getElementById("sx-practice-content");

    content.innerHTML = `
      <h2>📚 Subject Practice</h2>

      <p class="sx-practice-muted">
        Choose one subject and practise at your own pace.
      </p>

      <div class="sx-practice-field">
        <label for="sx-subject">Choose a subject</label>
        <select id="sx-subject">
          <option value="">Select a subject</option>
        </select>
      </div>

      <div class="sx-practice-field">
        <label for="sx-year">Examination year</label>
        <select id="sx-year">
          <option value="">All available years</option>
        </select>
      </div>

      <div class="sx-practice-field">
        <label for="sx-topic">Topic</label>
        <select id="sx-topic" disabled>
          <option value="">All available topics</option>
        </select>
      </div>

      <div class="sx-practice-field">
        <label for="sx-count">Number of questions</label>
        <select id="sx-count">
          <option value="10">10 questions</option>
          <option value="20" selected>20 questions</option>
          <option value="30">30 questions</option>
          <option value="40">40 questions</option>
          <option value="50">50 questions</option>
        </select>
      </div>

      <div id="sx-setup-message"
        class="sx-practice-muted"></div>

      <div class="sx-practice-actions">
        <button id="sx-start-button"
          class="sx-practice-button"
          type="button">
          Start Practice
        </button>
      </div>
    `;

    const subjectSelect = content.querySelector("#sx-subject");
    const yearSelect = content.querySelector("#sx-year");
    const topicSelect = content.querySelector("#sx-topic");

    subjects.forEach(subject => {
      const option = document.createElement("option");
      option.value = subject.id;
      option.textContent = subject.name;
      subjectSelect.appendChild(option);
    });

    YEARS.forEach(year => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });

    subjectSelect.addEventListener("change", async function () {
      topicSelect.innerHTML =
        '<option value="">All available topics</option>';

      topicSelect.disabled = true;

      if (!this.value) return;

      try {
        await loadTopics(this.value);

        topics.forEach(topic => {
          const option = document.createElement("option");
          option.value = topic.id;
          option.textContent = topicName(topic);
          topicSelect.appendChild(option);
        });

        topicSelect.disabled = false;
      } catch (error) {
        console.error(error);
        content.querySelector("#sx-setup-message").textContent =
          "Topics could not be loaded. You can still practise all topics.";
      }
    });

    content.querySelector("#sx-start-button")
      .addEventListener("click", startPractice);
  }

  async function startPractice() {
    const content = document.getElementById("sx-practice-content");
    const subjectId = content.querySelector("#sx-subject").value;
    const year = content.querySelector("#sx-year").value;
    const topicId = content.querySelector("#sx-topic").value;
    const limit = Number(content.querySelector("#sx-count").value);
    const button = content.querySelector("#sx-start-button");

    if (!subjectId) {
      content.querySelector("#sx-setup-message").textContent =
        "Please choose a subject first.";
      return;
    }

    button.disabled = true;
    button.textContent = "Preparing questions...";

    const body = {
      subject_id: subjectId,
      limit: limit
    };

    if (year) body.exam_year = Number(year);
    if (topicId) body.topic_id = topicId;

    try {
      const { data, error } = await client.functions.invoke(
        "start-practice",
        { body }
      );

      if (error) throw error;
      if (!data || !data.success) {
        throw new Error(data?.message || "Could not start practice.");
      }

      attemptId = data.attempt?.id;

      if (!attemptId) {
        throw new Error("The practice attempt ID was not returned.");
      }

      selectedSubject = subjects.find(item => item.id === subjectId);
      submittedQuestions = new Set();
      currentIndex = 0;
      isFinished = false;

      // Retrieve the assigned questions using the existing function.
      const result = await client.functions.invoke(
        "get-practice-questions",
        { body: { attempt_id: attemptId } }
      );

      if (result.error) throw result.error;

      questions = result.data?.questions || [];

      if (!questions.length) {
        throw new Error("No questions were found for these filters.");
      }

      showQuestion();
    } catch (error) {
      console.error("ScholarX practice error:", error);
      showMessage(error.message || "Unable to start practice.", true);
    }
  }

  function showQuestion() {
    const content = document.getElementById("sx-practice-content");
    const question = questions[currentIndex];

    if (!question) return;

    const progress = Math.round(
      ((currentIndex + 1) / questions.length) * 100
    );

    content.innerHTML = `
      <h2>${escapeHTML(selectedSubject?.name || "Subject Practice")}</h2>

      <p class="sx-practice-muted">
        Question ${currentIndex + 1} of ${questions.length}
      </p>

      <div class="sx-practice-progress">
        <span style="width:${progress}%"></span>
      </div>

      <div id="sx-question-text"
        class="sx-practice-question"></div>

      <div id="sx-question-options"></div>

      <div id="sx-question-feedback"
        class="sx-practice-feedback"
        hidden></div>

      <div class="sx-practice-actions">
        <button id="sx-previous"
          class="sx-practice-button sx-practice-secondary"
          type="button">
          Previous
        </button>

        <button id="sx-next"
          class="sx-practice-button"
          type="button">
          Next
        </button>
      </div>

      <p class="sx-practice-muted">
        ${submittedQuestions.size} of ${questions.length} answered
      </p>
    `;

    content.querySelector("#sx-question-text").textContent =
      question.question_text || "Question text unavailable.";

    const optionsContainer =
      content.querySelector("#sx-question-options");

    (question.options || []).forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sx-practice-option";

      button.textContent = `${option.label}. ${option.text}`;

      button.addEventListener("click", () => {
        submitAnswer(question, option.label, button);
      });

      optionsContainer.appendChild(button);
    });

    content.querySelector("#sx-previous").disabled =
      currentIndex === 0;

    content.querySelector("#sx-next").textContent =
      currentIndex === questions.length - 1
        ? "Finish Practice"
        : "Next";

    content.querySelector("#sx-previous")
      .addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          showQuestion();
        }
      });

    content.querySelector("#sx-next")
      .addEventListener("click", async () => {
        if (currentIndex < questions.length - 1) {
          currentIndex++;
          showQuestion();
        } else {
          await finishPractice();
        }
      });

    // Show saved feedback when returning to an answered question.
    if (question._feedback) {
      showFeedback(question._feedback);
      disableOptions();
    }
  }

  async function submitAnswer(question, selectedOption, button) {
    if (isSubmitting || submittedQuestions.has(question.id)) return;

    isSubmitting = true;

    const options = document.querySelectorAll(".sx-practice-option");
    options.forEach(option => option.disabled = true);

    button.classList.add("sx-selected");

    try {
      const { data, error } = await client.functions.invoke(
        "submit-answer",
        {
          body: {
            attempt_id: attemptId,
            question_id: question.id,
            selected_option: selectedOption
          }
        }
      );

      if (error) throw error;

      if (!data || !data.success || !data.result?.success) {
        throw new Error(
          data?.error || data?.result?.message || "Answer could not be saved."
        );
      }

      submittedQuestions.add(question.id);
      question._feedback = {
        isCorrect: data.result.is_correct,
        message: data.result.message
      };

      showFeedback(question._feedback);

      const counter = document.querySelector(
        "#sx-practice-content .sx-practice-muted:last-child"
      );

      if (counter) {
        counter.textContent =
          `${submittedQuestions.size} of ${questions.length} answered`;
      }

    } catch (error) {
      console.error("Answer submission error:", error);

      options.forEach(option => option.disabled = false);

      const feedback = document.getElementById("sx-question-feedback");
      feedback.hidden = false;
      feedback.textContent =
        error.message || "Your answer could not be submitted. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }

  function showFeedback(feedbackData) {
    const feedback = document.getElementById("sx-question-feedback");

    if (!feedback) return;

    feedback.hidden = false;
    feedback.textContent = feedbackData.message ||
      (feedbackData.isCorrect ? "Correct answer!" : "Not quite. Keep practising!");
  }

  function disableOptions() {
    document.querySelectorAll(".sx-practice-option")
      .forEach(option => option.disabled = true);
  }

  async function finishPractice() {
    const content = document.getElementById("sx-practice-content");

    if (isFinished) return;

    const button = content.querySelector("#sx-next");
    button.disabled = true;
    button.textContent = "Calculating results...";

    try {
      const { data, error } = await client.functions.invoke(
        "finish-practice",
        { body: { attempt_id: attemptId } }
      );

      if (error) throw error;
      if (!data || !data.success || !data.result) {
        throw new Error(data?.message || "Could not finish practice.");
      }

      isFinished = true;
      showResults(data.result);

    } catch (error) {
      console.error("Finish practice error:", error);
      button.disabled = false;
      button.textContent = "Try finishing again";
      showMessage(error.message || "Unable to calculate results.", true);
    }
  }

  function showResults(result) {
    const content = document.getElementById("sx-practice-content");

    content.innerHTML = `
      <h2>🎉 Practice Completed!</h2>

      <p class="sx-practice-muted">
        ${escapeHTML(selectedSubject?.name || "Subject Practice")}
      </p>

      <div class="sx-practice-question">
        <h2>${Number(result.percentage || 0)}%</h2>
        <p>Your practice score</p>

        <hr>

        <p>Total questions: ${Number(result.total_questions || 0)}</p>
        <p>Answered: ${Number(result.answered_questions || 0)}</p>
        <p>Correct answers: ${Number(result.correct_answers || 0)}</p>
        <p>Incorrect answers: ${Number(result.incorrect_answers || 0)}</p>
        <p>Unanswered: ${Number(result.unanswered_questions || 0)}</p>
      </div>

      <p>
        Keep learning. Keep improving. Keep excelling.
      </p>

      <div class="sx-practice-actions">
        <button id="sx-close-results"
          class="sx-practice-button"
          type="button">
          Back to Dashboard
        </button>
      </div>
    `;

    content.querySelector("#sx-close-results")
      .addEventListener("click", closeModal);
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
  }

  async function initialize() {
    addStyles();
    createModal();

    const dashboard = document.getElementById("dashboard");

    if (!dashboard) return;

    const cards = Array.from(
      dashboard.querySelectorAll(".sx-card")
    );

    const practiceCard = cards.find(card =>
      card.querySelector("h3")?.textContent.trim() === "Subject Practice"
    );

    if (!practiceCard) {
      console.error("ScholarX: Subject Practice card not found.");
      return;
    }

    if (practiceCard.querySelector("#sx-open-practice")) return;

    const button = document.createElement("button");
    button.id = "sx-open-practice";
    button.type = "button";
    button.className = "sx-practice-button";
    button.textContent = "Start Practising";

    button.style.marginTop = "18px";
    button.style.alignSelf = "flex-start";

    practiceCard.appendChild(button);

    button.addEventListener("click", async () => {
      openModal();
      showMessage("Loading available subjects...", false);

      try {
        await loadSubjects();

        if (!subjects.length) {
          throw new Error("No active subjects are available yet.");
        }

        showSetup();

      } catch (error) {
        console.error(error);
        showMessage(
          error.message || "Could not load subjects.",
          true
        );
      }
    });
  }

  
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );
  } else {
    initialize();
  }
})();
