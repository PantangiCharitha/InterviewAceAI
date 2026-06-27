import jsPDF from "jspdf";

export function generateInterviewReport({
  role,
  interviewType,
  interviewFeedback,
  interviewData,
  codingResults,
  finalFeedback,
}) {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let y = 20;

  const left = 20;

  function checkPageSpace(required = 20) {
    if (y + required > pageHeight - 20) {
      doc.addPage();
      y = 20;
      addHeader(false);
    }
  }

  function sectionTitle(title) {
    checkPageSpace(15);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, left, y);

    y += 10;
  }

  function bodyText(text) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(
      String(text),
      170
    );

    checkPageSpace(lines.length * 6);

    doc.text(lines, left, y);

    y += lines.length * 6 + 5;
  }

  function bulletList(items = []) {

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    items.forEach((item) => {

      checkPageSpace(8);

      const lines = doc.splitTextToSize(
        "• " + item,
        165
      );

      doc.text(lines, left + 5, y);

      y += lines.length * 6 + 2;

    });

    y += 5;
  }

  function addHeader(firstPage = true) {

    if (firstPage) {

      doc.setFillColor(79, 70, 229);

      doc.rect(0, 0, pageWidth, 35, "F");

      doc.setTextColor(255);

      doc.setFont("helvetica", "bold");

      doc.setFontSize(24);

      doc.text(
        "InterviewAce AI",
        pageWidth / 2,
        18,
        {
          align: "center",
        }
      );

      doc.setFontSize(12);

      doc.text(
        "Professional Interview Assessment Report",
        pageWidth / 2,
        28,
        {
          align: "center",
        }
      );

      doc.setTextColor(0);

      y = 50;

    } else {

      doc.setFont("helvetica", "bold");

      doc.setFontSize(16);

      doc.text(
        "Interview Report (Continued)",
        left,
        y
      );

      y += 12;
    }
  }

  addHeader();

  sectionTitle("Candidate Details");

  bodyText(`Role : ${role}`);

  bodyText(`Interview Type : ${interviewType}`);

  bodyText(
    `Generated On : ${new Date().toLocaleString()}`
  );

  sectionTitle("Overall Grade");

  doc.setFont("helvetica", "bold");

  doc.setFontSize(36);

  doc.text(
    finalFeedback.grade,
    pageWidth / 2,
    y,
    {
      align: "center",
    }
  );

  y += 20;

  sectionTitle("Interview Scores");

  doc.setFont("helvetica", "bold");

  doc.setFontSize(12);

  doc.text(
    `Communication : ${interviewFeedback.communicationScore}/10`,
    left,
    y
  );

  y += 10;

  doc.text(
    `Technical : ${interviewFeedback.technicalScore}/10`,
    left,
    y
  );

  y += 10;

  doc.text(
    `Confidence : ${interviewFeedback.confidenceScore}/10`,
    left,
    y
  );

  y += 18;

  sectionTitle("Hiring Recommendation");

  doc.setFont("helvetica", "bold");

  doc.setFontSize(14);

  doc.text(
    interviewFeedback.recommendation,
    left,
    y
  );

  y += 18;

  sectionTitle("Strengths");

  bulletList(interviewFeedback.strengths);

  sectionTitle("Areas for Improvement");

  bulletList(interviewFeedback.improvements);

  sectionTitle("Overall Feedback");

  bodyText(interviewFeedback.overallFeedback);
    // ==========================
  // CODING ASSESSMENT
  // ==========================

  sectionTitle("Coding Assessment");

  (codingResults || []).forEach((item, index) => {

    checkPageSpace(50);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);

    doc.text(
      `Coding Question ${index + 1}`,
      left,
      y
    );

    y += 8;

    bodyText(item.question?.title || "Coding Question");

    bodyText(
      `Overall Score : ${item.evaluation?.overallScore ?? "N/A"}/10`
    );

    bodyText(
      `Correctness : ${item.evaluation?.correctness ?? "N/A"}/10`
    );

    bodyText(
      `Time Complexity : ${item.evaluation?.timeComplexity ?? "N/A"}`
    );

    bodyText(
      `Space Complexity : ${item.evaluation?.spaceComplexity ?? "N/A"}`
    );

    bodyText(
      `Recommendation : ${item.evaluation?.hireRecommendation ?? "N/A"}`
    );

    bodyText(
      item.evaluation?.feedback || "No feedback available."
    );

  });

  // ==========================
  // FINAL AI EVALUATION
  // ==========================

  sectionTitle("Final AI Evaluation");

  bodyText(
    `Overall Score : ${finalFeedback?.overallScore ?? "N/A"}/10`
  );

  bodyText(
    `Grade : ${finalFeedback?.grade ?? "N/A"}`
  );

  bodyText(
    `Recommendation : ${finalFeedback?.recommendation ?? "N/A"}`
  );

  sectionTitle("Final Strengths");

  bulletList(finalFeedback?.strengths || []);

  sectionTitle("Final Improvements");

  bulletList(finalFeedback?.improvements || []);

  sectionTitle("Final Summary");

  bodyText(finalFeedback?.summary || "No summary available.");

  // ==========================
  // INTERVIEW TRANSCRIPT
  // ==========================

  sectionTitle("Interview Transcript");

  (interviewData || []).forEach((item, index) => {

    checkPageSpace(40);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);

    doc.text(
      `Question ${index + 1}`,
      left,
      y
    );

    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const questionLines = doc.splitTextToSize(
      item.question || "",
      170
    );

    doc.text(questionLines, left, y);

    y += questionLines.length * 6 + 5;

    doc.setFont("helvetica", "bold");

    doc.text(
      "Candidate Answer",
      left,
      y
    );

    y += 8;

    doc.setFont("helvetica", "normal");

    const answerLines = doc.splitTextToSize(
      item.answer || "",
      170
    );

    doc.text(answerLines, left, y);

    y += answerLines.length * 6 + 12;

  });

  // ==========================
  // FOOTER
  // ==========================

  const totalPages = doc.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {

    doc.setPage(i);

    doc.setDrawColor(220);

    doc.line(
      15,
      pageHeight - 18,
      pageWidth - 15,
      pageHeight - 18
    );

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(120);

    doc.text(
      "Generated by InterviewAce AI",
      20,
      pageHeight - 10
    );

    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - 20,
      pageHeight - 10,
      {
        align: "right",
      }
    );
  }

  const fileName =
    `Interview_Report_${role.replace(/\s+/g, "_")}_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;

  doc.save(fileName);

}