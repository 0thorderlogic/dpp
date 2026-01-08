import { useState, useMemo } from "react";
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
    selectedMotorObj,
    selectedEscObj,
    selectedPropellerObj,
    otherWeights,
    updateOtherWeight,
    propulsionWeight,
    totalWeight,
    config,
    loading,
  } = useParts();

  const [displayTotal, setDisplayTotal] = useState(null);

  const performanceInsights = useMemo(() => {
    // Basic TWR calculation for the Weight page
    const motorThrust = config.useActualThrustData 
      ? config.motorThrust100 
      : (parseFloat(selectedMotorObj["Kv value (rpm/v)"]) * config.batteryCells * 3.7 * 0.01); // Very rough estimate for display
    
    // We'll use the calculator logic simplified
    let estThrust = 0;
    if (config.useActualThrustData) {
      estThrust = config.motorThrust100 * config.motorCount;
    } else {
      const rpm = (parseFloat(selectedMotorObj["Kv value (rpm/v)"]) || 2300) * config.batteryCells * 3.7;
      const propSize = parseFloat(selectedPropellerObj["Diameter_in"]) || 5;
      const propPitch = parseFloat(selectedPropellerObj["Pitch_in"]) || 4.3;
      estThrust = (rpm * rpm / 1000000 * propSize * propSize * propPitch * 0.00000015) * config.motorCount;
    }
    
    const twr = estThrust / totalWeight;
    return { twr, estThrust };
  }, [config, selectedMotorObj, selectedPropellerObj, totalWeight]);

  if (loading) return <div className="container">Loading components...</div>;

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
    <div className="weight-container" style={{ paddingBottom: '2em' }}>
      <div className="banner" style={{ marginBottom: '2em' }}>
        <span className="banner-title">
          Sync Active
        </span>
        <p style={{ margin: 0, fontSize: "0.9em" }}>
          Selected parts and weights are automatically sent to the <strong>Performance Calculator</strong>.
        </p>
      </div>

      <div className="calculator-container">
        <div id="part-picker" className="inputs-section">
          <h3>Part Picker</h3>

          <div className="part-group" style={{ marginBottom: '1.5em' }}>
            <label htmlFor="motor-select">Main Motor:</label>
            <select
              id="motor-select"
              value={selectedMotor}
              onChange={(e) => setSelectedMotor(e.target.value)}
              style={{ width: '100%', padding: '0.8em', marginBottom: '0.5em' }}
            >
              {motors.map((m) => (
                <option key={m.Name} value={m.Name}>{m.Name}</option>
              ))}
            </select>
            <div className="weight-badge" style={{ fontSize: '0.9em', opacity: 0.8 }}>
              <strong>Per Motor:</strong> {motorWeight.toFixed(2)}g | <strong>Total (x{config.motorCount}):</strong> {(motorWeight * config.motorCount).toFixed(1)}g
            </div>
          </div>

          <div className="part-group" style={{ marginBottom: '1.5em' }}>
            <label htmlFor="esc-select">ESC (Speed Controller):</label>
            <select
              id="esc-select"
              value={selectedEsc}
              onChange={(e) => setSelectedEsc(e.target.value)}
              style={{ width: '100%', padding: '0.8em', marginBottom: '0.5em' }}
            >
              {escs.map((e) => (
                <option key={e.Name} value={e.Name}>{e.Name}</option>
              ))}
            </select>
            <div className="weight-badge" style={{ fontSize: '0.9em', opacity: 0.8 }}>
              <strong>Per ESC:</strong> {escWeight.toFixed(2)}g | <strong>Total (x{config.escCount}):</strong> {(escWeight * config.escCount).toFixed(1)}g
            </div>
          </div>

          <div className="part-group" style={{ marginBottom: '1.5em' }}>
            <label htmlFor="propeller-select">Propeller:</label>
            <select
              id="propeller-select"
              value={selectedPropeller}
              onChange={(e) => setSelectedPropeller(e.target.value)}
              style={{ width: '100%', padding: '0.8em', marginBottom: '0.5em' }}
            >
              {propellers.map((p) => (
                <option key={p.Name} value={p.Name}>{p.Name}</option>
              ))}
            </select>
            <div className="weight-badge" style={{ fontSize: '0.9em', opacity: 0.8 }}>
              <strong>Per Blade:</strong> {propellerWeight.toFixed(2)}g | <strong>Total (x{config.motorCount}):</strong> {(propellerWeight * config.motorCount).toFixed(1)}g
            </div>
          </div>

          <div className="info-box" style={{ marginTop: '2em' }}>
             <h4>Performance Preview</h4>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5em' }}>
                <span>Est. Max Thrust:</span>
                <strong>{performanceInsights.estThrust.toFixed(0)}g</strong>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Thrust-to-Weight:</span>
                <strong style={{ color: performanceInsights.twr >= 5 ? '#4CAF50' : 'inherit' }}>
                  {performanceInsights.twr.toFixed(2)}:1
                </strong>
             </div>
          </div>
        </div>

        <div id="weight-calculator" className="results-section" style={{ padding: '1.5em' }}>
          <h3>Component Weights (g)</h3>

          <div id="weight-inputs" className="weight-inputs-grid">
            {parts.map((part) => (
              <div key={part} className="weight-input-group">
                <label htmlFor={`${part}-weight`} style={{ fontSize: '0.85em', display: 'block', marginBottom: '0.3em' }}>{part}:</label>
                <input
                  id={`${part}-weight`}
                  type="number"
                  value={otherWeights[part]}
                  onChange={(e) => updateOtherWeight(part, e.target.value)}
                  style={{ width: '100%', padding: '0.5em' }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2em', padding: '1.5em', backgroundColor: 'var(--secondary-background-color)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1em' }}>
                <span>Propulsion Total:</span>
                <span>{propulsionWeight.toFixed(1)}g</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1em' }}>
                <span>Other Parts Total:</span>
                <span>{(totalWeight - propulsionWeight).toFixed(1)}g</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4em', fontWeight: 'bold', borderTop: '2px solid var(--border-color)', paddingTop: '0.5em' }}>
                <span>TOTAL WEIGHT:</span>
                <span style={{ color: 'var(--accent-color)' }}>{totalWeight.toFixed(1)}g</span>
              </div>
          </div>
          
          <p style={{ marginTop: '1em', fontSize: '0.8em', opacity: 0.6 }}>
            * Propeller weight is included per motor count. Weights are in grams.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeightPage;
