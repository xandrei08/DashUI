import React, { useState, useCallback, useMemo } from "react";
import {
  MonetizationEntry,
  ExpenseEntry,
  TrackedPostItem,
  ViewState,
  SocialPlatform,
  ToastMessage,
} from "../../types";
import { MonetizationEntryForm } from "./MonetizationEntryForm";
import { ExpenseEntryForm } from "./ExpenseEntryForm"; // New form for expenses
import { MonetizationSummary } from "./MonetizationSummary";
import Modal from "../common/Modal";
import {
  PlusCircleIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  PencilIcon,
  TrashIcon,
  BriefcaseIcon,
  ReceiptPercentIcon,
  LightBulbIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
} from "../common/Icons";
import {
  getMonetizationTips,
  suggestRevenueStreams,
  isGeminiAvailable,
} from "../../services/geminiService";
import LoadingSpinner from "../common/LoadingSpinner";
import { DEFAULT_PLATFORMS } from "../../constants";

// Helper to escape CSV fields
const escapeCsvField = (field: any): string => {
  if (field === null || typeof field === "undefined") return "";
  const stringField = String(field);
  if (
    stringField.includes(",") ||
    stringField.includes("\n") ||
    stringField.includes('"')
  ) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
};

// Generic CSV export function
const exportToCSV = (
  data: any[],
  filename: string,
  headersOrder?: string[]
) => {
  if (!data || data.length === 0) {
    alert("No data to export.");
    return;
  }
  const headers = headersOrder || Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => escapeCsvField(row[header])).join(",")
    ),
  ];
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

interface MonetizationViewProps {
  monetizationEntries: MonetizationEntry[];
  setMonetizationEntries: React.Dispatch<
    React.SetStateAction<MonetizationEntry[]>
  >;
  expenseEntries: ExpenseEntry[];
  setExpenseEntries: React.Dispatch<React.SetStateAction<ExpenseEntry[]>>;
  trackedPosts: TrackedPostItem[];
  darkMode?: boolean;
  addToast: (message: string, type?: ToastMessage["type"]) => void;
}

type MonetizationSubView = "income" | "expenses";

export const MonetizationView: React.FC<MonetizationViewProps> = ({
  monetizationEntries,
  setMonetizationEntries,
  expenseEntries,
  setExpenseEntries,
  trackedPosts,
  darkMode,
  addToast,
}) => {
  const [currentSubView, setCurrentSubView] =
    useState<MonetizationSubView>("income");
  const [formViewState, setFormViewState] = useState<ViewState>(ViewState.LIST);

  const [editingIncomeEntry, setEditingIncomeEntry] =
    useState<MonetizationEntry | null>(null);
  const [editingExpenseEntry, setEditingExpenseEntry] =
    useState<ExpenseEntry | null>(null);

  const [showTipsModal, setShowTipsModal] = useState<boolean>(false);
  const [monetizationTips, setMonetizationTips] = useState<string[]>([]);
  const [tipsLoading, setTipsLoading] = useState<boolean>(false);
  const [tipsError, setTipsError] = useState<string | null>(null);
  const [selectedPlatformForTips, setSelectedPlatformForTips] =
    useState<string>(
      DEFAULT_PLATFORMS.length > 0 ? DEFAULT_PLATFORMS[0].id : ""
    );

  const [showRevenueSuggestModal, setShowRevenueSuggestModal] =
    useState<boolean>(false);
  const [revenueSuggestions, setRevenueSuggestions] = useState<string[]>([]);
  const [revenueSuggestLoading, setRevenueSuggestLoading] =
    useState<boolean>(false);
  const [revenueSuggestError, setRevenueSuggestError] = useState<string | null>(
    null
  );
  const [selectedPlatformForRevenue, setSelectedPlatformForRevenue] =
    useState<string>(
      DEFAULT_PLATFORMS.length > 0 ? DEFAULT_PLATFORMS[0].id : ""
    );
  const [nicheForRevenue, setNicheForRevenue] = useState<string>("");

  const [filterIncomeStartDate, setFilterIncomeStartDate] =
    useState<string>("");
  const [filterIncomeEndDate, setFilterIncomeEndDate] = useState<string>("");
  const [filterIncomeSource, setFilterIncomeSource] = useState<string>("all");

  const [filterExpenseStartDate, setFilterExpenseStartDate] =
    useState<string>("");
  const [filterExpenseEndDate, setFilterExpenseEndDate] = useState<string>("");
  const [filterExpenseCategory, setFilterExpenseCategory] =
    useState<string>("all");

  const uniqueIncomeSources = useMemo(() => {
    const sources = new Set(monetizationEntries.map((entry) => entry.source));
    return Array.from(sources);
  }, [monetizationEntries]);

  const uniqueExpenseCategories = useMemo(() => {
    const categories = new Set(expenseEntries.map((entry) => entry.category));
    return Array.from(categories);
  }, [expenseEntries]);

  const handleAddIncomeEntry = useCallback(
    (entry: MonetizationEntry) => {
      setMonetizationEntries((prev) => [
        ...prev,
        {
          ...entry,
          id:
            Date.now().toString() + Math.random().toString(36).substring(2, 9),
        },
      ]);
      setFormViewState(ViewState.LIST);
      addToast("Income entry added!", "success");
    },
    [setMonetizationEntries, addToast]
  );

  const handleUpdateIncomeEntry = useCallback(
    (updatedEntry: MonetizationEntry) => {
      setMonetizationEntries((prev) =>
        prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
      );
      setFormViewState(ViewState.LIST);
      setEditingIncomeEntry(null);
      addToast("Income entry updated!", "success");
    },
    [setMonetizationEntries, addToast]
  );

  const handleDeleteIncomeEntry = useCallback(
    (entryId: string) => {
      setMonetizationEntries((prev) => prev.filter((e) => e.id !== entryId));
      addToast("Income entry deleted.", "info");
    },
    [setMonetizationEntries, addToast]
  );

  const handleEditIncomeEntry = useCallback((entry: MonetizationEntry) => {
    setEditingIncomeEntry(entry);
    setFormViewState(ViewState.ADD);
  }, []);

  const handleAddExpenseEntry = useCallback(
    (entry: ExpenseEntry) => {
      setExpenseEntries((prev) => [
        ...prev,
        {
          ...entry,
          id:
            Date.now().toString() + Math.random().toString(36).substring(2, 9),
        },
      ]);
      setFormViewState(ViewState.LIST);
      addToast("Expense entry added!", "success");
    },
    [setExpenseEntries, addToast]
  );

  const handleUpdateExpenseEntry = useCallback(
    (updatedEntry: ExpenseEntry) => {
      setExpenseEntries((prev) =>
        prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
      );
      setFormViewState(ViewState.LIST);
      setEditingExpenseEntry(null);
      addToast("Expense entry updated!", "success");
    },
    [setExpenseEntries, addToast]
  );

  const handleDeleteExpenseEntry = useCallback(
    (entryId: string) => {
      setExpenseEntries((prev) => prev.filter((e) => e.id !== entryId));
      addToast("Expense entry deleted.", "info");
    },
    [setExpenseEntries, addToast]
  );

  const handleEditExpenseEntry = useCallback((entry: ExpenseEntry) => {
    setEditingExpenseEntry(entry);
    setFormViewState(ViewState.ADD);
  }, []);

  const openAddForm = () => {
    if (currentSubView === "income") setEditingIncomeEntry(null);
    else setEditingExpenseEntry(null);
    setFormViewState(ViewState.ADD);
  };

  const closeForm = () => {
    setFormViewState(ViewState.LIST);
    setEditingIncomeEntry(null);
    setEditingExpenseEntry(null);
  };

  const fetchMonetizationTips = async () => {
    if (!selectedPlatformForTips || !isGeminiAvailable()) {
      addToast(
        "AI features require an API key and a selected platform.",
        "warning"
      );
      return;
    }
    setTipsLoading(true);
    setTipsError(null);
    setMonetizationTips([]);
    const platformName =
      DEFAULT_PLATFORMS.find((p) => p.id === selectedPlatformForTips)?.name ||
      "social media";
    const tips = await getMonetizationTips(platformName);
    setTipsLoading(false);
    if (tips) {
      setMonetizationTips(tips);
      addToast(`Fetched tips for ${platformName}!`, "success");
    } else {
      setTipsError(
        "Failed to fetch monetization tips. Please check API key and try again."
      );
      addToast("Failed to fetch AI tips.", "error");
    }
  };

  const fetchRevenueSuggestions = async () => {
    if (
      !selectedPlatformForRevenue ||
      !nicheForRevenue.trim() ||
      !isGeminiAvailable()
    ) {
      addToast(
        "Platform, niche/topic, and AI availability are required.",
        "warning"
      );
      return;
    }
    setRevenueSuggestLoading(true);
    setRevenueSuggestError(null);
    setRevenueSuggestions([]);
    const platformName =
      DEFAULT_PLATFORMS.find((p) => p.id === selectedPlatformForRevenue)
        ?.name || "selected platform";
    const suggestions = await suggestRevenueStreams(
      platformName,
      nicheForRevenue
    );
    setRevenueSuggestLoading(false);
    if (suggestions) {
      setRevenueSuggestions(suggestions);
      addToast(
        `Fetched revenue suggestions for ${platformName} / ${nicheForRevenue}!`,
        "success"
      );
    } else {
      setRevenueSuggestError(
        "Failed to fetch revenue suggestions. Please check API key and try again."
      );
      addToast("Failed to fetch AI revenue suggestions.", "error");
    }
  };

  const filteredIncomeEntries = useMemo(() => {
    return monetizationEntries
      .filter((entry) => {
        const entryDate = new Date(entry.date);
        const startDateMatch =
          !filterIncomeStartDate ||
          entryDate >= new Date(filterIncomeStartDate);
        const endDateMatch =
          !filterIncomeEndDate ||
          entryDate <=
            new Date(new Date(filterIncomeEndDate).setHours(23, 59, 59, 999));
        const sourceMatch =
          filterIncomeSource === "all" || entry.source === filterIncomeSource;
        return startDateMatch && endDateMatch && sourceMatch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [
    monetizationEntries,
    filterIncomeStartDate,
    filterIncomeEndDate,
    filterIncomeSource,
  ]);

  const filteredExpenseEntries = useMemo(() => {
    return expenseEntries
      .filter((entry) => {
        const entryDate = new Date(entry.date);
        const startDateMatch =
          !filterExpenseStartDate ||
          entryDate >= new Date(filterExpenseStartDate);
        const endDateMatch =
          !filterExpenseEndDate ||
          entryDate <=
            new Date(new Date(filterExpenseEndDate).setHours(23, 59, 59, 999));
        const categoryMatch =
          filterExpenseCategory === "all" ||
          entry.category === filterExpenseCategory;
        return startDateMatch && endDateMatch && categoryMatch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [
    expenseEntries,
    filterExpenseStartDate,
    filterExpenseEndDate,
    filterExpenseCategory,
  ]);

  const handleDownloadIncomeCSV = () => {
    const data = filteredIncomeEntries.map((e) => ({
      ID: e.id,
      Source: e.source,
      Amount: e.amount,
      Date: new Date(e.date).toLocaleDateString(),
      Platform:
        DEFAULT_PLATFORMS.find((p) => p.id === e.platformId)?.name || "",
      Notes: e.notes || "",
    }));
    exportToCSV(data, "income_entries.csv");
    addToast("Income data exported!", "success");
  };

  const handleDownloadExpensesCSV = () => {
    const data = filteredExpenseEntries.map((e) => ({
      ID: e.id,
      Category: e.category,
      Description: e.description,
      Amount: e.amount,
      Date: new Date(e.date).toLocaleDateString(),
      Platform:
        DEFAULT_PLATFORMS.find((p) => p.id === e.platformId)?.name || "",
      Notes: e.notes || "",
    }));
    exportToCSV(data, "expense_entries.csv");
    addToast("Expense data exported!", "success");
  };

  const handlePrintView = () => {
    const printableArea = document.getElementById("printableMonetizationArea");
    if (printableArea) {
      document.body.classList.add("printing");
      window.print();
      document.body.classList.remove("printing");
    } else {
      addToast("Printable area not found.", "error");
    }
  };

  const cardBg = `bg-card-default dark:bg-card-dark`;
  const textColor = `text-muted-default dark:text-muted-dark`;
  const titleColor = `text-base-default dark:text-base-dark`;
  const commonInputClasses = `p-2 border rounded-md shadow-sm bg-card-default dark:bg-element-dark border-input-default dark:border-input-dark text-base-default dark:text-base-dark focus:ring-1 ring-focus-default dark:ring-focus-dark focus:border-input-focus-default dark:focus:border-input-focus-dark`;

  const subViewButtonBase = `py-2 px-4 font-medium rounded-md transition-colors text-sm sm:text-base`;
  const activeSubViewButton = `bg-button-accent-default dark:bg-button-accent-dark text-on-button-accent-default dark:text-on-button-accent-dark shadow-md`;
  const inactiveSubViewButton = `bg-element-default dark:bg-element-dark hover:bg-gray-200 dark:hover:bg-slate-600 text-muted-default dark:text-muted-dark`;

  const aiButtonClasses = `flex items-center text-white font-semibold py-2 px-3 rounded-lg shadow-md transition duration-150 ease-in-out text-xs sm:text-sm`;
  const addEntryButtonClasses = `flex items-center text-white font-semibold py-2 px-3 rounded-lg shadow-md transition text-sm`;

  return (
    <div className="bg-page-default dark:bg-page-dark text-base-default dark:text-base-dark p-0 sm:p-4 rounded-lg">
      <div className={`${cardBg} p-4 sm:p-6 rounded-lg shadow-lg`}>
        <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
          <h2 className="text-2xl font-semibold flex items-center">
            <CurrencyDollarIcon
              className={`w-7 h-7 mr-2 text-accent-highlight-default dark:text-accent-highlight-dark`}
            />
            Monetization Hub
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handlePrintView}
              className={`${aiButtonClasses} bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600`}
            >
              <PrinterIcon className="w-4 h-4 mr-1 sm:mr-2" /> Print
            </button>
            {currentSubView === "income" && (
              <button
                onClick={handleDownloadIncomeCSV}
                className={`${aiButtonClasses} bg-green-500 hover:bg-green-600 dark:bg-green-500 dark:hover:bg-green-600`}
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-1 sm:mr-2" /> Income
                CSV
              </button>
            )}
            {currentSubView === "expenses" && (
              <button
                onClick={handleDownloadExpensesCSV}
                className={`${aiButtonClasses} bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600`}
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-1 sm:mr-2" /> Expenses
                CSV
              </button>
            )}
            {isGeminiAvailable() && (
              <>
                <button
                  onClick={() => setShowRevenueSuggestModal(true)}
                  className={`${aiButtonClasses} bg-purple-500 hover:bg-purple-600 dark:bg-purple-500 dark:hover:bg-purple-600`}
                >
                  <LightBulbIcon className="w-4 h-4 mr-1 sm:mr-2" />
                  Suggest Revenue
                </button>
                <button
                  onClick={() => setShowTipsModal(true)}
                  className={`${aiButtonClasses} bg-teal-500 hover:bg-teal-600 dark:bg-teal-500 dark:hover:bg-teal-600`}
                >
                  <SparklesIcon className="w-4 h-4 mr-1 sm:mr-2" />
                  Monetization Tips
                </button>
              </>
            )}
          </div>
        </div>
        <div id="printableMonetizationArea">
          {" "}
          {/* Wrapper for printing */}
          <MonetizationSummary
            incomeEntries={monetizationEntries}
            expenseEntries={expenseEntries}
            darkMode={darkMode}
          />
          <div className="mb-6 flex justify-center sm:justify-start space-x-2 border-b pb-2 border-element-default dark:border-element-dark">
            <button
              onClick={() => setCurrentSubView("income")}
              className={`${subViewButtonBase} ${
                currentSubView === "income"
                  ? activeSubViewButton
                  : inactiveSubViewButton
              }`}
            >
              <ReceiptPercentIcon className="w-5 h-5 mr-2 inline-block" />{" "}
              Income
            </button>
            <button
              onClick={() => setCurrentSubView("expenses")}
              className={`${subViewButtonBase} ${
                currentSubView === "expenses"
                  ? activeSubViewButton
                  : inactiveSubViewButton
              }`}
            >
              <BriefcaseIcon className="w-5 h-5 mr-2 inline-block" /> Expenses
            </button>
          </div>
          {currentSubView === "income" && (
            <div className={`${cardBg} p-4 rounded-lg shadow-inner`}>
              {" "}
              {/* Inner card for income section */}
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-semibold ${titleColor}`}>
                  Income Entries
                </h3>
                <button
                  onClick={openAddForm}
                  className={`${addEntryButtonClasses} bg-button-accent-default dark:bg-button-accent-dark hover:bg-button-accent-hover-default dark:hover:bg-button-accent-hover-dark text-on-button-accent-default dark:text-on-button-accent-dark`}
                >
                  <PlusCircleIcon className="w-4 h-4 mr-2" />
                  Add Income
                </button>
              </div>
              <div
                className={`mb-6 p-4 rounded-md bg-element-default dark:bg-element-dark grid grid-cols-1 md:grid-cols-3 gap-4 items-end`}
              >
                <div>
                  <label
                    htmlFor="filterIncomeStartDate"
                    className={`block text-sm font-medium mb-1 ${textColor}`}
                  >
                    Start Date:
                  </label>
                  <input
                    type="date"
                    id="filterIncomeStartDate"
                    value={filterIncomeStartDate}
                    onChange={(e) => setFilterIncomeStartDate(e.target.value)}
                    className={`${commonInputClasses} w-full`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="filterIncomeEndDate"
                    className={`block text-sm font-medium mb-1 ${textColor}`}
                  >
                    End Date:
                  </label>
                  <input
                    type="date"
                    id="filterIncomeEndDate"
                    value={filterIncomeEndDate}
                    onChange={(e) => setFilterIncomeEndDate(e.target.value)}
                    className={`${commonInputClasses} w-full`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="filterIncomeSource"
                    className={`block text-sm font-medium mb-1 ${textColor}`}
                  >
                    Filter by Source:
                  </label>
                  <select
                    id="filterIncomeSource"
                    value={filterIncomeSource}
                    onChange={(e) => setFilterIncomeSource(e.target.value)}
                    className={`${commonInputClasses} w-full`}
                  >
                    <option value="all">All Sources</option>
                    {uniqueIncomeSources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {filteredIncomeEntries.length === 0 ? (
                <div className={`text-center py-10 ${textColor}`}>
                  <ReceiptPercentIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl">
                    No income recorded{" "}
                    {filterIncomeStartDate ||
                    filterIncomeEndDate ||
                    filterIncomeSource !== "all"
                      ? "that matches your filters"
                      : "yet"}
                    .
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredIncomeEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-3 rounded-md shadow-sm border ${cardBg} flex justify-between items-center border-element-default dark:border-element-dark`}
                    >
                      <div>
                        <p className={`font-medium ${titleColor}`}>
                          {entry.source}
                        </p>
                        <p className={`${textColor} text-sm`}>
                          Amount:{" "}
                          <span className="font-semibold text-positive-default dark:text-positive-dark">
                            ${entry.amount.toFixed(2)}
                          </span>
                        </p>
                        <p className={`${textColor} text-xs`}>
                          Date: {new Date(entry.date).toLocaleDateString()}
                        </p>
                        {entry.platformId && (
                          <p className={`${textColor} text-xs`}>
                            Platform:{" "}
                            {DEFAULT_PLATFORMS.find(
                              (p) => p.id === entry.platformId
                            )?.name || entry.platformId}
                          </p>
                        )}
                        {entry.notes && (
                          <p
                            className={`${textColor} text-xs italic max-w-xs truncate`}
                            title={entry.notes}
                          >
                            Notes: {entry.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditIncomeEntry(entry)}
                          className={`p-1.5 rounded hover:bg-element-default dark:hover:bg-element-dark text-blue-500`}
                          title="Edit Income"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteIncomeEntry(entry.id)}
                          className={`p-1.5 rounded hover:bg-element-default dark:hover:bg-element-dark text-red-500`}
                          title="Delete Income"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {currentSubView === "expenses" && (
            <div className={`${cardBg} p-4 rounded-lg shadow-inner`}>
              {" "}
              {/* Inner card for expense section */}
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-semibold ${titleColor}`}>
                  Expense Entries
                </h3>
                <button
                  onClick={openAddForm}
                  className={`${addEntryButtonClasses} bg-button-accent-default dark:bg-button-accent-dark hover:bg-button-accent-hover-default dark:hover:bg-button-accent-hover-dark text-on-button-accent-default dark:text-on-button-accent-dark`}
                >
                  <PlusCircleIcon className="w-4 h-4 mr-2" />
                  Add Expense
                </button>
              </div>
              <div
                className={`mb-6 p-4 rounded-md bg-element-default dark:bg-element-dark grid grid-cols-1 md:grid-cols-3 gap-4 items-end`}
              >
                <div>
                  <label
                    htmlFor="filterExpenseStartDate"
                    className={`block text-sm font-medium mb-1 ${textColor}`}
                  >
                    Start Date:
                  </label>
                  <input
                    type="date"
                    id="filterExpenseStartDate"
                    value={filterExpenseStartDate}
                    onChange={(e) => setFilterExpenseStartDate(e.target.value)}
                    className={`${commonInputClasses} w-full`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="filterExpenseEndDate"
                    className={`block text-sm font-medium mb-1 ${textColor}`}
                  >
                    End Date:
                  </label>
                  <input
                    type="date"
                    id="filterExpenseEndDate"
                    value={filterExpenseEndDate}
                    onChange={(e) => setFilterExpenseEndDate(e.target.value)}
                    className={`${commonInputClasses} w-full`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="filterExpenseCategory"
                    className={`block text-sm font-medium mb-1 ${textColor}`}
                  >
                    Filter by Category:
                  </label>
                  <select
                    id="filterExpenseCategory"
                    value={filterExpenseCategory}
                    onChange={(e) => setFilterExpenseCategory(e.target.value)}
                    className={`${commonInputClasses} w-full`}
                  >
                    <option value="all">All Categories</option>
                    {uniqueExpenseCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {filteredExpenseEntries.length === 0 ? (
                <div className={`text-center py-10 ${textColor}`}>
                  <BriefcaseIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl">
                    No expenses recorded{" "}
                    {filterExpenseStartDate ||
                    filterExpenseEndDate ||
                    filterExpenseCategory !== "all"
                      ? "that matches your filters"
                      : "yet"}
                    .
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredExpenseEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-3 rounded-md shadow-sm border ${cardBg} flex justify-between items-center border-element-default dark:border-element-dark`}
                    >
                      <div>
                        <p className={`font-medium ${titleColor}`}>
                          {entry.category} -{" "}
                          <span className="text-sm font-normal">
                            {entry.description}
                          </span>
                        </p>
                        <p className={`${textColor} text-sm`}>
                          Amount:{" "}
                          <span className="font-semibold text-negative-default dark:text-negative-dark">
                            -${entry.amount.toFixed(2)}
                          </span>
                        </p>
                        <p className={`${textColor} text-xs`}>
                          Date: {new Date(entry.date).toLocaleDateString()}
                        </p>
                        {entry.platformId && (
                          <p className={`${textColor} text-xs`}>
                            Platform:{" "}
                            {DEFAULT_PLATFORMS.find(
                              (p) => p.id === entry.platformId
                            )?.name || entry.platformId}
                          </p>
                        )}
                        {entry.notes && (
                          <p
                            className={`${textColor} text-xs italic max-w-xs truncate`}
                            title={entry.notes}
                          >
                            Notes: {entry.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditExpenseEntry(entry)}
                          className={`p-1.5 rounded hover:bg-element-default dark:hover:bg-element-dark text-blue-500`}
                          title="Edit Expense"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpenseEntry(entry.id)}
                          className={`p-1.5 rounded hover:bg-element-default dark:hover:bg-element-dark text-red-500`}
                          title="Delete Expense"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>{" "}
        {/* End of printableMonetizationArea */}
      </div>{" "}
      {/* End of main card wrapper */}
      {/* Modals for Forms */}
      <Modal
        isOpen={formViewState === ViewState.ADD && currentSubView === "income"}
        onClose={closeForm}
        title={
          editingIncomeEntry ? "Edit Income Entry" : "Add New Income Entry"
        }
        darkMode={darkMode}
      >
        <MonetizationEntryForm
          onSave={
            editingIncomeEntry ? handleUpdateIncomeEntry : handleAddIncomeEntry
          }
          onCancel={closeForm}
          initialEntry={editingIncomeEntry}
          trackedPosts={trackedPosts}
          platforms={DEFAULT_PLATFORMS}
          darkMode={darkMode}
        />
      </Modal>
      <Modal
        isOpen={
          formViewState === ViewState.ADD && currentSubView === "expenses"
        }
        onClose={closeForm}
        title={
          editingExpenseEntry ? "Edit Expense Entry" : "Add New Expense Entry"
        }
        darkMode={darkMode}
      >
        <ExpenseEntryForm
          onSave={
            editingExpenseEntry
              ? handleUpdateExpenseEntry
              : handleAddExpenseEntry
          }
          onCancel={closeForm}
          initialEntry={editingExpenseEntry}
          platforms={DEFAULT_PLATFORMS}
          darkMode={darkMode}
        />
      </Modal>
      {/* Modals for AI Features */}
      <Modal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        title="AI Monetization Tips"
        darkMode={darkMode}
      >
        <div className="space-y-3">
          <div>
            <label
              htmlFor="platformForTips"
              className={`block text-sm font-medium text-muted-default dark:text-muted-dark mb-1`}
            >
              Select Platform:
            </label>
            <select
              id="platformForTips"
              value={selectedPlatformForTips}
              onChange={(e) => setSelectedPlatformForTips(e.target.value)}
              className={`${commonInputClasses} w-full`}
            >
              {DEFAULT_PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
              <option value="general">General Social Media</option>
            </select>
          </div>
          <button
            onClick={fetchMonetizationTips}
            disabled={tipsLoading || !selectedPlatformForTips}
            className={`w-full flex items-center justify-center bg-button-accent-default dark:bg-button-accent-dark hover:bg-button-accent-hover-default dark:hover:bg-button-accent-hover-dark text-on-button-accent-default dark:text-on-button-accent-dark font-semibold py-2 px-3 rounded-md shadow-sm transition disabled:opacity-60`}
          >
            {tipsLoading ? (
              <LoadingSpinner size="sm" darkMode={!darkMode} />
            ) : (
              <>
                <SparklesIcon className="w-4 h-4 mr-2" /> Get Tips
              </>
            )}
          </button>
          {tipsError && (
            <p className="text-sm text-negative-default dark:text-negative-dark">
              {tipsError}
            </p>
          )}
          {monetizationTips.length > 0 && (
            <ul
              className={`list-disc list-inside space-y-1 pl-2 text-sm text-base-default dark:text-base-dark`}
            >
              {monetizationTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          )}
          {!isGeminiAvailable() && (
            <p className={`text-sm text-yellow-500 dark:text-yellow-400`}>
              AI features are disabled. Please set API_KEY.
            </p>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={showRevenueSuggestModal}
        onClose={() => setShowRevenueSuggestModal(false)}
        title="AI Revenue Suggestions"
        darkMode={darkMode}
      >
        <div className="space-y-3">
          <div>
            <label
              htmlFor="platformForRevenue"
              className={`block text-sm font-medium text-muted-default dark:text-muted-dark mb-1`}
            >
              Select Platform:
            </label>
            <select
              id="platformForRevenue"
              value={selectedPlatformForRevenue}
              onChange={(e) => setSelectedPlatformForRevenue(e.target.value)}
              className={`${commonInputClasses} w-full`}
            >
              {DEFAULT_PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="nicheForRevenue"
              className={`block text-sm font-medium text-muted-default dark:text-muted-dark mb-1`}
            >
              Your Niche/Topic:
            </label>
            <input
              type="text"
              id="nicheForRevenue"
              value={nicheForRevenue}
              onChange={(e) => setNicheForRevenue(e.target.value)}
              className={`${commonInputClasses} w-full`}
              placeholder="e.g., Travel Vlogging, Fitness Coaching"
            />
          </div>
          <button
            onClick={fetchRevenueSuggestions}
            disabled={
              revenueSuggestLoading ||
              !selectedPlatformForRevenue ||
              !nicheForRevenue.trim()
            }
            className={`w-full flex items-center justify-center bg-button-accent-default dark:bg-button-accent-dark hover:bg-button-accent-hover-default dark:hover:bg-button-accent-hover-dark text-on-button-accent-default dark:text-on-button-accent-dark font-semibold py-2 px-3 rounded-md shadow-sm transition disabled:opacity-60`}
          >
            {revenueSuggestLoading ? (
              <LoadingSpinner size="sm" darkMode={!darkMode} />
            ) : (
              <>
                <LightBulbIcon className="w-4 h-4 mr-2" /> Suggest Revenue
                Streams
              </>
            )}
          </button>
          {revenueSuggestError && (
            <p className="text-sm text-negative-default dark:text-negative-dark">
              {revenueSuggestError}
            </p>
          )}
          {revenueSuggestions.length > 0 && (
            <ul
              className={`list-disc list-inside space-y-1.5 pl-2 text-sm text-base-default dark:text-base-dark`}
            >
              {revenueSuggestions.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          )}
          {!isGeminiAvailable() && (
            <p className={`text-sm text-yellow-500 dark:text-yellow-400`}>
              AI features are disabled. Please set API_KEY.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};
