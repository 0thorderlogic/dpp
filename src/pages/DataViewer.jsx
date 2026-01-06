import { useState } from "react";
import { useParts } from "../context/PartContext";

const DataViewer = () => {
  const { motors, escs, propellers, loading } = useParts();
  const [activeTab, setActiveTab] = useState("esc");

  if (loading) return <div>Loading...</div>;

  const tabs = [
    { id: "esc", label: "ESC Data", data: escs, tableId: "esc-table" },
    {
      id: "motors",
      label: "Motors Data",
      data: motors,
      tableId: "motors-table",
    },
    {
      id: "propellers",
      label: "Propellers Data",
      data: propellers,
      tableId: "propellers-table",
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <div id="data-tables">
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {currentTab.data.length > 0
          ? (
            <table>
              <thead>
                <tr>
                  {Object.keys(currentTab.data[0]).map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentTab.data.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => <td key={j}>{val}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          )
          : <p>No data available.</p>}
      </div>
    </div>
  );
};

export default DataViewer;
