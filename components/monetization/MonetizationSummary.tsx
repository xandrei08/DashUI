import React from 'react';
import { MonetizationEntry, ExpenseEntry } from '../../types'; // Added ExpenseEntry

interface MonetizationSummaryProps {
  incomeEntries: MonetizationEntry[];
  expenseEntries: ExpenseEntry[]; // New prop for expenses
  darkMode?: boolean; // darkMode prop is less critical if using semantic classes
}

export const MonetizationSummary: React.FC<MonetizationSummaryProps> = ({ incomeEntries, expenseEntries }) => {
  const totalEarnings = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0); // Calculate total expenses
  const netProfit = totalEarnings - totalExpenses; // Calculate net profit

  const summaryCardClasses = `bg-card-default dark:bg-card-dark text-base-default dark:text-base-dark p-4 rounded-lg shadow-lg border border-card-default dark:border-card-dark`;
  const labelClasses = `text-muted-default dark:text-muted-dark text-sm`;
  
  const getValueClasses = (value: number, context?: 'profit' | 'expense' | 'income') => {
    let colorClass = 'text-accent-highlight-default dark:text-accent-highlight-dark'; // Default accent
    
    if (context === 'profit') {
      colorClass = value >= 0 ? 'text-positive-default dark:text-positive-dark' : 'text-negative-default dark:text-negative-dark';
    } else if (context === 'expense') {
      colorClass = 'text-negative-default dark:text-negative-dark';
    } else if (context === 'income') {
      colorClass = 'text-positive-default dark:text-positive-dark';
    }
    // If no context, and value is negative, assume it's a loss/negative.
    // This part is a bit tricky without more context, but for a general summary it might be okay.
    // For clarity, the MonetizationSummary explicitly passes context.
    else if (value < 0) { 
        colorClass = 'text-negative-default dark:text-negative-dark';
    }


    return `text-2xl font-semibold ${colorClass}`;
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className={summaryCardClasses}>
        <p className={labelClasses}>Gross Income</p>
        <p className={getValueClasses(totalEarnings, 'income')}>${totalEarnings.toFixed(2)}</p>
      </div>
      <div className={summaryCardClasses}>
        <p className={labelClasses}>Total Expenses</p>
        {/* Expenses are positive numbers but represent a negative impact on profit */}
        <p className={getValueClasses(totalExpenses, 'expense')}>${totalExpenses.toFixed(2)}</p> 
      </div>
      <div className={summaryCardClasses}>
        <p className={labelClasses}>Net Profit / Loss</p>
        <p className={getValueClasses(netProfit, 'profit')}>
          {netProfit < 0 ? `-$${Math.abs(netProfit).toFixed(2)}` : `$${netProfit.toFixed(2)}`}
        </p>
      </div>
    </div>
  );
};