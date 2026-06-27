import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Setup from "./pages/Setup";
import Interview from "./pages/Interview";
import Feedback from "./pages/Feedback";
import History from "./pages/History";
import CodingRound from "./pages/CodingRound";
import FinalFeedback from "./pages/FinalFeedback";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {

  return (
    <BrowserRouter>
  <Routes>
    <Route
  path="/"
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  }
/>

   
        <Route
  path="/setup"
  element={
    <ProtectedRoute>
      <Setup />
    </ProtectedRoute>
  }
/>

<Route
  path="/interview"
  element={
    <ProtectedRoute>
      <Interview />
    </ProtectedRoute>
  }
/>

<Route
  path="/coding"
  element={
    <ProtectedRoute>
      <CodingRound />
    </ProtectedRoute>
  }
/>

<Route
  path="/history"
  element={
    <ProtectedRoute>
      <History />
    </ProtectedRoute>
  }
/>

<Route
  path="/final-feedback"
  element={
    <ProtectedRoute>
      <FinalFeedback />
    </ProtectedRoute>
  }
/>
 
 
  <Route path="/feedback" element={<Feedback />} />
  
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;