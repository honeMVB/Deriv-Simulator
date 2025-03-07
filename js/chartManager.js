// chartManager.js
const ChartManager = (function(){
  const chartContainer = document.getElementById("chart");
  const chart = LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: chartContainer.clientHeight,
    layout: { backgroundColor: '#ffffff' },
    timeScale: { timeVisible: true, secondsVisible: false }
  });
  let candleSeries;
  if (typeof chart.addCandlestickSeries === 'function') {
    candleSeries = chart.addCandlestickSeries();
  } else {
    UIManager.log("addCandlestickSeries not available; using fallback.");
    candleSeries = chart.addSeries(LightweightCharts.CandlestickSeries);
  }
  return {
    setData: (data) => { candleSeries.setData(data); },
    updateData: (point) => { candleSeries.update(point); },
    clear: () => { candleSeries.setData([]); },
    getLastTime: () => candleSeries._lastTime || null,
    setLastTime: (time) => { candleSeries._lastTime = time; },
    getChart: () => chart,
    resize: () => {
      chart.applyOptions({
        width: chartContainer.clientWidth,
        height: chartContainer.clientHeight,
      });
    }
  };
})();
