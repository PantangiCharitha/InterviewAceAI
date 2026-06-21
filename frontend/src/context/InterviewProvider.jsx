import { useState } from "react";
import { InterviewContext } from "./InterviewContext";

export const InterviewProvider = ({ children }) => {
  const [role, setRole] = useState("");
  const [interviewType, setInterviewType] = useState("");

  return (
    <InterviewContext.Provider
      value={{
        role,
        setRole,
        interviewType,
        setInterviewType,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};