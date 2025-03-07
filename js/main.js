// main.js
(async function(){
  const cache = {
    symbols: null,
    candles: {} // key: "symbol_granularity"
  };

  // Initialize WebSocket connection.
  DataManager.init(async () => {
    const storedSymbols = localStorage.getItem("deriv_symbols");
    if (storedSymbols) {
      cache.symbols = JSON.parse(storedSymbols);
      UIManager.log("Loaded cached symbols.");
    } else {
      try {
        const response = await DataManager.sendRequest({ active_symbols: "brief", product_type: "basic" }, "active_symbols");
        if (!response.active_symbols || response.active_symbols.length === 0) {
          UIManager.log("No active symbols received.");
          return;
        }
        cache.symbols = response.active_symbols.map(s => ({
          symbol: s.symbol,
          display_name: s.display_name || s.symbol
        }));
        localStorage.setItem("deriv_symbols", JSON.stringify(cache.symbols));
        UIManager.log("Active symbols loaded and cached.");
      } catch(e) {
        UIManager.log("Error loading active symbols: " + JSON.stringify(e));
      }
    }
    populateSymbolDropdown();
  });
  
  function populateSymbolDropdown(){
    const select = document.getElementById("symbolSelect");
    select.innerHTML = "";
    cache.symbols.forEach(s => {
      const option = document.createElement("option");
      option.value = s.symbol;
      option.text = s.display_name;
      select.appendChild(option);
    });
  }
  
  async function loadHistoricalData(symbol, granularity) {
    const cacheKey = `${symbol}_${granularity}`;
    if(cache.candles[cacheKey]) {
      UIManager.log("Using in-memory cache for " + cacheKey);
      return cache.candles[cacheKey];
    }
    const stored = localStorage.getItem("candles_" + cacheKey);
    if(stored){
      const data = JSON.parse(stored);
      cache.candles[cacheKey] = data;
      UIManager.log("Loaded candle data from localStorage for " + cacheKey);
      return data;
    }
    try {
      const gran = Number(granularity);
      const now = Math.floor(Date.now() / 1000);
      const end = now - (now % gran);
      const start = end - (500 * gran);
      const response = await DataManager.sendRequest({
        ticks_history: symbol,
        granularity: gran,
        style: "candles",
        start: start,
        end: end,
        count: 500
      }, "candles");
      if (!response.candles || response.candles.length === 0) {
        UIManager.log("No candle data received for " + symbol);
        return [];
      }
      const bars = response.candles.map(c => ({
        time: c.epoch,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close
      }));
      cache.candles[cacheKey] = bars;
      localStorage.setItem("candles_" + cacheKey, JSON.stringify(bars));
      UIManager.log("Historical candle data loaded for " + symbol);
      return bars;
    } catch(e) {
      UIManager.log("Error loading historical candles: " + JSON.stringify(e));
      return [];
    }
  }
  
  // Bind UI events.
  document.getElementById("loadDataBtn").addEventListener("click", async () => {
    const symbol = document.getElementById("symbolSelect").value;
    const granularity = document.getElementById("timeframeSelect").value;
    UIManager.log(`Requesting candle data for ${symbol} with granularity ${granularity}`);
    const bars = await loadHistoricalData(symbol, granularity);
    if (bars.length > 0) {
      ChartManager.setData(bars);
      UIManager.log("Chart data updated.");
    } else {
      UIManager.log("No bars available to display.");
    }
  });
  
  document.getElementById("replayBtn").addEventListener("click", async () => {
    const symbol = document.getElementById("symbolSelect").value;
    const granularity = document.getElementById("timeframeSelect").value;
    UIManager.log(`Starting replay for ${symbol} with granularity ${granularity}`);
    const bars = await loadHistoricalData(symbol, granularity);
    if (bars.length > 0) {
      ReplayManager.startReplay(bars);
    } else {
      UIManager.log("No bars available for replay.");
    }
  });
  
  document.getElementById("pauseReplayBtn").addEventListener("click", () => {
    const btn = document.getElementById("pauseReplayBtn");
    if(btn.textContent === "Pause Replay"){
      ReplayManager.pauseReplay();
      btn.textContent = "Resume Replay";
    } else {
      ReplayManager.resumeReplay();
      btn.textContent = "Pause Replay";
    }
  });
  
  document.getElementById("replaySpeed").addEventListener("input", (e) => {
    const speed = e.target.value;
    document.getElementById("speedDisplay").textContent = speed;
    ReplayManager.setSpeed(Number(speed));
  });
  
  document.getElementById("scrubSlider").addEventListener("input", (e) => {
    const percent = e.target.value;
    ReplayManager.scrub(Number(percent));
  });
  
  document.getElementById("toggleLiveBtn").addEventListener("click", () => {
    const symbol = document.getElementById("symbolSelect").value;
    const granularity = document.getElementById("timeframeSelect").value;
    const btn = document.getElementById("toggleLiveBtn");
    if(LiveManager.isLive()){
      LiveManager.stopLive();
      btn.textContent = "Enable Live Updates";
    } else {
      LiveManager.startLive(symbol, granularity);
      btn.textContent = "Disable Live Updates";
    }
  });
  
  document.getElementById("drawTrendlineBtn").addEventListener("click", () => {
    DrawingTools.toggleTool("trendline");
  });
  
  document.getElementById("drawFibBtn").addEventListener("click", () => {
    DrawingTools.toggleTool("fib");
  });
  
  document.getElementById("clearDrawingsBtn").addEventListener("click", () => {
    DrawingTools.clearDrawings();
  });
  
  document.getElementById("toggleLogBtn").addEventListener("click", () => {
    UIManager.toggleLog();
  });
  
  window.addEventListener("resize", ChartManager.resize);
})();
