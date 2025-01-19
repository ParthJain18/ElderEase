import "./map.css";

const MapButton = ({ handleClick, children }) => {
  return (
    <button onClick={handleClick} className="app-button">
      {children}
    </button>
  );
};

export default MapButton