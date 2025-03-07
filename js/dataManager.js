// dataManager.js
const DataManager = (function(){
  let ws;
  function init(callback) {
    const wsUrl = `wss://ws.binaryws.com/websockets/v3?app_id=${CONFIG.appId}&token=${CONFIG.token}`;
    ws = new WebSocket(wsUrl);
    ws.addEventListener("open", () => {
      UIManager.log("WebSocket connection opened.");
      if(callback) callback();
    });
    ws.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        UIManager.log("Received: " + JSON.stringify(data));
      } catch (e) {
        UIManager.log("Non-JSON message received.");
      }
    });
  }
  function sendRequest(request, expectedMsgType) {
    return new Promise((resolve, reject) => {
      request.req_id = Math.floor(Math.random() * 1000000);
      UIManager.log("Sending request: " + JSON.stringify(request));
      ws.send(JSON.stringify(request));
      const handler = (event) => {
        let data;
        try {
          data = JSON.parse(event.data);
        } catch(err) { return; }
        UIManager.log("Handler received: " + JSON.stringify(data));
        if (data.msg_type === expectedMsgType) {
          ws.removeEventListener("message", handler);
          resolve(data);
        }
        if (data.msg_type === "error") {
          ws.removeEventListener("message", handler);
          reject(data.error);
        }
      };
      ws.addEventListener("message", handler);
    });
  }
  return { init, sendRequest, getWebSocket: () => ws };
})();
