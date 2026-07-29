(() => {
  function initializeNexusAi() {
    // Iwas duplicate AI button/panel.
    document.querySelector("#nexusAiWrapper")?.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "nexusAiWrapper";

    wrapper.innerHTML = `
      <button id="nexusAiFab" type="button" aria-label="Open Nexus AI">
        ✦ AI
      </button>

      <aside id="nexusAiPanel">
        <div class="nexus-ai-head">
          <div>
            <b>ASK NEXUS AI</b>
            <small>Copilot for projects & tickets</small>
          </div>

          <button id="nexusAiClose" type="button">×</button>
        </div>

        <div id="nexusAiMessages" class="nexus-ai-messages">
          <div class="ai-msg bot">
            Ask me for a sprint summary, critical risks,
            workload insights, or a ticket draft.
          </div>
        </div>

        <div class="nexus-ai-quick">
          <button type="button" data-ai="Summarize the current sprint">
            Sprint summary
          </button>

          <button type="button" data-ai="Show critical delivery risks">
            Find risks
          </button>

          <button
            type="button"
            data-ai="Create a high priority incident ticket for delayed notifications"
          >
            Draft ticket
          </button>
        </div>

        <form id="nexusAiForm">
          <input
            id="nexusAiInput"
            type="text"
            placeholder="Ask Nexus AI..."
            required
          >
          <button type="submit">Send</button>
        </form>

        <small class="nexus-ai-note">
          Connected to the live NexusFlow backend.
        </small>
      </aside>
    `;

    document.body.appendChild(wrapper);

    const fab = document.querySelector("#nexusAiFab");
    const panel = document.querySelector("#nexusAiPanel");
    const closeButton = document.querySelector("#nexusAiClose");
    const messages = document.querySelector("#nexusAiMessages");
    const form = document.querySelector("#nexusAiForm");
    const input = document.querySelector("#nexusAiInput");

   fab.style.cssText = `
  position: fixed !important;
  right: 24px !important;
  bottom: 24px !important;
  z-index: 999999 !important;
  cursor: pointer !important;
  pointer-events: auto !important;
`;

panel.style.cssText = `
  display: none;
  position: fixed !important;
  right: 24px !important;
  bottom: 100px !important;
  width: 380px !important;
  height: 520px !important;
  max-width: calc(100vw - 32px) !important;
  max-height: calc(100vh - 130px) !important;
  flex-direction: column !important;
  background: #111827 !important;
  color: white !important;
  border: 1px solid #334155 !important;
  border-radius: 18px !important;
  box-shadow: 0 20px 50px rgba(0,0,0,.5) !important;
  overflow: hidden !important;
  z-index: 999999 !important;
  pointer-events: auto !important;
`;

    // Hindi na umaasa sa global .hidden class.
    panel.style.display = "none";

    fab.onclick = (event) => {
  event.preventDefault();
  event.stopPropagation();

  const isClosed =
    panel.style.display === "none" ||
    panel.style.display === "";

  panel.style.display = isClosed ? "flex" : "none";
};

    closeButton.addEventListener("click", () => {
      panel.style.display = "none";
    });

    function addMessage(text, type = "bot") {
      const message = document.createElement("div");
      message.className = `ai-msg ${type}`;
      message.textContent = text;
      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
      return message;
    }

    async function askNexusAi(prompt) {
      addMessage(prompt, "user");
      const loading = addMessage("Analyzing workspace...", "bot");

      try {
        if (!window.NexusApi) {
          throw new Error("NexusApi was not loaded.");
        }

        if (!NexusApi.token) {
          await NexusApi.login();
        }

        const response = await NexusApi.ask(prompt);
        loading.textContent =
          response.answer || response.message || JSON.stringify(response);
      } catch (error) {
        loading.textContent =
          "AI request failed: " + error.message;
        console.error("Nexus AI error:", error);
      }
    }

    form.addEventListener("submit", event => {
      event.preventDefault();

      const prompt = input.value.trim();
      if (!prompt) return;

      askNexusAi(prompt);
      input.value = "";
    });

    document.querySelectorAll("[data-ai]").forEach(button => {
      button.addEventListener("click", () => {
        askNexusAi(button.dataset.ai);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeNexusAi);
  } else {
    initializeNexusAi();
  }
})();