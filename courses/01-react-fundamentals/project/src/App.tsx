import { useReducer } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChallengeList from "./components/ChallengeList";
// import TaskList from "./components/TaskList";
import TaskApp from "./components/TaskApp";
import TaskDetailPage from "./components/TaskDetailPage";
import FetchDemoView from "./components/FetchDemoView";
import { ThemeProvider } from "./contexts/ThemeContext";
import type { Task } from "./components/TaskList";
import  useLocalStorage  from "./hooks/useLocalStorage";
import { taskReducer, SET_TASKS } from "./reducers/taskReducer";
const INITIAL_TASKS: Task[] = [
  { id: 1, title: "First Task", description: "Description one", priority: "High", completed: false, category: "Work", tags: ["important"] },
  { id: 2, title: "Second Task", description: "Description two", priority: "Medium", completed: false, category: "Personal", tags: ["home"] },
  { id: 3, title: "Third Task", description: "Description three", priority: "Low", completed: false, category: "General", tags: [] },
  { id: 4, title: "Fourth Task", description: "Description four", priority: "Medium", completed: false, category: "Work", tags: ["office"] },
  { id: 5, title: "Fifth Task", description: "Description five", priority: "High", completed: false, category: "Personal", tags: ["urgent", "family"] },
];
const STORAGE_KEY = "task-app-tasks";
function AppContent() {
  const [storedTasks] = useLocalStorage<Task[]>(STORAGE_KEY, INITIAL_TASKS);
  const [tasks, dispatch] = useReducer(taskReducer, storedTasks);
  const setTasks = (value: Task[] | ((prev: Task[]) => Task[])) => {
    if (typeof value === 'function') {
      dispatch({ type: SET_TASKS, payload: value(tasks) });
    } else {
      dispatch({ type: SET_TASKS, payload: value });
    }
  };
  const handleDelete = (id: string | number) => {
    dispatch({ type: SET_TASKS, payload: tasks.filter((t) => t.id !== id) });
  };
  return (
    <BrowserRouter>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<ChallengeList />} /> 
             <Route path="/challenge/21-react-router" element={<TaskApp tasks={tasks} setTasks={setTasks} showForm linkToTaskDetail onDelete={handleDelete} />} />
            <Route path="/challenge/21-react-router/task/:id" element={<TaskDetailPage />} />
            <Route path="/challenge/22-data-fetching" element={<FetchDemoView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
export default App;