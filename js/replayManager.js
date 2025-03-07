// replayManager.js
const ReplayManager = (function(){
  let replayInterval;
  let currentIndex = 0;
  let data = [];
  let speed = 500; // default replay speed in ms
  let paused = false;
  function startReplay(candleData) {
    if (!candleData || candleData.length === 0) {
      UIManager.log("No data to replay.");
      return;
    }
    data = candleData;
    currentIndex = 0;
    ChartManager.clear();
    UIManager.log("Replay started.");
    replayInterval = setInterval(() => {
      if (!paused) {
        if (currentIndex >= data.length) {
          stopReplay();
          return;
        }
        ChartManager.updateData(data[currentIndex]);
        ChartManager.setLastTime(data[currentIndex].time);
        currentIndex++;
      }
    }, speed);
  }
  function stopReplay() {
    clearInterval(replayInterval);
    UIManager.log("Replay stopped.");
  }
  function pauseReplay() {
    paused = true;
    UIManager.log("Replay paused.");
  }
  function resumeReplay() {
    paused = false;
    UIManager.log("Replay resumed.");
  }
  function setSpeed(newSpeed) {
    speed = newSpeed;
    UIManager.log("Replay speed set to " + speed + " ms.");
  }
  function scrub(indexPercent) {
    if (data.length === 0) return;
    const index = Math.floor((indexPercent / 100) * data.length);
    ChartManager.setData(data.slice(0, index));
    UIManager.log("Scrubbed to " + indexPercent + "% (" + index + " data points).");
  }
  return { startReplay, stopReplay, pauseReplay, resumeReplay, setSpeed, scrub };
})();
