import { useState } from "react";
import { useParts } from "../context/PartContext";

const WeightPage = () => {
  const {
    motors,
    escs,
    propellers,
    selectedMotor,
    setSelectedMotor,
    selectedEsc,
    setSelectedEsc,
    selectedPropeller,
    setSelectedPropeller,
    otherWeights,
    updateOtherWeight,
    propulsionWeight,
    totalWeight,
    loading,
  } = useParts();

  const [displayTotal, setDisplayTotal] = useState(null);

  if (loading) return <div>Loading...</div>;

  const parts = Object.keys(otherWeights);

  const handleCalculate = () => {
    setDisplayTotal(totalWeight.toFixed(2));
  };

  const getWeight = (data, name, key) => {
    const item = data.find((i) => i.Name === name);
    return item ? parseFloat(item[key]) || 0 : 0;
  };

  const motorWeight = getWeight(motors, selectedMotor, "Weight (g)");
  const escWeight = getWeight(escs, selectedEsc, "Weight (g)");
  const propellerWeight = getWeight(propellers, selectedPropeller, "Weight_g");

  return (
    <div className="weight-container">
      <div id="part-picker">
        <h2>Part Picker</h2>

        <div className="part-group">
          <label htmlFor="motor-select">Motor:</label>
          <select
            id="motor-select"
            value={selectedMotor}
            onChange={(e) => setSelectedMotor(e.target.value)}
          >
            {motors.map((m) => (
              <option key={m.Name} value={m.Name}>{m.Name}</option>
            ))}
          </select>
          <div className="weight-badge">
            <strong>Weight:</strong> {motorWeight.toFixed(2)}g
          </div>
        </div>

        <div className="part-group">
          <label htmlFor="esc-select">ESC (Electronic Speed Controller):</label>
          <select
            id="esc-select"
            value={selectedEsc}
            onChange={(e) => setSelectedEsc(e.target.value)}
          >
            {escs.map((e) => (
              <option key={e.Name} value={e.Name}>{e.Name}</option>
            ))}
          </select>
          <div className="weight-badge">
            <strong>Weight:</strong> {escWeight.toFixed(2)}g
          </div>
        </div>

        <div className="part-group">
          <label htmlFor="propeller-select">Propeller:</label>
          <select
            id="propeller-select"
            value={selectedPropeller}
            onChange={(e) => setSelectedPropeller(e.target.value)}
          >
            {propellers.map((p) => (
              <option key={p.Name} value={p.Name}>{p.Name}</option>
            ))}
          </select>
          <div className="weight-badge">
            <strong>Weight:</strong> {propellerWeight.toFixed(2)}g
          </div>
        </div>
      </div>

      <div id="weight-calculator" style={{ marginTop: "2em" }}>
        <h2>Component Weights (in grams)</h2>

        <div id="weight-inputs">
          {parts.map((part) => (
            <div key={part} className="weight-input-group">
              <label htmlFor={`${part}-weight`}>{part} Weight (g):</label>
              <input
                id={`${part}-weight`}
                type="number"
                value={otherWeights[part]}
                onChange={(e) => updateOtherWeight(part, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button
          id="calculate-weight"
          onClick={handleCalculate}
          style={{
            width: "100%",
            padding: "1em",
            backgroundColor: "var(--accent-color)",
            color: "white",
            border: "none",
            fontWeight: "700",
            cursor: "pointer",
            textTransform: "uppercase",
            marginTop: "1em",
          }}
        >
          Calculate Total Weight
        </button>

        {displayTotal !== null && (
          <div
            className="total-estimated-weight"
            style={{ marginTop: "1.5em", fontSize: "1.2em", fontWeight: "700" }}
          >
            Total Estimated Weight: {displayTotal}g
          </div>
        )}

        <div style={{ marginTop: "1em", fontSize: "0.9em", color: "#666" }}>
          * Propulsion weight ({propulsionWeight.toFixed(2)}g) is automatically
          included in the calculation.
        </div>
      </div>
    </div>
  );
};

export default WeightPage;
