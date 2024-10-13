import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, Rect, Arrow, Circle, Text } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import styles from "./whiteboard.module.css"

interface LineData {
  points: number[];
  stroke?: string;
  strokeWidth?: number;
  tool?: string;
  text?: string;
}

interface WhiteboardProps {
  websocketUrl: string;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ websocketUrl }) => {
  const [lines, setLines] = useState<LineData[]>([]);
  const [tool, setTool] = useState<string>("line");
  const [strokeColor, setStrokeColor] = useState<string>("#000000");
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [textInput, setTextInput] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const wsRef = React.useRef<WebSocket | null>(null);
  const isDrawing = useRef(false);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Create a WebSocket connection if it doesn't already exist
    const socket = new WebSocket(websocketUrl);
    wsRef.current = socket; // Keep a reference to the WebSocket

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      console.log("Message received:", event.data);
      const message = JSON.parse(event.data);
      setLines((prevLines) => [...prevLines, message]);
    };

    socket.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    socket.onclose = (event) => {
      console.log(`WebSocket closed: ${event.code} - ${event.reason}`);
      setWs(null); // Clear the WebSocket instance on close
    };
    setWs(socket);

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    startPointRef.current = { x: pos.x, y: pos.y };

    if (tool === "line" || tool === "eraser") {
      // Start a new line (or eraser path)
      setLines((prevLines) => [
        ...prevLines,
        { points: [pos.x, pos.y], stroke: strokeColor, strokeWidth, tool },
      ]);
    } else if (tool === "text") {
      // Handle text input
      const textLine: LineData = {
        points: [pos.x, pos.y, pos.x, pos.y],
        stroke: strokeColor,
        strokeWidth,
        tool,
        text: textInput,
      };

      setLines((prevLines) => [...prevLines, textLine]);
      // Reset the text input
      setTextInput("");
    } else {
      // Add shape (square, circle, arrow, triangle) with initial point
      setLines((prevLines) => [
        ...prevLines,
        {
          points: [pos.x, pos.y, pos.x, pos.y],
          stroke: strokeColor,
          strokeWidth,
          tool,
        },
      ]);
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current || !startPointRef.current) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const point = stage.getPointerPosition();
    if (!point) return;

    const { x, y } = startPointRef.current;

    // Update the current drawing element dynamically
    if (tool === "line" || tool === "eraser") {
      // For line or eraser, we need to keep adding points while dragging
      setLines((prevLines) => {
        const lastLine = prevLines[prevLines.length - 1];
        const newPoints = lastLine.points.concat([point.x, point.y]);

        const updatedLines = [...prevLines];
        updatedLines[updatedLines.length - 1] = {
          ...lastLine,
          points: newPoints,
        };

        return updatedLines;
      });
    } else {
      // For shapes, update the second point dynamically while dragging
      setLines((prevLines) => {
        const lastShape = prevLines[prevLines.length - 1];
        const updatedLines = [...prevLines];
        updatedLines[updatedLines.length - 1] = {
          ...lastShape,
          points: [x, y, point.x, point.y],
        };

        return updatedLines;
      });
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;

    console.log(lines.length);

    if (lines.length > 0) {
      const lastLine = lines[lines.length - 1];
      console.log("Sending data:", JSON.stringify(lastLine));
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(lastLine));
      } else {
        console.error("WebSocket is not open, cannot send message");
      }
    }

    startPointRef.current = null;
  };

  const renderShape = (line: LineData, i: number) => {
    const [x1, y1, x2, y2] = line.points;

    switch (line.tool) {
      case "line":
      case "eraser":
        return (
          <Line
            key={i}
            points={line.points}
            stroke={line.stroke}
            strokeWidth={line.strokeWidth}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation={
              line.tool === "eraser" ? "destination-out" : "source-over"
            }
          />
        );
      case "square":
        return (
          <Rect
            key={i}
            x={Math.min(x1, x2)}
            y={Math.min(y1, y2)}
            width={Math.abs(x2 - x1)}
            height={Math.abs(y2 - y1)}
            stroke={line.stroke}
            strokeWidth={line.strokeWidth}
          />
        );
      case "circle":
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        return (
          <Circle
            key={i}
            x={x1}
            y={y1}
            radius={radius}
            stroke={line.stroke}
            strokeWidth={line.strokeWidth}
          />
        );
      case "arrow":
        return (
          <Arrow
            key={i}
            points={[x1, y1, x2, y2]}
            stroke={line.stroke}
            strokeWidth={line.strokeWidth}
          />
        );
      case "triangle":
        const trianglePoints = [x1, y2, x2, y2, (x1 + x2) / 2, y1]; 
        return (
          <Line
            key={i}
            points={trianglePoints}
            closed
            stroke={line.stroke}
            strokeWidth={line.strokeWidth}
          />
        );
      case "text":
        return (
          <Text
            key={i}
            text={line.text || ""}
            x={x1}
            y={y1}
            fontSize={24}
            fill={line.stroke}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.whiteboard_container}>
      <h1 className={styles.whiteboard_PageTitle}>[WBNAME] Whiteboard</h1>

      {/* ToolBar */}
      <div className={styles.whiteboard_toolbar}>
        <button className={styles.whiteboard_Toolbar_Button} onClick={() => setTool("line")}>Line</button>
        <button className={styles.whiteboard_Toolbar_Button} onClick={() => setTool("square")}>Square</button>
        <button className={styles.whiteboard_Toolbar_Button} onClick={() => setTool("triangle")}>Triangle</button>
        <button className={styles.whiteboard_Toolbar_Button} onClick={() => setTool("circle")}>Circle</button>
        <button className={styles.whiteboard_Toolbar_Button} onClick={() => setTool("arrow")}>Arrow</button>
        <button className={styles.whiteboard_Toolbar_Button} onClick={() => setTool("eraser")}>Eraser</button>
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => setStrokeColor(e.target.value)}
          className={styles.whiteboard_Toolbar_Colorpicker}
        />

        <select
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          className={styles.whiteboard_Toolbar_Strokesize}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <button className={styles.whiteboard_Toolbar_Button} onClick={() => setTool("text")}>Text</button>
        {tool === "text" && (
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text"
            className={styles.whiteboard_Toolbar_textinput}
          />
        )}
      </div>

      <Stage
        className={styles.whiteboard_Draw_Area}
        height={window.innerHeight -138}
        width={window.innerWidth - 100}
        style={{
          border: "1px solid white",
          backgroundColor: "#181618"
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>{lines.map((line, i) => renderShape(line, i))}</Layer>
      </Stage>
    </div>
  );
};
export default Whiteboard;
