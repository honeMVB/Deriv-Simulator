# Trading Simulator

This project is a base for a full-fledged Synthetic Indices trading simulator that connects to the Deriv API via WebSockets, retrieves historical market data (candles), and displays it using TradingView’s Lightweight Charts. It includes features such as replaying historical data, live updates, and basic drawing tools (trendline and Fibonacci retracement). The code is modular, making it easier to extend into a full trading simulator.

## Features

- **Modular Structure:**  
  - **DataManager:** Manages the WebSocket connection and sends API requests.
  - **ChartManager:** Creates and updates a candlestick chart using Lightweight Charts.
  - **ReplayManager:** Replays cached historical candle data with adjustable speed, pause/resume, and scrubbing controls.
  - **LiveManager:** Provides live updates by periodically fetching the latest candle data.
  - **DrawingTools:** Implements basic drawing tools (trendline and Fibonacci) using an SVG overlay.
  - **UIManager:** Handles logging to both the console and an on-screen log panel.

- **User Controls:**  
  - Choose symbols and timeframes.
  - Load historical data (cached locally).
  - Replay historical data as a simulation.
  - Toggle live updates.
  - Draw and customize basic drawing tools.
  - Log panel for debugging and error tracking.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/honeMVB/trading-simulator.git
   cd trading-simulator

2. **Install Dependencies:**

    This project is fully client-side and loads Lightweight Charts from a CDN. However, you need to create a configuration file for sensitive API credentials.

3. **Configuration:**

    Create a file named js/config.js (see the sample in the code) and add your API credentials:

        const CONFIG = {
            appId: YOUR_APP_ID,
            token: "YOUR_API_TOKEN"
         };

4. **Open the Application:**

    Open index.html in your browser.

    
    
    
## Usage

### Load Data:
Select a symbol and timeframe, then click **Load Data** to retrieve historical candle data. The data is cached locally so that subsequent requests do not hit the API again.

### Replay:
Click **Start Replay** to simulate the market by replaying the historical data. You can pause/resume the replay and adjust the speed using the provided controls. The scrub slider lets you view a subset of the data.

### Live Updates:
Toggle **Enable Live Updates** to receive new candle data (if available) without refreshing the historical cache.

### Drawing Tools:
Use **Draw Trendline** or **Draw Fibonacci** to enable a basic drawing mode on the chart. Click **Clear Drawings** to remove all drawn elements.

## Future Upgrades

- **Advanced Order Simulation:** Integrate order entry, execution simulation, and portfolio management.
- **Strategy Backtesting:** Expand the replay module to support strategy backtesting with performance metrics.
- **Improved Live Data Feed:** Integrate a robust tick-stream subscription for real-time data.
- **Enhanced Drawing Tools:** Add more drawing tools (channels, support/resistance, etc.) with customization options.
- **User Authentication:** Implement user accounts to save custom chart layouts and simulation settings.
- **Responsive Design:** Improve UI responsiveness for mobile and tablet devices.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Deriv API Documentation](https://deriv-com.github.io/deriv-api/)
- [TradingView Lightweight Charts](https://tradingview.github.io/lightweight-charts/)

---

### Final Notes

This project base is designed to be a starting point for a full-fledged trading simulator. It abstracts the connection, charting, replay, live updates, and drawing tools into modular files so that you can extend or replace components as needed. The README provides an overview and a roadmap for future upgrades.

You can now publish this project on GitHub (after ensuring your config file is not tracked) and share it with the community. Feel free to fork, contribute, or open issues if you have suggestions or enhancements!
