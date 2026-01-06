import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import { PartProvider } from "./context/PartContext";
import Calculator from "./pages/Calculator";
import WeightPage from "./pages/WeightPage";
import DataViewer from "./pages/DataViewer";
import Manual from "./pages/Manual";
import Footer from "./components/Footer";
import "./index.css";

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <PartProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <div className="app-container">
          <header>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
            <h1>Drone Part Picker</h1>
            <small>
              <h1>
                Technology Innovation Hub @ Indian Statistical Institute
              </h1>
            </small>
            <nav className="main-nav">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"}
              >
                Calculator
              </NavLink>
              <NavLink
                to="/weight"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"}
              >
                Weight
              </NavLink>
              <NavLink
                to="/data"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"}
              >
                Data Viewer
              </NavLink>
              <NavLink
                to="/manual"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"}
              >
                Manual
              </NavLink>
            </nav>
          </header>

          <main className="container">
            <Routes>
              <Route path="/" element={<Calculator />} />
              <Route path="/weight" element={<WeightPage />} />
              <Route path="/data" element={<DataViewer />} />
              <Route path="/manual" element={<Manual />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </PartProvider>
  );
}

export default App;
