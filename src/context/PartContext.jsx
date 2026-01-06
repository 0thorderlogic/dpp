import { createContext, useContext, useEffect, useState } from "react";
import { loadCSVData } from "../utils/dataLoader";

const PartContext = createContext();

export const PartProvider = ({ children }) => {
  const [motors, setMotors] = useState([]);
  const [escs, setEscs] = useState([]);
  const [propellers, setPropellers] = useState([]);

  const [selectedMotor, setSelectedMotor] = useState("");
  const [selectedEsc, setSelectedEsc] = useState("");
  const [selectedPropeller, setSelectedPropeller] = useState("");

  const [otherWeights, setOtherWeights] = useState({
    "Frame": 0,
    "Flight Controller": 0,
    "Battery (LiPo)": 0,
    "Battery Connector": 0,
    "Wiring": 0,
    "Radio Transmitter": 0,
    "Radio Receiver": 0,
    "Power Distribution Board": 0,
    "Voltage Regulator / BEC": 0,
    "Payload": 0,
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

  const getWeight = (data, name, key) => {
    const item = data.find((i) => i.Name === name);
    return item ? parseFloat(item[key]) || 0 : 0;
  };

  const propulsionWeight =
    (getWeight(motors, selectedMotor, "Weight (g)") * 4) +
    (getWeight(escs, selectedEsc, "Weight (g)") * 4) +
    getWeight(propellers, selectedPropeller, "Weight_g");

  const othersTotalWeight = Object.values(otherWeights).reduce(
    (a, b) => a + (parseFloat(b) || 0),
    0,
  );
  const totalWeight = propulsionWeight + othersTotalWeight;

  const updateOtherWeight = (part, weight) => {
    setOtherWeights((prev) => ({ ...prev, [part]: weight }));
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
        otherWeights,
        updateOtherWeight,
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
