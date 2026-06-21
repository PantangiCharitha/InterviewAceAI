import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { InterviewProvider } from "./context/InterviewProvider";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <InterviewProvider>
      <App />
    </InterviewProvider>
  </React.StrictMode>
);