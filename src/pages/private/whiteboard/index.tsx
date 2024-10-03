import Toolbar from "@/components/WhiteboardToolbar";
import Whiteboard from "@/components/WhiteboardArea";

export default function WhiteboardPage() {
  return (
    <div style={styles.mainArea}>
      <Toolbar
        onSelect={() => console.log("Select tool")}
        onBrush={() => console.log("Brush tool")}
        onEraser={() => console.log("Eraser tool")}
        onRectangle={() => console.log("Rectangle tool")}
        onCircle={() => console.log("Circle tool")}
        onColorChange={(color) => console.log("Color changed to:", color)}
      />
      <div style={styles.canvas}>
        {/* This is where you can draw */}
        <Whiteboard websocketUrl="ws://localhost:8000/ws" />
      </div>
    </div>
  );
}

// Simple styles for the canvas
const styles: { canvas: React.CSSProperties; mainArea: React.CSSProperties } = {
  canvas: {
    position: "relative",
    display: "flex",
    flexGrow: "1",
    justifyContent: "center",
    alignItems: "center",
  },
  mainArea: {
    display: "flex",
    flexGrow: "1",
    flexDirection: "column",
  },
};
