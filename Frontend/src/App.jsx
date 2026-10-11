import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import NewFeePlan from "./Components/NewFeePlan";
import Dashboard from "./Components/Dashboard";
import PlanDetail from "./Components/PlanDetail";

const App = () => {

  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/new-plan" element={token ? <NewFeePlan /> : <Navigate to="/" />} />
      <Route path="/plans/:id" element={token ? <PlanDetail /> : <Navigate to="/" />} />
    </Routes>
  );
};

export default App