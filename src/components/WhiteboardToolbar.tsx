import React from "react";

// Define types for the ToolbarProps
interface ToolbarProps {
  onSelect: () => void;
  onBrush: () => void;
  onEraser: () => void;
  onRectangle: () => void;
  onCircle: () => void;
  onColorChange: (color: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onSelect,
  onBrush,
  onEraser,
  onRectangle,
  onCircle,
  onColorChange,
}) => {
  return (
    <div style={styles.toolbar}>
      <button onClick={onSelect} style={styles.toolButton}>
        🖊️ Select
      </button>
      <button onClick={onBrush} style={styles.toolButton}>
        🎨 Brush
      </button>
      <button onClick={onEraser} style={styles.toolButton}>
        🧹 Eraser
      </button>
      <button onClick={onRectangle} style={styles.toolButton}>
        ◼️ Rectangle
      </button>
      <button onClick={onCircle} style={styles.toolButton}>
        ⚪ Circle
      </button>
      <input
        type="color"
        onChange={(e) => onColorChange(e.target.value)}
        style={styles.colorPicker}
      />
    </div>
  );
};

// Define styles
const styles = {
  toolbar: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#215388",
    borderBottom: "2px solid #ccc",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  toolButton: {
    margin: "0 10px",
    padding: "10px 15px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    backgroundColor: "#d2e3c9",
    borderRadius: "5px",
    transition: "background-color 0.3s",
    color: "#000000",
  },
  toolButtonHover: {
    backgroundColor: "#d3d3d3",
  },
  colorPicker: {
    marginLeft: "auto",
  },
};

export default Toolbar;
