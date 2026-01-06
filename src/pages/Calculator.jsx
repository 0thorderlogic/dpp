import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useParts } from "../context/PartContext";

const Calculator = () => {
  const {
    selectedMotorObj,
    selectedEscObj,
    selectedPropellerObj,
    otherWeights,
    updateOtherWeight,
    config,
    updateConfig,
    totalWeight: sharedTotalWeight,
    loading
  } = useParts();

  const components = useMemo(() => {
    return {
      motorCount: config.motorCount,
      motorWeight: parseFloat(selectedMotorObj["Weight (g)"]) || 28,
      motorKV: parseFloat(selectedMotorObj["Kv value (rpm/v)"]) || 2300,
      motorMaxCurrent: parseFloat(selectedEscObj["Max_current_A"]) || 30,
      motorThrust100: config.motorThrust100,
      useActualThrustData: config.useActualThrustData,
      propSize: parseFloat(selectedPropellerObj["Diameter_in"]) || 5,
      propPitch: parseFloat(selectedPropellerObj["Pitch_in"]) || 4.3,
      batteryCells: config.batteryCells,
      batteryCapacity: config.batteryCapacity,
      batteryWeight: parseFloat(otherWeights["Battery (LiPo)"]) || 180,
      batteryCRating: config.batteryCRating,
      batteryInternalResistance: config.batteryInternalResistance,
      escWeight: parseFloat(selectedEscObj["Weight (g)"]) || 8,
      escCount: config.escCount,
      escEfficiency: config.escEfficiency,
      frameWeight: parseFloat(otherWeights["Frame"]) || 120,
      fcWeight: parseFloat(otherWeights["Flight Controller"]) || 8,
      fcCurrentDraw: config.fcCurrentDraw,
      cameraWeight: parseFloat(otherWeights["Camera"]) || 15,
      cameraCurrentDraw: config.cameraCurrentDraw,
      vtxWeight: parseFloat(otherWeights["VTX"]) || 8,
      vtxCurrentDraw: config.vtxCurrentDraw,
      receiverWeight: parseFloat(otherWeights["Receiver"]) || 3,
      receiverCurrentDraw: config.receiverCurrentDraw,
      otherWeight: parseFloat(otherWeights["Other (screws, wires)"]) || 30,
      avgThrottle: config.avgThrottle,
      hoverThrottle: config.hoverThrottle,
    };
  }, [config, selectedMotorObj, selectedEscObj, selectedPropellerObj, otherWeights]);

  const calculations = useMemo(() => {
    const nominalVoltage = components.batteryCells * 3.7;
    const maxVoltage = components.batteryCells * 4.2;
    const minVoltage = components.batteryCells * 3.3;

    const motorTotalWeight = components.motorCount * components.motorWeight;
    const escTotalWeight = components.escCount * components.escWeight;
    const propTotalWeight = components.motorCount * (parseFloat(selectedPropellerObj["Weight_g"]) || 0);
    
    // Use shared total weight but recalculate for precision if needed, 
    // or just use components to be consistent with the UI inputs here.
    const totalWeight = motorTotalWeight + escTotalWeight + propTotalWeight +
      components.frameWeight +
      components.fcWeight + components.cameraWeight +
      components.vtxWeight + components.receiverWeight +
      components.batteryWeight + components.otherWeight;

    let thrustPerMotor100, maxThrust;

    if (components.useActualThrustData) {
      thrustPerMotor100 = components.motorThrust100;
      maxThrust = thrustPerMotor100 * components.motorCount;
    } else {
      const rpm = components.motorKV * nominalVoltage;
      const coefficient = 0.00000015;
      thrustPerMotor100 = rpm * rpm / 1000000 * components.propSize *
        components.propSize *
        components.propPitch * coefficient;
      maxThrust = thrustPerMotor100 * components.motorCount;
    }

    const thrustToWeight = maxThrust / totalWeight;

    const throttleFraction = components.avgThrottle / 100;
    const currentPerMotor = components.motorMaxCurrent *
      Math.pow(throttleFraction, 1.8);
    const motorsCurrentDraw = currentPerMotor * components.motorCount;

    const auxCurrentDraw = components.fcCurrentDraw +
      components.cameraCurrentDraw +
      components.vtxCurrentDraw + components.receiverCurrentDraw;

    const totalCurrent = motorsCurrentDraw + auxCurrentDraw;
    const actualCurrent = totalCurrent / (components.escEfficiency / 100);

    const internalResistance = components.batteryInternalResistance *
      components.batteryCells / 1000;
    const voltageSag = actualCurrent * internalResistance;
    const loadVoltage = nominalVoltage - voltageSag;

    const powerDraw = loadVoltage * actualCurrent;

    const usableCapacity = components.batteryCapacity * 0.8;
    const avgVoltage = (maxVoltage + minVoltage) / 2;
    const energyAvailable = (usableCapacity / 1000) * avgVoltage;
    const flightTime = (energyAvailable / powerDraw) * 60;

    const hoverThrottleFraction = components.hoverThrottle / 100;
    const hoverCurrentPerMotor = components.motorMaxCurrent *
      Math.pow(hoverThrottleFraction, 1.8);
    const hoverTotalCurrent = hoverCurrentPerMotor * components.motorCount +
      auxCurrentDraw;
    const hoverActualCurrent = hoverTotalCurrent /
      (components.escEfficiency / 100);
    const hoverPowerDraw = avgVoltage * hoverActualCurrent;
    const hoverFlightTime = (energyAvailable / hoverPowerDraw) * 60;

    return {
      totalWeight,
      maxThrust,
      thrustToWeight,
      powerDraw,
      totalCurrent: actualCurrent,
      nominalVoltage,
      loadVoltage,
      maxVoltage,
      flightTime,
      hoverFlightTime,
      motorTotalWeight,
      escTotalWeight,
      propTotalWeight,
      thrustPerMotor100,
      motorsCurrentDraw,
      auxCurrentDraw,
      voltageSag,
    };
  }, [components, selectedPropellerObj]);

  const throttleData = useMemo(() => {
    return Array.from({ length: 21 }, (_, i) => {
      const throttle = i * 5;
      const throttleFraction = throttle / 100;
      const thrust = calculations.thrustPerMotor100 * components.motorCount *
        Math.pow(throttleFraction, 2);
      const currentPerMotor = components.motorMaxCurrent *
        Math.pow(throttleFraction, 1.8);
      const motorsCurrent = currentPerMotor * components.motorCount;
      const totalCurrent = (motorsCurrent + calculations.auxCurrentDraw) /
        (components.escEfficiency / 100);
      const internalResistance = components.batteryInternalResistance *
        components.batteryCells / 1000;
      const voltageSag = totalCurrent * internalResistance;
      const voltage = calculations.nominalVoltage - voltageSag;
      const power = voltage * totalCurrent;

      return {
        throttle,
        thrust: thrust.toFixed(0),
        power: power.toFixed(0),
        current: totalCurrent.toFixed(1),
        voltage: voltage.toFixed(2),
      };
    });
  }, [calculations, components]);

  const batteryCapacityData = useMemo(() => {
    return [1000, 1300, 1500, 1800, 2200, 2600, 3000].map((capacity) => {
      const usableCapacity = capacity * 0.8;
      const avgVoltage =
        (calculations.maxVoltage + calculations.nominalVoltage * 0.85) / 2;
      const energyAvailable = (usableCapacity / 1000) * avgVoltage;
      const flightTime = (energyAvailable / calculations.powerDraw) * 60;
      return {
        capacity,
        flightTime: flightTime.toFixed(1),
      };
    });
  }, [calculations]);

  const weightDistributionData = useMemo(() => {
    const total = calculations.totalWeight;
    const segments = [
      { name: "Motors", value: calculations.motorTotalWeight, color: "#333" },
      { name: "ESCs", value: calculations.escTotalWeight, color: "#555" },
      { name: "Props", value: calculations.propTotalWeight, color: "#666" },
      { name: "Battery", value: components.batteryWeight, color: "#777" },
      { name: "Frame", value: components.frameWeight, color: "#999" },
      {
        name: "Electronics",
        value: components.fcWeight + components.cameraWeight +
          components.vtxWeight + components.receiverWeight,
        color: "#bbb",
      },
      { name: "Other", value: components.otherWeight, color: "#ddd" },
    ];
    return segments.map((s) => ({
      ...s,
      percent: (s.value / total) * 100,
    }));
  }, [components, calculations]);

  if (loading) return <div className="container">Loading performance data...</div>;

  return (
    <div className="container">
      <h2>Build Config & Performance Analysis</h2>

      <div className="banner">
        <span className="banner-title">
          ⚠️ Performance Integrated
        </span>
        <p style={{ margin: 0, fontSize: "0.9em" }}>
          This calculator is synced with your <strong>Part Picker</strong> selections. 
          Change parts in the Weight tab to see how they affect your drone's performance.
        </p>
      </div>

      <div className="calculator-container">
        {/* Input Section */}
        <div className="inputs-section">
          <h3>Build Parameters</h3>

          <div className="input-section-title">Propulsion (from Picker)</div>
          <div className="part-group">
            <div className="input-item">
              <label>Motor Count</label>
              <input
                type="number"
                value={config.motorCount}
                onChange={(e) => updateConfig("motorCount", parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="input-item">
              <label>ESC Count</label>
              <input
                type="number"
                value={config.escCount}
                onChange={(e) => updateConfig("escCount", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="info-box" style={{ fontSize: '0.85em', opacity: 0.8 }}>
            Selected: <strong>{selectedMotorObj.Name || "None"}</strong> + <strong>{selectedPropellerObj.Name || "None"}</strong>
          </div>

          <div className="info-box">
            <label
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={config.useActualThrustData}
                onChange={(e) =>
                  updateConfig("useActualThrustData", e.target.checked)}
                style={{ width: "auto", marginRight: "10px" }}
              />
              Use Measured Thrust
            </label>
            {config.useActualThrustData && (
              <div style={{ marginTop: "10px" }}>
                <div className="input-item">
                  <label>Max Thrust (g)</label>
                  <input
                    type="number"
                    value={config.motorThrust100}
                    onChange={(e) =>
                      updateConfig("motorThrust100", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="input-section-title">Battery Specs</div>
          <div className="part-group">
            <div className="input-item">
              <label>Cells (S)</label>
              <input
                type="number"
                value={config.batteryCells}
                onChange={(e) =>
                  updateConfig("batteryCells", parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="input-item">
              <label>Capacity (mAh)</label>
              <input
                type="number"
                value={config.batteryCapacity}
                onChange={(e) =>
                  updateConfig("batteryCapacity", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="input-item">
              <label>Weight (g)</label>
              <input
                type="number"
                value={otherWeights["Battery (LiPo)"]}
                onChange={(e) =>
                  updateOtherWeight("Battery (LiPo)", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="input-section-title">Flight Stats</div>
          <div className="part-group">
            <div className="input-item">
              <label>Avg Throttle (%)</label>
              <input
                type="number"
                value={config.avgThrottle}
                onChange={(e) => updateConfig("avgThrottle", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="input-item">
              <label>Hover Throttle (%)</label>
              <input
                type="number"
                value={config.hoverThrottle}
                onChange={(e) =>
                  updateConfig("hoverThrottle", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="input-section-title">Other Weights (g)</div>
          <div className="part-group">
            <div className="input-item">
              <label>Frame</label>
              <input
                type="number"
                value={otherWeights["Frame"]}
                onChange={(e) => updateOtherWeight("Frame", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="input-item">
              <label>FC</label>
              <input
                type="number"
                value={otherWeights["Flight Controller"]}
                onChange={(e) => updateOtherWeight("Flight Controller", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="input-item">
              <label>Camera</label>
              <input
                type="number"
                value={otherWeights["Camera"]}
                onChange={(e) => updateOtherWeight("Camera", parseFloat(e.target.value) || 0)}
              />
            </div>
             <div className="input-item">
              <label>VTX</label>
              <input
                type="number"
                value={otherWeights["VTX"]}
                onChange={(e) => updateOtherWeight("VTX", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Weight</span>
              <span className="stat-value">
                {calculations.totalWeight.toFixed(0)}g
              </span>
              <span className="stat-sub">
                {(calculations.totalWeight / 1000).toFixed(3)} kg
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Max Thrust</span>
              <span
                className="stat-value"
                style={{ color: "var(--accent-color)" }}
              >
                {calculations.maxThrust.toFixed(0)}g
              </span>
              <span className="stat-sub">
                {(calculations.maxThrust / 1000).toFixed(3)} kg
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Thrust-to-Weight</span>
              <span className="stat-value">
                {calculations.thrustToWeight.toFixed(2)}:1
              </span>
              <span className="stat-sub">
                {calculations.thrustToWeight >= 5
                  ? "High Performance"
                  : "Standard Build"}
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Flight Time</span>
              <span className="stat-value">
                {calculations.flightTime.toFixed(1)}m
              </span>
              <span className="stat-sub">
                At {config.avgThrottle}% throttle
              </span>
            </div>
          </div>

          <div className="weight-distribution">
            <h3 style={{ marginTop: 0 }}>Weight Distribution</h3>
            <div className="progress-bar-container">
              {weightDistributionData.map((segment, i) => (
                <div
                  key={i}
                  className="progress-segment"
                  style={{
                    width: `${segment.percent}%`,
                    backgroundColor: segment.color,
                  }}
                  title={`${segment.name}: ${segment.value.toFixed(1)}g (${
                    segment.percent.toFixed(1)
                  }%)`}
                />
              ))}
            </div>
            <div className="legend-grid">
              {weightDistributionData.map((segment, i) => (
                <div key={i} className="legend-item">
                  <div
                    className="color-box"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span>
                    {segment.name}:{" "}
                    <strong>{segment.percent.toFixed(1)}%</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="graph-grid">
            <div className="graph-card">
              <h3>Thrust vs Throttle</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={throttleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="throttle" stroke="var(--text-color)" />
                  <YAxis stroke="var(--text-color)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--secondary-background-color)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
                    itemStyle={{ color: 'var(--text-color)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="thrust"
                    stroke="var(--accent-color)"
                    strokeWidth={2}
                    dot={false}
                    name="Total Thrust (g)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="graph-card">
              <h3>Power Draw vs Throttle</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={throttleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="throttle" stroke="var(--text-color)" />
                  <YAxis stroke="var(--text-color)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--secondary-background-color)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
                    itemStyle={{ color: 'var(--text-color)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="power"
                    stroke="var(--accent-color)"
                    strokeWidth={2}
                    dot={false}
                    name="Power (W)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="graph-card">
              <h3>Flight Time vs Battery</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={batteryCapacityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="capacity" stroke="var(--text-color)" />
                  <YAxis stroke="var(--text-color)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--secondary-background-color)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
                    itemStyle={{ color: 'var(--text-color)' }}
                  />
                  <Bar dataKey="flightTime" fill="var(--accent-color)" name="Time (min)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="graph-card">
              <h3>Current Draw vs Throttle</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={throttleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="throttle" stroke="var(--text-color)" />
                  <YAxis stroke="var(--text-color)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--secondary-background-color)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
                    itemStyle={{ color: 'var(--text-color)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke="var(--accent-color)"
                    strokeWidth={2}
                    dot={false}
                    name="Current (A)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
