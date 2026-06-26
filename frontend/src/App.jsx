import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Setup from "./pages/Setup";
import Interview from "./pages/Interview";
import Feedback from "./pages/Feedback";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/setup" element={<Setup />} />
  <Route path="/interview" element={<Interview />} />
  <Route path="/feedback" element={<Feedback />} />
  <Route path="/history" element={<History />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;