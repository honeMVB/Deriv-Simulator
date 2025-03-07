// uiManager.js
const UIManager = (function(){
  const logPanel = document.getElementById("logPanel");
  function log(message) {
    const time = new Date().toLocaleTimeString();
    const p = document.createElement("p");
    p.textContent = `[${time}] ${message}`;
    logPanel.appendChild(p);
    logPanel.scrollTop = logPanel.scrollHeight;
    console.log(message);
  }
  function toggleLog() {
    logPanel.classList.toggle("collapsed");
  }
  return { log, toggleLog };
})();
