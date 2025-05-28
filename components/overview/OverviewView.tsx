import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ScheduledPost,
  TrackedAccount,
  MonetizationEntry,
  ExpenseEntry,
  ToastMessage,
} from "../../types";
import {
  CalendarDaysIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "../common/Icons";

interface OverviewViewProps {
  scheduledPosts: ScheduledPost[];
  trackedAccounts: TrackedAccount[];
  monetizationEntries: MonetizationEntry[];
  expenseEntries: ExpenseEntry[];
  darkMode?: boolean; // darkMode prop can be removed if not directly used for logic other than what Tailwind handles
  addToast: (message: string, type?: ToastMessage["type"]) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  scheduledPosts,
  trackedAccounts,
  monetizationEntries,
  expenseEntries,
  // darkMode prop is generally not needed here as Tailwind handles it
}) => {
  const overviewData = useMemo(() => {
    const upcomingPostsCount = scheduledPosts.filter(
      (p) => p.status === "scheduled" && new Date(p.scheduledTime) >= new Date()
    ).length;

    const trackedAccountsCount = trackedAccounts.length;
    const totalTrackedPostsCount = trackedAccounts.reduce(
      (sum, acc) => sum + acc.posts.length,
      0
    );

    const totalEarnings = monetizationEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );
    const totalExpensesNum = expenseEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );
    const netProfit = totalEarnings - totalExpensesNum;

    return {
      upcomingPostsCount,
      trackedAccountsCount,
      totalTrackedPostsCount,
      netProfit,
      totalEarnings,
      totalExpenses: totalExpensesNum,
    };
  }, [scheduledPosts, trackedAccounts, monetizationEntries, expenseEntries]);

  // Semantic classes handle dark/light mode
  const cardBaseClass = `p-6 rounded-lg shadow-lg transition-all hover:shadow-xl bg-card-default dark:bg-card-dark border border-card-default dark:border-card-dark`;
  const cardLinkClass = `text-sm font-medium mt-3 inline-block text-accent-highlight-default dark:text-accent-highlight-dark hover:opacity-80`;
  const statValueClass = `text-3xl font-bold text-accent-highlight-default dark:text-accent-highlight-dark`;

  const quickActionCardClass = `p-6 rounded-lg shadow-lg transition-all hover:shadow-xl flex flex-col bg-card-default dark:bg-card-dark border border-card-default dark:border-card-dark`;
  const quickActionIconContainerClass = `p-3 rounded-full mb-3 self-start bg-element-default dark:bg-element-dark`;
  const quickActionTitleClass = `text-lg font-semibold mb-1 text-base-default dark:text-base-dark`;
  const quickActionDescClass = `text-sm text-muted-secondary dark:text-muted-dark`;

  const getFinancialColor = (
    value: number,
    isExpenseRelated: boolean = false
  ) => {
    // Use semantic text color classes
    if (isExpenseRelated)
      return "text-negative-default dark:text-negative-dark";
    if (value >= 0) return "text-positive-default dark:text-positive-dark";
    return "text-negative-default dark:text-negative-dark";
  };

  const gettingStartedLinkClass = `font-semibold text-accent-highlight-default dark:text-accent-highlight-dark hover:opacity-80`;
  const gettingStartedCardClass = `p-6 rounded-lg shadow-lg bg-card-default dark:bg-card-dark border border-card-default dark:border-card-dark`;

  return (
    <div className="text-base-default dark:text-base-dark">
      <h1 className="text-3xl font-bold mb-8 text-base-default dark:text-base-dark">
        Welcome to your Social Media Suite!
      </h1>

      {/* Top Row Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Planner Overview Card */}
        <div className={cardBaseClass}>
          <div className="flex items-center mb-3">
            <CalendarDaysIcon className="w-7 h-7 mr-3 text-accent-highlight-default dark:text-accent-highlight-dark" />
            <h2 className="text-xl font-semibold text-base-default dark:text-base-dark">
              Planner Overview
            </h2>
          </div>
          <p className="text-sm mb-1 text-muted-secondary dark:text-muted-dark">
            Upcoming Posts:{" "}
            <span className={statValueClass}>
              {overviewData.upcomingPostsCount}
            </span>
          </p>
          <Link to="/planner" className={cardLinkClass}>
            Go to Planner &rarr;
          </Link>
        </div>

        {/* Tracker Snapshot Card */}
        <div className={cardBaseClass}>
          <div className="flex items-center mb-3">
            <ChartBarIcon className="w-7 h-7 mr-3 text-accent-highlight-default dark:text-accent-highlight-dark" />
            <h2 className="text-xl font-semibold text-base-default dark:text-base-dark">
              Tracker Snapshot
            </h2>
          </div>
          <p className="text-sm mb-1 text-muted-secondary dark:text-muted-dark">
            Tracked Accounts:{" "}
            <span className={statValueClass}>
              {overviewData.trackedAccountsCount}
            </span>
          </p>
          <p className="text-sm text-muted-secondary dark:text-muted-dark">
            Total Tracked Posts:{" "}
            <span className={statValueClass}>
              {overviewData.totalTrackedPostsCount}
            </span>
          </p>
          <Link to="/tracker" className={cardLinkClass}>
            Go to Tracker &rarr;
          </Link>
        </div>

        {/* Financials Card */}
        <div className={cardBaseClass}>
          <div className="flex items-center mb-3">
            <CurrencyDollarIcon className="w-7 h-7 mr-3 text-accent-highlight-default dark:text-accent-highlight-dark" />
            <h2 className="text-xl font-semibold text-base-default dark:text-base-dark">
              Financials
            </h2>
          </div>
          <p className="text-sm mb-1 text-muted-secondary dark:text-muted-dark">
            Net Profit:{" "}
            <span
              className={`font-bold text-lg ${getFinancialColor(
                overviewData.netProfit
              )}`}
            >
              ${overviewData.netProfit.toFixed(2)}
            </span>
          </p>
          <p className={`text-xs text-muted-secondary dark:text-muted-dark`}>
            Total Earnings:{" "}
            <span className={getFinancialColor(overviewData.totalEarnings)}>
              ${overviewData.totalEarnings.toFixed(2)}
            </span>
          </p>
          <p className={`text-xs text-muted-secondary dark:text-muted-dark`}>
            Total Expenses:{" "}
            <span
              className={getFinancialColor(overviewData.totalExpenses, true)}
            >
              ${overviewData.totalExpenses.toFixed(2)}
            </span>
          </p>
          <Link to="/monetization" className={cardLinkClass}>
            Go to Monetization &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Actions Section */}
      <h2 className="text-2xl font-semibold mb-6 text-base-default dark:text-base-dark">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link to="/planner" className={quickActionCardClass}>
          <div className={quickActionIconContainerClass}>
            <PlusCircleIcon className="w-7 h-7 text-accent-highlight-default dark:text-accent-highlight-dark" />
          </div>
          <h3 className={quickActionTitleClass}>Schedule a Post</h3>
          <p className={quickActionDescClass}>
            Go directly to the content planner to schedule new posts.
          </p>
        </Link>
        <Link to="/tracker" className={quickActionCardClass}>
          <div className={quickActionIconContainerClass}>
            <ChartBarIcon className="w-7 h-7 text-accent-highlight-default dark:text-accent-highlight-dark" />
          </div>
          <h3 className={quickActionTitleClass}>Track New Account</h3>
          <p className={quickActionDescClass}>
            Start tracking performance for a new social media account or
            specific posts.
          </p>
        </Link>
        <Link to="/monetization" className={quickActionCardClass}>
          <div className={quickActionIconContainerClass}>
            <ClipboardDocumentListIcon className="w-7 h-7 text-accent-highlight-default dark:text-accent-highlight-dark" />
          </div>
          <h3 className={quickActionTitleClass}>Add Earning/Expense</h3>
          <p className={quickActionDescClass}>
            Log your latest income or business expenses to keep finances up to
            date.
          </p>
        </Link>
      </div>

      {/* Getting Started Guide */}
      <div className={gettingStartedCardClass}>
        <h2 className="text-2xl font-semibold mb-4 text-base-default dark:text-base-dark">
          Getting Started
        </h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <CheckCircleIcon
              className={`w-5 h-5 mr-3 mt-1 flex-shrink-0 text-positive-default dark:text-positive-dark`}
            />
            <span className="text-muted-secondary dark:text-muted-dark">
              Use the{" "}
              <Link to="/planner" className={gettingStartedLinkClass}>
                Planner
              </Link>{" "}
              to schedule your upcoming social media posts and visualize them on
              a calendar.
            </span>
          </li>
          <li className="flex items-start">
            <CheckCircleIcon
              className={`w-5 h-5 mr-3 mt-1 flex-shrink-0 text-positive-default dark:text-positive-dark`}
            />
            <span className="text-muted-secondary dark:text-muted-dark">
              Head to the{" "}
              <Link to="/tracker" className={gettingStartedLinkClass}>
                Tracker
              </Link>{" "}
              to monitor the performance of your accounts and posts. Set goals
              and get AI insights!
            </span>
          </li>
          <li className="flex items-start">
            <CheckCircleIcon
              className={`w-5 h-5 mr-3 mt-1 flex-shrink-0 text-positive-default dark:text-positive-dark`}
            />
            <span className="text-muted-secondary dark:text-muted-dark">
              Manage your income and expenses in the{" "}
              <Link to="/monetization" className={gettingStartedLinkClass}>
                Monetization
              </Link>{" "}
              hub. Leverage AI for monetization tips and new revenue ideas.
            </span>
          </li>
          <li className="flex items-start">
            <InformationCircleIcon
              className={`w-5 h-5 mr-3 mt-1 flex-shrink-0 text-accent-highlight-default dark:text-muted-dark`}
            />{" "}
            {/* Info icon can use muted or accent */}
            <span className="text-muted-secondary dark:text-muted-dark">
              Remember to manually input performance data in the Tracker, as
              direct API integration is not yet available.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
