// liveManager.js
const LiveManager = (function(){
  let liveInterval;
  let liveMode = false;
  function startLive(symbol, granularity) {
    liveMode = true;
    UIManager.log("Live updates enabled.");
    liveInterval = setInterval(async () => {
      try {
        const req = {
          ticks_history: symbol,
          granularity: Number(granularity),
          style: "candles",
          end: "latest",
          count: 1
        };
        const response = await DataManager.sendRequest(req, "candles");
        if (response.candles && response.candles.length > 0) {
          const newCandle = response.candles[0];
          const lastTime = ChartManager.getLastTime();
          if (!lastTime || newCandle.epoch > lastTime) {
            ChartManager.updateData({
              time: newCandle.epoch,
              open: newCandle.open,
              high: newCandle.high,
              low: newCandle.low,
              close: newCandle.close
            });
            ChartManager.setLastTime(newCandle.epoch);
            UIManager.log("Live update: new candle added.");
          }
        }
      } catch(e) {
        // If error object is empty, ignore it.
        if (Object.keys(e).length === 0) {
          UIManager.log("Live update: empty error ignored.");
        } else {
          UIManager.log("Error in live update: " + JSON.stringify(e));
        }
      }
    }, 3000);
  }
  function stopLive() {
    liveMode = false;
    clearInterval(liveInterval);
    UIManager.log("Live updates disabled.");
  }
  function isLive() { return liveMode; }
  return { startLive, stopLive, isLive };
})();
