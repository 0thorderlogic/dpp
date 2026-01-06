import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { PartProvider } from './context/PartContext';
import Calculator from './pages/Calculator';
import WeightPage from './pages/WeightPage';
import DataViewer from './pages/DataViewer';
import './index.css';

function App() {
  return (
    <PartProvider>
      <Router>
        <div className="app-container">
          <header>
            <h1>Drone Part Picker</h1>
            <small><h1>Technological Innovation Hub @ Indian Statistical Institute</h1></small>
            <nav className="main-nav">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Calculator
              </NavLink>
              <NavLink to="/weight" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Weight
              </NavLink>
              <NavLink to="/data" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Data Viewer
              </NavLink>
            </nav>
          </header>

          <main className="container">
            <Routes>
              <Route path="/" element={<Calculator />} />
              <Route path="/weight" element={<WeightPage />} />
              <Route path="/data" element={<DataViewer />} />
            </Routes>
          </main>
        </div>
      </Router>
    </PartProvider>
  );
}

export default App;
