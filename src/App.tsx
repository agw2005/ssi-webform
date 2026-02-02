import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Submit from "./pages/Submit";
import Budget from "./pages/Budget";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/submit" element={<Submit />} />
      <Route path="/budget" element={<Budget />} />
    </Routes>
  );
};

export default App;
