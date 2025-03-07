// drawingTools.js
const DrawingTools = (function(){
  const drawingLayer = document.getElementById("drawingLayer");
  let activeTool = null; // "trendline", "fib", etc.
  let currentElement = null;
  function clearDrawings() {
    while(drawingLayer.firstChild){
      drawingLayer.removeChild(drawingLayer.firstChild);
    }
    UIManager.log("All drawings cleared.");
  }
  function enableTool(tool) {
    activeTool = tool;
    drawingLayer.classList.add("active");
    UIManager.log(tool + " drawing enabled.");
  }
  function disableTool() {
    activeTool = null;
    drawingLayer.classList.remove("active");
    UIManager.log("Drawing tool disabled.");
  }
  function toggleTool(tool) {
    if (activeTool === tool) {
      disableTool();
    } else {
      disableTool();
      enableTool(tool);
    }
  }
  function createLine(x1, y1, x2, y2) {
    const svgns = "http://www.w3.org/2000/svg";
    const line = document.createElementNS(svgns, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", activeTool === "fib" ? "blue" : "red");
    line.setAttribute("stroke-width", "2");
    return line;
  }
  drawingLayer.addEventListener("mousedown", (e) => {
    if (!activeTool) return;
    const rect = drawingLayer.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    currentElement = createLine(startX, startY, startX, startY);
    drawingLayer.appendChild(currentElement);
    function onMouseMove(ev) {
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      currentElement.setAttribute("x2", x);
      currentElement.setAttribute("y2", y);
    }
    function onMouseUp(ev) {
      drawingLayer.removeEventListener("mousemove", onMouseMove);
      drawingLayer.removeEventListener("mouseup", onMouseUp);
      currentElement = null;
    }
    drawingLayer.addEventListener("mousemove", onMouseMove);
    drawingLayer.addEventListener("mouseup", onMouseUp);
  });
  return { toggleTool, clearDrawings };
})();
