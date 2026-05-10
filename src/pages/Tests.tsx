import React, { useState, useEffect } from"react";
import { useLocation, useNavigate } from"react-router-dom";
import TestsHome from"../components/TestEngine/TestsHome";
import CreateTestList from"../components/TestEngine/CreateTestList";
import CreateTestFlow from"../components/TestEngine/CreateTestFlow";
import TestInterface from"../components/TestEngine/TestInterface";
import TestReport from"../components/TestEngine/TestReport";
import SolutionViewer from"../components/TestEngine/SolutionViewer";
import PYQHome from"../components/TestEngine/PYQ/PYQHome";
import PYQDashboard from"../components/TestEngine/PYQ/PYQDashboard";
import PYQChapterView from"../components/TestEngine/PYQ/PYQChapterView";
import PYQQuestionViewer from"../components/TestEngine/PYQ/PYQQuestionViewer";
import PYQExamList from"../components/TestEngine/PYQ/PYQExamList";
import ClassTestList from"../components/TestEngine/ClassTestList";
import { CustomTest, PYQPaper } from"../components/TestEngine/types";
import TestCountdown from"../components/TestEngine/TestCountdown";

type ViewState =
  |"home"
  |"create-list"
  |"create-flow"
  |"test-interface"
  |"test-report"
  |"solution-viewer"
  |"pyq-home"
  |"pyq-dashboard"
  |"pyq-chapter-view"
  |"pyq-question-viewer"
  |"pyq-exam-list"
  |"class-test-list";

export default function Tests() {
  const location = useLocation();
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>(
    location.state?.initialView ||"home",
  );
  const [tests, setTests] = useState<CustomTest[]>([]);
  const [activeTestData, setActiveTestData] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [selectedExam, setSelectedExam] = useState<"JEE Main" |"NEET" | null>(
    location.state?.selectedExam || null,
  );
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  );
  const [pyqPapers, setPyqPapers] = useState<PYQPaper[]>([]);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    if (location.state?.initialView) {
      setView(location.state.initialView);
      if (location.state.selectedExam) {
        setSelectedExam(location.state.selectedExam);
      }
      // Clear the state so it doesn't re-trigger on subsequent renders if not intended
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const bottomNav = document.getElementById("bottom-nav");
    if (bottomNav) {
      if (view ==="home") {
        bottomNav.style.display ="block";
      } else {
        bottomNav.style.display ="none";
      }
    }
    return () => {
      if (bottomNav) bottomNav.style.display ="block";
    };
  }, [view]);

  const handleBack = () => {
    setView("home");
  };

  const handleFinishTest = (results: any) => {
    setTestResults(results);

    // Calculate stats for saving
    const attempted = results.questions.filter(
      (q: any) => results.answers[q.id] !== undefined,
    ).length;
    const correct = results.questions.filter(
      (q: any) => String(results.answers[q.id]) === String(q.correctAnswer),
    ).length;
    const incorrect = attempted - correct;
    const score = correct * 4 - incorrect * 1;

    // Save the report
    import("../utils/analysis").then(({ saveTestReport }) => {
      saveTestReport({
        email:"user@example.com", // Replace with actual user email if available
        testId: activeTestData?.id ||"unknown",
        subject: activeTestData?.subjects?.[0] ||"Mixed",
        chapter: activeTestData?.chapters?.[0] ||"Mixed",
        correct,
        wrong: incorrect,
        skipped: results.questions.length - attempted,
        total: results.questions.length,
        score,
        timeTaken: results.timeSpent,
        date: new Date().toISOString(),
      });
    });

    setView("test-report");
  };

  const handleCreateTestFinish = (testData: any) => {
    const newTest: CustomTest = {
      id: Math.random().toString(36).substr(2, 9),
      name: testData.name,
      exam: testData.exam,
      subjects: testData.subjects,
      chapters: testData.chapters,
      questionCount: testData.questionCount,
      duration: testData.duration,
      createdAt: new Date().toISOString(),
      status:"Not Attempted",
      yearFilter: testData.yearFilter,
      specificYears: testData.specificYears,
    };
    setTests([newTest, ...tests]);
    if (testData.startNow) {
      setActiveTestData(newTest);
      setShowCountdown(true);
      setView("test-interface");
    } else {
      setView("create-list");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {view ==="home" && (
        <TestsHome
          onBack={() => window.history.back()}
          onCreateTest={() => setView("create-list")}
          onViewPYQs={() => setView("pyq-home")}
          onViewTestSeries={() => {}}
          onViewClassTests={() => setView("class-test-list")}
        />
      )}

      {view ==="class-test-list" && (
        <ClassTestList
          onBack={handleBack}
          onAttemptTest={(test) => {
            setActiveTestData(test);
            setShowCountdown(true);
            setView("test-interface");
          }}
          onViewAnalysis={(test) => {
            // Generate mock results for the selected test
            const mockQuestions = Array(test.questionCount)
              .fill(0)
              .map((_, i) => ({
                id: i.toString(),
                text: `Question ${i + 1}`,
                options: ["A","B","C","D"],
                correctAnswer: 0,
                explanation:"This is a mock explanation.",
                subject: test.subjects[0] ||"Physics",
                chapter: test.chapters[0] ||"Kinematics",
              }));
            const mockAnswers: Record<string, number> = {};
            mockQuestions.forEach((q) => {
              if (Math.random() > 0.2) {
                // 80% attempted
                mockAnswers[q.id] = Math.floor(Math.random() * 4);
              }
            });
            const mockResults = {
              answers: mockAnswers,
              markedForReview: [],
              timeSpent: Math.floor(Math.random() * 3600),
              questions: mockQuestions,
            };
            setTestResults(mockResults);
            setActiveTestData(test);
            setView("test-report");
          }}
        />
      )}

      {view ==="create-list" && (
        <CreateTestList
          tests={tests}
          onBack={handleBack}
          onCreateNew={() => setView("create-flow")}
          onAttemptTest={(test) => {
            setActiveTestData(test);
            setShowCountdown(true);
            setView("test-interface");
          }}
          onViewAnalysis={(test) => {
            // Generate mock results for the selected test
            const mockQuestions = Array(test.questionCount)
              .fill(0)
              .map((_, i) => ({
                id: i.toString(),
                text: `Question ${i + 1}`,
                options: ["A","B","C","D"],
                correctAnswer: 0,
                explanation:"This is a mock explanation.",
                subject: test.subjects[0] ||"Physics",
                chapter: test.chapters[0] ||"Kinematics",
              }));
            const mockAnswers: Record<string, number> = {};
            mockQuestions.forEach((q) => {
              if (Math.random() > 0.2) {
                // 80% attempted
                mockAnswers[q.id] = Math.floor(Math.random() * 4);
              }
            });
            const mockResults = {
              answers: mockAnswers,
              markedForReview: [],
              timeSpent: Math.floor(Math.random() * 3600),
              questions: mockQuestions,
            };

            // Calculate stats for saving
            const attempted = mockQuestions.filter(
              (q: any) => mockAnswers[q.id] !== undefined,
            ).length;
            const correct = mockQuestions.filter(
              (q: any) => String(mockAnswers[q.id]) === String(q.correctAnswer),
            ).length;
            const incorrect = attempted - correct;
            const score = correct * 4 - incorrect * 1;

            import("../utils/analysis").then(({ saveTestReport }) => {
              saveTestReport({
                email:"user@example.com",
                testId: test.id,
                subject: test.subjects[0] ||"Physics",
                chapter: test.chapters[0] ||"Kinematics",
                correct,
                wrong: incorrect,
                skipped: mockQuestions.length - attempted,
                total: mockQuestions.length,
                score,
                timeTaken: mockResults.timeSpent,
                date: new Date().toISOString(),
              });
            });

            setTestResults(mockResults);
            setActiveTestData(test);
            setView("test-report");
          }}
        />
      )}

      {view ==="create-flow" && (
        <CreateTestFlow
          onBack={() => setView("create-list")}
          onFinish={handleCreateTestFinish}
        />
      )}

      {view ==="test-interface" && activeTestData && (
        <TestInterface
          testData={activeTestData}
          onSubmit={handleFinishTest}
          onExit={() => setView("create-list")}
          isCountdownActive={showCountdown}
        />
      )}

      {view ==="test-report" && testResults && (
        <TestReport
          results={testResults}
          onBack={() => setView("create-list")}
          onViewSolutions={() => setView("solution-viewer")}
          onViewAnalysis={() => navigate("/app/analysis")}
        />
      )}

      {view ==="solution-viewer" && testResults && (
        <SolutionViewer
          results={testResults}
          onBack={() => setView("test-report")}
        />
      )}

      {view ==="pyq-home" && (
        <PYQHome
          onBack={handleBack}
          onSelectExam={(exam) => {
            setSelectedExam(exam);
            setView("pyq-dashboard");
          }}
        />
      )}

      {view ==="pyq-dashboard" && selectedExam && (
        <PYQDashboard
          exam={selectedExam}
          onBack={() => setView("pyq-home")}
          onSelectChapter={(subject, chapter) => {
            setSelectedSubject(subject);
            setSelectedChapter(chapter);
            setView("pyq-chapter-view");
          }}
          onOpenFullPapers={() => setView("pyq-exam-list")}
        />
      )}

      {view ==="pyq-chapter-view" &&
        selectedExam &&
        selectedSubject &&
        selectedChapter && (
          <PYQChapterView
            exam={selectedExam}
            subject={selectedSubject}
            chapter={selectedChapter}
            onBack={() => setView("pyq-dashboard")}
            onSelectQuestion={(questionId) => {
              setSelectedQuestionId(questionId);
              setView("pyq-question-viewer");
            }}
          />
        )}

      {view ==="pyq-question-viewer" && selectedQuestionId && (
        <PYQQuestionViewer onBack={() => setView("pyq-chapter-view")} />
      )}

      {view ==="pyq-exam-list" && selectedExam && (
        <PYQExamList
          exam={selectedExam}
          papers={pyqPapers}
          setPapers={setPyqPapers}
          onBack={() => setView("pyq-dashboard")}
          onSelectPaper={(paper) => {
            setActiveTestData(paper);
            setShowCountdown(true);
            setView("test-interface");
          }}
          onViewAnalysis={(paper) => {
            const mockQuestions = Array(90)
              .fill(0)
              .map((_, i) => ({
                id: i.toString(),
                text: `PYQ Question ${i + 1}`,
                options: ["A","B","C","D"],
                correctAnswer: 0,
                explanation:"This is a mock explanation for a PYQ.",
                subject:
                  i < 30 ?"Physics" : i < 60 ?"Chemistry" :"Mathematics",
                chapter:"Mixed",
              }));
            const mockAnswers: Record<string, number> = {};
            mockQuestions.forEach((q) => {
              if (Math.random() > 0.2) {
                // 80% attempted
                mockAnswers[q.id] = Math.floor(Math.random() * 4);
              }
            });
            const mockResults = {
              answers: mockAnswers,
              markedForReview: [],
              timeSpent: Math.floor(Math.random() * 10800),
              questions: mockQuestions,
            };

            // Calculate stats for saving
            const attempted = mockQuestions.filter(
              (q: any) => mockAnswers[q.id] !== undefined,
            ).length;
            const correct = mockQuestions.filter(
              (q: any) => String(mockAnswers[q.id]) === String(q.correctAnswer),
            ).length;
            const incorrect = attempted - correct;
            const score = correct * 4 - incorrect * 1;

            import("../utils/analysis").then(({ saveTestReport }) => {
              saveTestReport({
                email:"user@example.com",
                testId: paper.id,
                subject:"Mixed",
                chapter:"Mixed",
                correct,
                wrong: incorrect,
                skipped: mockQuestions.length - attempted,
                total: mockQuestions.length,
                score,
                timeTaken: mockResults.timeSpent,
                date: new Date().toISOString(),
              });
            });

            setTestResults(mockResults);
            setActiveTestData(paper);
            setView("test-report");
          }}
        />
      )}

      {showCountdown && (
        <TestCountdown onComplete={() => setShowCountdown(false)} />
      )}
    </div>
  );
}
