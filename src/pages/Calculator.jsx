import { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Calculator = () => {
  const [components, setComponents] = useState({
    // Motors
    motorCount: 4,
    motorWeight: 28, // grams per motor
    motorKV: 2300,
    motorMaxCurrent: 30, // amps per motor at 100% throttle
    motorThrust100: 1850, // grams thrust at 100% throttle (user measured)
    motorThrust50: 550, // grams thrust at 50% throttle
    motorEfficiency: 75, // percentage
    useActualThrustData: false, // toggle for measured vs estimated
    
    // Propellers
    propSize: 5, // inches
    propPitch: 4.3,
    
    // Battery
    batteryCells: 4, // 4S
    batteryCapacity: 1500, // mAh
    batteryWeight: 180, // grams
    batteryCRating: 75,
    batteryInternalResistance: 10, // milliohms per cell
    
    // ESC
    escWeight: 8, // grams per ESC
    escCount: 4,
    escEfficiency: 96, // percentage
    
    // Frame
    frameWeight: 120, // grams
    
    // Flight Controller
    fcWeight: 8,
    fcCurrentDraw: 0.5, // amps
    
    // Camera & VTX
    cameraWeight: 15,
    cameraCurrentDraw: 0.2, // amps
    vtxWeight: 8,
    vtxCurrentDraw: 0.4, // amps at 25mW
    
    // Receiver
    receiverWeight: 3,
    receiverCurrentDraw: 0.1, // amps
    
    // Other
    otherWeight: 30, // screws, wires, etc
    
    // Flight parameters
    avgThrottle: 50, // percentage
    hoverThrottle: 35, // percentage needed to hover
  });

  const updateComponent = (key, value) => {
    setComponents(prev => ({ 
      ...prev, 
      [key]: key === 'useActualThrustData' ? value : (parseFloat(value) || 0) 
    }));
  };

  const calculations = useMemo(() => {
    const nominalVoltage = components.batteryCells * 3.7;
    const maxVoltage = components.batteryCells * 4.2;
    const minVoltage = components.batteryCells * 3.3; // cutoff voltage
    
    // Weight calculations (all in grams)
    const motorTotalWeight = components.motorCount * components.motorWeight;
    const escTotalWeight = components.escCount * components.escWeight;
    const totalWeight = motorTotalWeight + escTotalWeight + components.frameWeight + 
                       components.fcWeight + components.cameraWeight + 
                       components.vtxWeight + components.receiverWeight + 
                       components.batteryWeight + components.otherWeight;
    
    // Thrust calculations
    let thrustPerMotor100, maxThrust;
    
    if (components.useActualThrustData) {
      thrustPerMotor100 = components.motorThrust100;
      maxThrust = thrustPerMotor100 * components.motorCount;
    } else {
      const rpm = components.motorKV * nominalVoltage;
      const coefficient = 0.00000015;
      thrustPerMotor100 = rpm * rpm / 1000000 * components.propSize * components.propSize * 
                         components.propPitch * coefficient;
      maxThrust = thrustPerMotor100 * components.motorCount;
    }
    
    const thrustToWeight = maxThrust / totalWeight;
    
    const throttleFraction = components.avgThrottle / 100;
    const currentPerMotor = components.motorMaxCurrent * Math.pow(throttleFraction, 1.8);
    const motorsCurrentDraw = currentPerMotor * components.motorCount;
    
    const auxCurrentDraw = components.fcCurrentDraw + components.cameraCurrentDraw + 
                          components.vtxCurrentDraw + components.receiverCurrentDraw;
    
    const totalCurrent = motorsCurrentDraw + auxCurrentDraw;
    const actualCurrent = totalCurrent / (components.escEfficiency / 100);
    
    const internalResistance = components.batteryInternalResistance * components.batteryCells / 1000;
    const voltageSag = actualCurrent * internalResistance;
    const loadVoltage = nominalVoltage - voltageSag;
    
    const powerDraw = loadVoltage * actualCurrent;
    
    const usableCapacity = components.batteryCapacity * 0.8;
    const avgVoltage = (maxVoltage + minVoltage) / 2;
    const energyAvailable = (usableCapacity / 1000) * avgVoltage;
    const flightTime = (energyAvailable / powerDraw) * 60;
    
    const hoverThrottleFraction = components.hoverThrottle / 100;
    const hoverCurrentPerMotor = components.motorMaxCurrent * Math.pow(hoverThrottleFraction, 1.8);
    const hoverTotalCurrent = hoverCurrentPerMotor * components.motorCount + auxCurrentDraw;
    const hoverActualCurrent = hoverTotalCurrent / (components.escEfficiency / 100);
    const hoverPowerDraw = avgVoltage * hoverActualCurrent;
    const hoverFlightTime = (energyAvailable / hoverPowerDraw) * 60;
    
    let hoverThrust;
    if (components.useActualThrustData) {
      const throttleRatio = components.hoverThrottle / 100;
      hoverThrust = components.motorThrust100 * Math.pow(throttleRatio, 2) * components.motorCount;
    } else {
      hoverThrust = thrustPerMotor100 * Math.pow(hoverThrottleFraction, 2) * components.motorCount;
    }
    
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
      thrustPerMotor100,
      motorsCurrentDraw,
      auxCurrentDraw,
      voltageSag,
      hoverThrust,
      hoverPowerDraw
    };
  }, [components]);

  const throttleData = useMemo(() => {
    return Array.from({ length: 21 }, (_, i) => {
      const throttle = i * 5;
      const throttleFraction = throttle / 100;
      const thrust = calculations.thrustPerMotor100 * components.motorCount * Math.pow(throttleFraction, 2);
      const currentPerMotor = components.motorMaxCurrent * Math.pow(throttleFraction, 1.8);
      const motorsCurrent = currentPerMotor * components.motorCount;
      const totalCurrent = (motorsCurrent + calculations.auxCurrentDraw) / (components.escEfficiency / 100);
      const internalResistance = components.batteryInternalResistance * components.batteryCells / 1000;
      const voltageSag = totalCurrent * internalResistance;
      const voltage = calculations.nominalVoltage - voltageSag;
      const power = voltage * totalCurrent;
      
      return {
        throttle,
        thrust: thrust.toFixed(0),
        power: power.toFixed(0),
        current: totalCurrent.toFixed(1),
        voltage: voltage.toFixed(2)
      };
    });
  }, [calculations, components]);

  const batteryCapacityData = useMemo(() => {
    return [1000, 1300, 1500, 1800, 2200, 2600, 3000].map(capacity => {
      const usableCapacity = capacity * 0.8;
      const avgVoltage = (calculations.maxVoltage + calculations.nominalVoltage * 0.85) / 2;
      const energyAvailable = (usableCapacity / 1000) * avgVoltage;
      const flightTime = (energyAvailable / calculations.powerDraw) * 60;
      return {
        capacity,
        flightTime: flightTime.toFixed(1)
      };
    });
  }, [calculations]);

  const batteryDischargeData = useMemo(() => {
    const minVoltage = components.batteryCells * 3.3;
    return Array.from({ length: 21 }, (_, i) => {
      const percent = 100 - i * 5;
      const dischargeFraction = (100 - percent) / 100;
      const voltage = calculations.maxVoltage - (calculations.maxVoltage - minVoltage) * (dischargeFraction + 0.3 * dischargeFraction * dischargeFraction);
      return {
        percent,
        voltage: Math.max(voltage, minVoltage).toFixed(2)
      };
    });
  }, [calculations, components]);

  const weightDistributionData = useMemo(() => {
    const total = calculations.totalWeight;
    const segments = [
      { name: 'Motors', value: calculations.motorTotalWeight, color: '#333' },
      { name: 'ESCs', value: calculations.escTotalWeight, color: '#555' },
      { name: 'Battery', value: components.batteryWeight, color: '#777' },
      { name: 'Frame', value: components.frameWeight, color: '#999' },
      { name: 'FC/Elec', value: components.fcWeight + components.cameraWeight + components.vtxWeight + components.receiverWeight, color: '#bbb' },
      { name: 'Other', value: components.otherWeight, color: '#ddd' }
    ];
    return segments.map(s => ({
      ...s,
      percent: (s.value / total) * 100
    }));
  }, [components, calculations]);

  return (
    <div className="container">
      <h2>Build Config & Performance Analysis</h2>
      
      <div className="banner">
        <span className="banner-title">
          ⚠️Accuracy Notice
        </span>
        <p style={{ margin: 0, fontSize: '0.9em' }}>
          Calculations are <strong>estimates only</strong>. Results depend on motor bench tests and battery health. 
          Real-world variables like wind and flying style will affect performance.
        </p>
      </div>

      <div className="calculator-container">
        {/* Input Section */}
        <div className="inputs-section">
          <h3>Components</h3>
          
          <div className="input-section-title">Motors</div>
          <div className="part-group">
            <div className="input-item">
              <label>Motor Count</label>
              <input type="number" value={components.motorCount} onChange={(e) => updateComponent('motorCount', e.target.value)} />
            </div>
            <div className="input-item">
              <label>Weight (g each)</label>
              <input type="number" value={components.motorWeight} onChange={(e) => updateComponent('motorWeight', e.target.value)} />
            </div>
            <div className="input-item">
              <label>KV Rating</label>
              <input type="number" value={components.motorKV} onChange={(e) => updateComponent('motorKV', e.target.value)} />
            </div>
            <div className="input-item">
              <label>Max Amps (100%)</label>
              <input type="number" value={components.motorMaxCurrent} onChange={(e) => updateComponent('motorMaxCurrent', e.target.value)} />
            </div>
          </div>

          <div className="info-box">
            <label style={{ display: 'flex', alignItems: 'center', fontWeight: '700', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={components.useActualThrustData}
                onChange={(e) => updateComponent('useActualThrustData', e.target.checked)}
                style={{ width: 'auto', marginRight: '10px' }}
              />
              Use Measured Thrust
            </label>
            {components.useActualThrustData && (
              <div style={{ marginTop: '10px' }}>
                <div className="input-item">
                  <label>Max Thrust (g)</label>
                  <input type="number" value={components.motorThrust100} onChange={(e) => updateComponent('motorThrust100', e.target.value)} />
                </div>
              </div>
            )}
          </div>

          <div className="input-section-title">Propellers</div>
          <div className="part-group">
            <div className="input-item">
              <label>Size (inch)</label>
              <input type="number" step="0.1" value={components.propSize} onChange={(e) => updateComponent('propSize', e.target.value)} />
            </div>
            <div className="input-item">
              <label>Pitch</label>
              <input type="number" step="0.1" value={components.propPitch} onChange={(e) => updateComponent('propPitch', e.target.value)} />
            </div>
          </div>

          <div className="input-section-title">Battery</div>
          <div className="part-group">
            <div className="input-item">
              <label>Cells (S)</label>
              <input type="number" value={components.batteryCells} onChange={(e) => updateComponent('batteryCells', e.target.value)} />
            </div>
            <div className="input-item">
              <label>Capacity (mAh)</label>
              <input type="number" value={components.batteryCapacity} onChange={(e) => updateComponent('batteryCapacity', e.target.value)} />
            </div>
            <div className="input-item">
              <label>Weight (g)</label>
              <input type="number" value={components.batteryWeight} onChange={(e) => updateComponent('batteryWeight', e.target.value)} />
            </div>
          </div>

          <div className="input-section-title">Flight Stats</div>
          <div className="part-group">
            <div className="input-item">
              <label>Avg Throttle (%)</label>
              <input type="number" value={components.avgThrottle} onChange={(e) => updateComponent('avgThrottle', e.target.value)} />
            </div>
            <div className="input-item">
              <label>Hover Throttle (%)</label>
              <input type="number" value={components.hoverThrottle} onChange={(e) => updateComponent('hoverThrottle', e.target.value)} />
            </div>
          </div>

          <div className="input-section-title">Electronics (g)</div>
          <div className="part-group">
            <div className="input-item">
              <label>Flight Controller</label>
              <input type="number" value={components.fcWeight} onChange={(e) => updateComponent('fcWeight', e.target.value)} />
            </div>
            <div className="input-item">
              <label>Camera</label>
              <input type="number" value={components.cameraWeight} onChange={(e) => updateComponent('cameraWeight', e.target.value)} />
            </div>
            <div className="input-item">
              <label>VTX</label>
              <input type="number" value={components.vtxWeight} onChange={(e) => updateComponent('vtxWeight', e.target.value)} />
            </div>
            <div className="input-item">
              <label>Receiver</label>
              <input type="number" value={components.receiverWeight} onChange={(e) => updateComponent('receiverWeight', e.target.value)} />
            </div>
          </div>

          <div className="input-section-title">Other Parts (g)</div>
          <div className="part-group">
            <div className="input-item">
              <label>Frame</label>
              <input type="number" value={components.frameWeight} onChange={(e) => updateComponent('frameWeight', e.target.value)} />
            </div>
            <div className="input-item">
              <label>Other (screws, etc)</label>
              <input type="number" value={components.otherWeight} onChange={(e) => updateComponent('otherWeight', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Weight</span>
              <span className="stat-value">{calculations.totalWeight.toFixed(0)}g</span>
              <span className="stat-sub">{(calculations.totalWeight / 1000).toFixed(3)} kg</span>
            </div>
            
            <div className="stat-card">
              <span className="stat-label">Max Thrust</span>
              <span className="stat-value" style={{ color: 'var(--accent-color)' }}>{calculations.maxThrust.toFixed(0)}g</span>
              <span className="stat-sub">{(calculations.maxThrust / 1000).toFixed(3)} kg</span>
            </div>
            
            <div className="stat-card">
              <span className="stat-label">Thrust-to-Weight</span>
              <span className="stat-value">{calculations.thrustToWeight.toFixed(2)}:1</span>
              <span className="stat-sub">
                {calculations.thrustToWeight >= 5 ? 'High Performance' : 'Standard Build'}
              </span>
            </div>
            
            <div className="stat-card">
              <span className="stat-label">Flight Time</span>
              <span className="stat-value">{calculations.flightTime.toFixed(1)}m</span>
              <span className="stat-sub">At {components.avgThrottle}% throttle</span>
            </div>
          </div>

          <div className="weight-distribution">
            <h3 style={{ marginTop: 0 }}>Weight Distribution</h3>
            <div className="progress-bar-container">
              {weightDistributionData.map((segment, i) => (
                <div 
                  key={i} 
                  className="progress-segment" 
                  style={{ width: `${segment.percent}%`, backgroundColor: segment.color }}
                  title={`${segment.name}: ${segment.value}g (${segment.percent.toFixed(1)}%)`}
                />
              ))}
            </div>
            <div className="legend-grid">
              {weightDistributionData.map((segment, i) => (
                <div key={i} className="legend-item">
                  <div className="color-box" style={{ backgroundColor: segment.color }} />
                  <span>{segment.name}: <strong>{segment.percent.toFixed(1)}%</strong></span>
                </div>
              ))}
            </div>
          </div>

          <div className="graph-grid">
            <div className="graph-card">
              <h3>Thrust vs Throttle</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={throttleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="throttle" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="thrust" stroke="#000" strokeWidth={2} dot={false} name="Total Thrust (g)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="graph-card">
              <h3>Power Draw vs Throttle</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={throttleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="throttle" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="power" stroke="#000" strokeWidth={2} dot={false} name="Power (W)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="graph-card">
              <h3>Flight Time vs Battery</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={batteryCapacityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="capacity" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="flightTime" fill="#333" name="Time (min)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="graph-card">
              <h3>Current Draw vs Throttle</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={throttleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="throttle" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="current" stroke="#000" strokeWidth={2} dot={false} name="Current (A)" />
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