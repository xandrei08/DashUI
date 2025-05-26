import React, { useState, useEffect } from "react";
import { ExpenseEntry, SocialPlatform } from "../../types";

interface ExpenseEntryFormProps {
  onSave: (entry: ExpenseEntry) => void;
  onCancel: () => void;
  initialEntry?: ExpenseEntry | null;
  platforms: SocialPlatform[];
  darkMode?: boolean;
}

// Common expense categories
const COMMON_EXPENSE_CATEGORIES = [
  "Software & Tools",
  "Advertising & Promotion",
  "Equipment",
  "Outsourcing & Freelancers",
  "Education & Courses",
  "Travel (Content Related)",
  "Office Supplies",
  "Other",
];

export const ExpenseEntryForm: React.FC<ExpenseEntryFormProps> = ({
  onSave,
  onCancel,
  initialEntry,
  platforms,
  darkMode,
}) => {
  const [category, setCategory] = useState<string>(
    initialEntry?.category || COMMON_EXPENSE_CATEGORIES[0]
  );
  const [description, setDescription] = useState<string>(
    initialEntry?.description || ""
  );
  const [amount, setAmount] = useState<number>(initialEntry?.amount || 0);
  const [date, setDate] = useState<string>(
    initialEntry?.date
      ? new Date(initialEntry.date).toISOString().substring(0, 10)
      : new Date().toISOString().substring(0, 10)
  );
  const [platformId, setPlatformId] = useState<string>(
    initialEntry?.platformId || ""
  );
  const [notes, setNotes] = useState<string>(initialEntry?.notes || "");

  useEffect(() => {
    if (initialEntry) {
      setCategory(initialEntry.category);
      setDescription(initialEntry.description);
      setAmount(initialEntry.amount);
      setDate(new Date(initialEntry.date).toISOString().substring(0, 10));
      setPlatformId(initialEntry.platformId || "");
      setNotes(initialEntry.notes || "");
    } else {
      // Reset for new entry
      setCategory(COMMON_EXPENSE_CATEGORIES[0]);
      setDescription("");
      setAmount(0);
      setDate(new Date().toISOString().substring(0, 10));
      setPlatformId("");
      setNotes("");
    }
  }, [initialEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !description || amount <= 0 || !date) {
      alert(
        "Please fill in Category, Description, Amount (greater than 0), and Date."
      );
      return;
    }
    onSave({
      id: initialEntry?.id || Date.now().toString(),
      category,
      description,
      amount,
      date: new Date(date).toISOString(),
      platformId: platformId || undefined,
      notes: notes || undefined,
    });
  };

  const inputClasses = `block w-full sm:text-sm border rounded-md p-2 shadow-sm bg-card-default dark:bg-slate-700 border-input-default dark:border-slate-600 text-base-default dark:text-slate-100 focus:ring-1 ring-focus-default dark:ring-focus-dark focus:border-input-focus-default dark:focus:border-input-focus-dark`;
  const labelClasses = `block text-sm font-medium text-muted-default dark:text-slate-300 mb-1`;
  const buttonBase = `py-2 px-4 rounded-md font-medium transition`;
  // For expense form, the primary action button uses red/rose tones
  const primaryExpenseButton = `bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 text-white shadow-sm`;
  const secondaryButton = `bg-button-secondary-default dark:bg-button-secondary-dark text-on-button-secondary-default dark:text-on-button-secondary-dark hover:bg-button-secondary-hover-default dark:hover:bg-button-secondary-hover-dark`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="category" className={labelClasses}>
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClasses}
          required
        >
          {COMMON_EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="description" className={labelClasses}>
          Description
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClasses}
          required
          placeholder="e.g., Monthly Adobe CC Subscription"
        />
      </div>
      <div>
        <label htmlFor="amount" className={labelClasses}>
          Amount ($)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          min="0.01"
          step="0.01"
          className={inputClasses}
          required
        />
      </div>
      <div>
        <label htmlFor="date" className={labelClasses}>
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClasses}
          required
        />
      </div>
      <div>
        <label htmlFor="platformId" className={labelClasses}>
          Associated Platform (Optional)
        </label>
        <select
          id="platformId"
          value={platformId}
          onChange={(e) => setPlatformId(e.target.value)}
          className={inputClasses}
        >
          <option value="">Select Platform</option>
          {platforms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="notes" className={labelClasses}>
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className={inputClasses}
          placeholder="Any additional details..."
        ></textarea>
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className={`${buttonBase} ${secondaryButton}`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`${buttonBase} ${primaryExpenseButton} bg-button-accent-default dark:bg-button-accent-dark hover:bg-button-accent-hover-default dark:hover:bg-button-accent-hover-dark text-on-button-accent-default dark:text-on-button-accent-dark`}
        >
          {initialEntry ? "Save Changes" : "Add Expense"}
        </button>
      </div>
    </form>
  );
};
