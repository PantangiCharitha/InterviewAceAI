import { createContext, useState } from "react";

export const InterviewContext = createContext();

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