(function() {
  // Prevent double injection
  if (document.getElementById("custom-loading-overlay")) return;

  // --- Loader Setup ---
  const ringScript = document.createElement("script");
  ringScript.type = "module";
  ringScript.src = "https://cdn.jsdelivr.net/npm/ldrs/dist/auto/ring.js";
  document.head.appendChild(ringScript);

  const style = document.createElement("style");
  style.textContent = `
    body.loading { overflow: hidden; }
    #custom-loading-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      backdrop-filter: blur(8px);
      background: linear-gradient(180deg, rgba(50, 50, 50, 0.5), rgba(0, 0, 0, 0)), center/cover no-repeat;
      display: flex; justify-content: center; align-items: center;
      z-index: 999999;
      opacity: 1;
      transition: opacity 0.6s ease;
    }
    #custom-loading-overlay.fade-out {
      opacity: 0;
      pointer-events: none;
    }
    #custom-error-box {
      display: none; 
      position: fixed;
      bottom: 10px; right: 10px;
      width: 300px; max-height: 40vh;
      overflow-y: auto;
      background: rgba(30,30,30,0.5);
      backdrop-filter: blur(8px);
      border-radius: 8px;
      padding: 10px;
      font-size: 12px;
      color: var(--txt-light);
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 1000000;
    }
    #custom-error-box h4 {
      margin: 0 0 5px 0;
      font-size: 13px;
      color: var(--red);
    }
    #custom-error-box ul {
      margin: 0; padding-left: 16px;
    }
    #custom-error-box li {
      margin-bottom: 4px;
      word-wrap: break-word;
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "custom-loading-overlay";
  overlay.innerHTML = `<l-ring size="60" stroke="6" bg-opacity="0" speed="2" color="black"></l-ring>`;
  document.body.classList.add("loading");
  document.body.appendChild(overlay);

  const errorBox = document.createElement("div");
  errorBox.id = "custom-error-box";
  errorBox.innerHTML = "<h4>Errors:</h4><ul id='custom-error-list'></ul>";
  document.body.appendChild(errorBox);
  const errorList = errorBox.querySelector("#custom-error-list");

  function addError(msg) {
    errorBox.style.display = "block"; // show box if hidden
    const li = document.createElement("li");
    li.textContent = msg;
    errorList.appendChild(li);
  }

  // --- Error Tracking ---
  window.addEventListener("error", function(e) {
    addError(`JS Error: ${e.message} at ${e.filename}:${e.lineno}`);
  });

  window.addEventListener("unhandledrejection", function(e) {
    addError(`Unhandled Promise: ${e.reason}`);
  });

  // Monkey-patch fetch
  const origFetch = window.fetch;
  window.fetch = async function(...args) {
    try {
      const res = await origFetch.apply(this, args);
      if (!res.ok) {
        addError(`Fetch failed: ${args[0]} [${res.status}]`);
      }
      return res;
    } catch (err) {
      addError(`Fetch error: ${args[0]} (${err})`);
      throw err;
    }
  };

  // Monkey-patch XHR
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    this.addEventListener("error", () => addError(`XHR error: ${url}`));
    this.addEventListener("abort", () => addError(`XHR aborted: ${url}`));
    this.addEventListener("load", () => {
      if (this.status < 200 || this.status >= 300) {
        addError(`XHR failed: ${url} [${this.status}]`);
      }
    });
    return origOpen.call(this, method, url, ...rest);
  };

  // --- Loader Hide Logic ---
  const MIN_TIME = 500; // 0.5s minimum
  const start = Date.now();

  function hideOverlay() {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, MIN_TIME - elapsed);
    setTimeout(() => {
      overlay.classList.add("fade-out");
      document.body.classList.remove("loading");
      setTimeout(() => overlay.remove(), 600); // match transition
    }, remaining);
  }

  if (document.readyState === "complete") {
    hideOverlay();
  } else {
    window.addEventListener("load", hideOverlay);
  }
})();
