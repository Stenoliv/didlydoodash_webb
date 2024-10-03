import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";

interface LineData {
  points: number[];
  stroke?: string;
  strokeWidth?: number;
  tool?: string;
}

interface WhiteboardProps {
  websocketUrl: string;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ websocketUrl }) => {
  const [lines, setLines] = useState<LineData[]>([]);
  const isDrawing = useRef(false);
  const ws = useRef<WebSocket | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Create WebSocket connection
    ws.current = new WebSocket(websocketUrl);
    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };
    ws.current.onmessage = (event: MessageEvent) => {
      const message: LineData = JSON.parse(event.data);
      setLines((prevLines) => [...prevLines, message]);
    };
    return () => {
      ws.current?.close();
    };
  }, [websocketUrl]);

  useEffect(() => {
    const updateDimensions = () => {
      if (stageRef.current) {
        setDimensions({
          width: stageRef.current.clientWidth,
          height: stageRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    setLines((prevLines) => [
      ...prevLines,
      { points: [pos.x, pos.y], stroke: "black", strokeWidth: 2 },
    ]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current || lines.length === 0) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const point = stage.getPointerPosition();
    if (!point) return;

    const lastLine = lines[lines.length - 1];
    if (!lastLine || !lastLine.points) return;

    const newPoints = lastLine.points.concat([point.x, point.y]);
    const updatedLines = [...lines];
    updatedLines[updatedLines.length - 1] = {
      ...lastLine,
      points: newPoints,
    };

    setLines(updatedLines);
    ws.current?.send(JSON.stringify(updatedLines[updatedLines.length - 1]));
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        ref={stageRef}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#ccc",
        }}
      >
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {lines.map((line, i) => (
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
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Whiteboard;
