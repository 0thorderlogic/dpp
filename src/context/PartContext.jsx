import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadCSVData } from "../utils/dataLoader";

const PartContext = createContext();

export const PartProvider = ({ children }) => {
  const [motors, setMotors] = useState([]);
  const [escs, setEscs] = useState([]);
  const [propellers, setPropellers] = useState([]);

  const [selectedMotor, setSelectedMotor] = useState("");
  const [selectedEsc, setSelectedEsc] = useState("");
  const [selectedPropeller, setSelectedPropeller] = useState("");

  const [config, setConfig] = useState({
    motorCount: 4,
    escCount: 4,
    batteryCells: 4,
    batteryCapacity: 1500,
    batteryCRating: 75,
    batteryInternalResistance: 10,
    escEfficiency: 96,
    motorEfficiency: 75,
    fcCurrentDraw: 0.5,
    cameraCurrentDraw: 0.2,
    vtxCurrentDraw: 0.4,
    receiverCurrentDraw: 0.1,
    avgThrottle: 50,
    hoverThrottle: 35,
    useActualThrustData: false,
    motorThrust100: 1850,
  });

  const [otherWeights, setOtherWeights] = useState({
    "Frame": 120,
    "Flight Controller": 8,
    "Battery (LiPo)": 180,
    "Camera": 15,
    "VTX": 8,
    "Receiver": 3,
    "Other (screws, wires)": 30,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const motorsData = await loadCSVData(
        `${import.meta.env.BASE_URL}data/motors.csv`,
      );
      const escsData = await loadCSVData(
        `${import.meta.env.BASE_URL}data/esc.csv`,
      );
      const propellersData = await loadCSVData(
        `${import.meta.env.BASE_URL}data/propellers.csv`,
      );

      setMotors(motorsData);
      setEscs(escsData);
      setPropellers(propellersData);

      if (motorsData.length > 0) setSelectedMotor(motorsData[0].Name);
      if (escsData.length > 0) setSelectedEsc(escsData[0].Name);
      if (propellersData.length > 0) {
        setSelectedPropeller(propellersData[0].Name);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const selectedMotorObj = useMemo(() => 
    motors.find(m => m.Name === selectedMotor) || {}, 
  [motors, selectedMotor]);

  const selectedEscObj = useMemo(() => 
    escs.find(e => e.Name === selectedEsc) || {}, 
  [escs, selectedEsc]);

  const selectedPropellerObj = useMemo(() => 
    propellers.find(p => p.Name === selectedPropeller) || {}, 
  [propellers, selectedPropeller]);

  const propulsionWeight = useMemo(() => {
    const mw = parseFloat(selectedMotorObj["Weight (g)"]) || 0;
    const ew = parseFloat(selectedEscObj["Weight (g)"]) || 0;
    const pw = parseFloat(selectedPropellerObj["Weight_g"]) || 0;
    return (mw * config.motorCount) + (ew * config.escCount) + (pw * config.motorCount);
  }, [selectedMotorObj, selectedEscObj, selectedPropellerObj, config.motorCount, config.escCount]);

  const othersTotalWeight = useMemo(() => 
    Object.values(otherWeights).reduce((a, b) => a + (parseFloat(b) || 0), 0),
  [otherWeights]);

  const totalWeight = propulsionWeight + othersTotalWeight;

  const updateOtherWeight = (part, weight) => {
    setOtherWeights((prev) => ({ ...prev, [part]: weight }));
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <PartContext.Provider
      value={{
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
        config,
        updateConfig,
        propulsionWeight,
        totalWeight,
        othersTotalWeight,
        loading,
      }}
    >
      {children}
    </PartContext.Provider>
  );
};

export const useParts = () => useContext(PartContext);
