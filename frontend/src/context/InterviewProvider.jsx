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
  const [codingQuestion, setCodingQuestion] = useState(null);
const [codingScore, setCodingScore] = useState(null);
const [codingCompleted, setCodingCompleted] = useState(false);

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

        codingQuestion,
setCodingQuestion,

codingScore,
setCodingScore,

codingCompleted,
setCodingCompleted,

      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};