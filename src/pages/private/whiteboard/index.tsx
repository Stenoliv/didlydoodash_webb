import Whiteboard from "@/components/whiteboard/WhiteboardArea";

export default function WhiteboardPage() {
  return (
    <div style={styles.mainArea}>
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
