// import { useState } from "react";
// import { InterviewContext } from "./InterviewContext";

// export const InterviewProvider = ({ children }) => {
//   const [role, setRole] = useState("");
//   const [interviewType, setInterviewType] = useState("");

//   return (
//     <InterviewContext.Provider
//       value={{
//         role,
//         setRole,
//         interviewType,
//         setInterviewType,
//       }}
//     >
//       {children}
//     </InterviewContext.Provider>
//   );
// };
import { useState } from "react";
import { InterviewContext } from "./InterviewContext";

export const InterviewProvider = ({ children }) => {
  const [role, setRole] = useState("");
  const [interviewType, setInterviewType] = useState("");

  const [company, setCompany] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  return (
    <InterviewContext.Provider
      value={{
        role,
        setRole,

        interviewType,
        setInterviewType,

        company,
        setCompany,

        resumeFile,
        setResumeFile,

        resumeData,
        setResumeData,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};