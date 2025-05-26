import React, { useState, useCallback, useEffect } from "react";
import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import { PlannerView } from "./components/planner/PlannerView";
import { TrackerView } from "./components/tracker/TrackerView";
import { MonetizationView } from "./components/monetization/MonetizationView";
import { OverviewView } from "./components/overview/OverviewView";
import {
  Squares2X2Icon,
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  SunIcon,
  MoonIcon,
  XMarkIcon,
  SparklesIcon,
} from "./components/common/Icons";
import {
  SocialPlatform,
  ScheduledPost,
  TrackedAccount,
  MonetizationEntry,
  ExpenseEntry,
  ToastMessage,
} from "./types";
import { DEFAULT_PLATFORMS } from "./constants";

const LOCAL_STORAGE_KEYS = {
  SCHEDULED_POSTS: "socialDashboard_scheduledPosts",
  TRACKED_ACCOUNTS: "socialDashboard_trackedAccounts",
  MONETIZATION_ENTRIES: "socialDashboard_monetizationEntries",
  EXPENSE_ENTRIES: "socialDashboard_expenseEntries",
  DARK_MODE: "socialDashboard_darkMode",
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem(LOCAL_STORAGE_KEYS.DARK_MODE);
    if (savedMode !== null) return savedMode === "true";
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SCHEDULED_POSTS);
    return saved ? JSON.parse(saved) : [];
  });
  const [trackedAccounts, setTrackedAccounts] = useState<TrackedAccount[]>(
    () => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TRACKED_ACCOUNTS);
      return saved ? JSON.parse(saved) : [];
    }
  );
  const [monetizationEntries, setMonetizationEntries] = useState<
    MonetizationEntry[]
  >(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.MONETIZATION_ENTRIES);
    return saved ? JSON.parse(saved) : [];
  });
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.EXPENSE_ENTRIES);
    return saved ? JSON.parse(saved) : [];
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.SCHEDULED_POSTS,
      JSON.stringify(scheduledPosts)
    );
  }, [scheduledPosts]);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.TRACKED_ACCOUNTS,
      JSON.stringify(trackedAccounts)
    );
  }, [trackedAccounts]);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.MONETIZATION_ENTRIES,
      JSON.stringify(monetizationEntries)
    );
  }, [monetizationEntries]);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.EXPENSE_ENTRIES,
      JSON.stringify(expenseEntries)
    );
  }, [expenseEntries]);

  const addToast = useCallback(
    (message: string, type: ToastMessage["type"] = "info") => {
      const id =
        Date.now().toString() + Math.random().toString(36).substring(2, 9);
      setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
      setTimeout(() => {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== id)
        );
      }, 5000);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem(LOCAL_STORAGE_KEYS.DARK_MODE, newMode.toString());
      return newMode;
    });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: <Squares2X2Icon className="w-5 h-5 mr-2" />,
    },
    {
      path: "/planner",
      label: "Planner",
      icon: <CalendarIcon className="w-5 h-5 mr-2" />,
    },
    {
      path: "/tracker",
      label: "Tracker",
      icon: <ChartBarIcon className="w-5 h-5 mr-2" />,
    },
    {
      path: "/monetization",
      label: "Monetization",
      icon: <CurrencyDollarIcon className="w-5 h-5 mr-2" />,
    },
  ];

  const getToastStyles = (type: ToastMessage["type"]) => {
    // Dark mode styles with revised palette
    if (darkMode) {
      switch (type) {
        case "success":
          return "bg-green-700 text-green-100 border border-green-600"; // Darker green, light text
        case "error":
          return "bg-red-700 text-red-100 border border-red-600"; // Darker red, light text
        case "warning":
          return "bg-yellow-500 text-gray-900 border border-yellow-600"; // Yellow, dark text for contrast
        case "info":
        default:
          return "bg-pastel-deep-blue-700 text-pastel-blue-200 border border-pastel-deep-blue-600"; // Element bg, base text
      }
    }
    // Light mode uses new palette: white cards, dark gray text, blue accent
    switch (type) {
      case "success":
        return "bg-green-100 text-green-700 border border-green-200";
      case "error":
        return "bg-red-100 text-red-700 border border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "info":
      default:
        return "bg-blue-100 text-blue-700 border border-blue-200";
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-page-default dark:bg-page-dark text-base-default dark:text-base-dark">
        <header className="shadow-md bg-card-default dark:bg-card-dark text-base-default dark:text-base-dark p-4 border-b border-card-default dark:border-card-dark">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <SparklesIcon className="w-8 h-8 mr-3 text-button-accent-default dark:text-accent-highlight-dark" />
              <h1 className="text-2xl font-bold">Social Media Dashboard</h1>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full focus:outline-none focus:ring-2 ring-focus-default dark:ring-focus-dark hover:bg-element-default dark:hover:bg-element-dark"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="w-6 h-6 text-yellow-400" />
              ) : (
                <MoonIcon className="w-6 h-6 text-muted-default dark:text-pastel-blue-300" />
              )}
            </button>
          </div>
        </header>

        <nav className="bg-card-default dark:bg-card-dark shadow-sm p-2 sm:p-4 border-b border-card-default dark:border-card-dark">
          <ul className="container mx-auto flex space-x-2 sm:space-x-4 justify-center sm:justify-start">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                    ${
                      isActive
                        ? "bg-button-accent-default dark:bg-button-accent-dark text-on-button-accent-default dark:text-on-button-accent-dark"
                        : "text-muted-default dark:text-muted-dark hover:bg-element-default dark:hover:bg-element-dark hover:text-base-default dark:hover:text-base-dark"
                    }`
                  }
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-grow container mx-auto p-4 sm:p-6 relative">
          <Routes>
            <Route
              path="/"
              element={
                <OverviewView
                  scheduledPosts={scheduledPosts}
                  trackedAccounts={trackedAccounts}
                  monetizationEntries={monetizationEntries}
                  expenseEntries={expenseEntries}
                  darkMode={darkMode} // darkMode prop still useful for direct conditional styling if needed
                  addToast={addToast}
                />
              }
            />
            <Route
              path="/planner"
              element={
                <PlannerView
                  scheduledPosts={scheduledPosts}
                  setScheduledPosts={setScheduledPosts}
                  platforms={DEFAULT_PLATFORMS}
                  darkMode={darkMode}
                  addToast={addToast}
                />
              }
            />
            <Route
              path="/tracker"
              element={
                <TrackerView
                  trackedAccounts={trackedAccounts}
                  setTrackedAccounts={setTrackedAccounts}
                  platforms={DEFAULT_PLATFORMS}
                  darkMode={darkMode}
                  addToast={addToast}
                />
              }
            />
            <Route
              path="/monetization"
              element={
                <MonetizationView
                  monetizationEntries={monetizationEntries}
                  setMonetizationEntries={setMonetizationEntries}
                  expenseEntries={expenseEntries}
                  setExpenseEntries={setExpenseEntries}
                  trackedPosts={trackedAccounts.flatMap((acc) => acc.posts)}
                  darkMode={darkMode}
                  addToast={addToast}
                />
              }
            />
          </Routes>
        </main>

        <footer className="text-center p-4 bg-element-default dark:bg-element-dark text-muted-default dark:text-muted-dark text-sm border-t border-card-default dark:border-card-dark">
          © {new Date().getFullYear()} Social Media Dashboard.
        </footer>

        {/* Toast Container */}
        <div className="toast-container fixed bottom-5 right-5 space-y-3 z-[100]">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`p-4 rounded-md shadow-lg flex items-center justify-between text-sm min-w-[250px] max-w-xs ${getToastStyles(
                toast.type
              )}`}
              role="alert"
              aria-live="assertive"
            >
              <span>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-2 p-1 rounded-full hover:bg-black hover:bg-opacity-20 transition-colors"
                aria-label="Close notification"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
