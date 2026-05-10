import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from"react-router-dom";
import { Toaster } from"sonner";
import BottomNav from"./components/BottomNav";
import Home from"./pages/Home";
import Tests from"./pages/Tests";
import NotebookHome from"./modules/notebook/NotebookHome";
import AddNote from"./modules/notebook/AddNote";
import EditNote from"./modules/notebook/EditNote";
import NoteViewer from"./modules/notebook/NoteViewer";
import Formulas from"./pages/Formulas";
import Profile from"./pages/Profile";
import { Landing } from"./pages/Landing";
import Login from"./pages/Login";
import Signup from"./pages/Signup";
import ExamDashboard from"./pages/ExamDashboard";
import DPPDashboard from"./pages/DPPDashboard";
import DPPChapter from"./pages/DPPChapter";
import DPPAssignment from"./pages/DPPAssignment";
import PracticeMCQScreen from"./pages/PracticeMCQScreen";
import AvatarEditor from"./pages/AvatarEditor";
import Leaderboard from"./pages/Leaderboard";
import AnalysisDashboard from"./pages/AnalysisDashboard";
import FormulaSubject from"./pages/FormulaSubject";
import FormulaChapter from"./pages/FormulaChapter";
import FormulaViewer from"./pages/FormulaViewer";
import CreateFormula from"./pages/CreateFormula";
import NotFound from"./pages/NotFound";

function AppLayout() {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith("/app");

  return (
    <div
      className={`min-h-screen font-sans ${isAppRoute ?"bg-white dark:bg-slate-900" :"bg-slate-50 dark:bg-slate-900"}`}
    >
      <Toaster theme="dark" position="top-center" />
      <Outlet />
      {isAppRoute && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/app" element={<Home />} />
          <Route path="/app/tests" element={<Tests />} />

          <Route path="/app/notebook" element={<NotebookHome />} />
          <Route path="/app/notebook/add" element={<AddNote />} />
          <Route path="/app/notebook/:id" element={<NoteViewer />} />
          <Route path="/app/notebook/:id/edit" element={<EditNote />} />

          <Route path="/app/formulas" element={<Formulas />} />
          <Route path="/app/profile" element={<Profile />} />

          <Route path="/app/exam/:examId" element={<ExamDashboard />} />
          <Route path="/app/dpp" element={<DPPDashboard />} />
          <Route path="/app/dpp/:examId" element={<DPPDashboard />} />
          <Route
            path="/app/dpp/chapter/:subject/:chapterId"
            element={<DPPChapter />}
          />
          <Route
            path="/app/dpp/assignment/:dppId"
            element={<DPPAssignment />}
          />
          <Route path="/app/practice" element={<PracticeMCQScreen />} />
          <Route path="/app/avatar-editor" element={<AvatarEditor />} />
          <Route path="/app/leaderboard" element={<Leaderboard />} />
          <Route path="/app/analysis" element={<AnalysisDashboard />} />

          <Route path="/app/formulas/:subjectId" element={<FormulaSubject />} />
          <Route
            path="/app/formulas/:subjectId/:chapterId"
            element={<FormulaChapter />}
          />
          <Route
            path="/app/formulas/:subjectId/:chapterId/:topicId"
            element={<FormulaViewer />}
          />
          <Route path="/app/formulas/create" element={<CreateFormula />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
