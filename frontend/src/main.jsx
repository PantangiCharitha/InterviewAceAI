import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { InterviewProvider } from "./context/InterviewProvider";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <InterviewProvider>
        <App />
      </InterviewProvider>
    </AuthProvider>
  </React.StrictMode>
);