import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Setup from "./pages/Setup";
import Interview from "./pages/Interview";
import Feedback from "./pages/Feedback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;