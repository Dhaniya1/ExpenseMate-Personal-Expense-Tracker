import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../index.css";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import Lottie from "lottie-react";
import financeAnimation from "../assets/Revenue.json";
import analyticsAnimation from "../assets/Charts.json";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Expense = {
  id: number;
  amount: number;
  category: string;
  date: string;
  comment: string;
};

const Dashboard = () => {
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const { logout } = useAuth();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(getTodayDate());
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState("today");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Other",
  ];

  const fetchExpenses = async () => {
    const res = await API.get("/expenses/");
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Number(amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    const payload = {
      amount: Number(amount),
      category,
      date,
      comment,
    };

    if (editingId) {
      await API.put(`/expenses/${editingId}`, payload);
    } else {
      await API.post("/expenses/", payload);
    }

    resetForm();
    fetchExpenses();
  };

  const deleteExpense = async (id: number) => {
    await API.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setAmount(String(expense.amount));
    setCategory(expense.category);
    setDate(expense.date);
    setComment(expense.comment || "");
  };

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setDate(getTodayDate());
    setComment("");
    setEditingId(null);
  };

  const getCurrentMonthTotal = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses
      .filter((e) => {
        const expenseDate = new Date(e.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const monthlyTotal = getCurrentMonthTotal();
  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
  });

  const getCategoryData = () => {
    const categoryTotals: { [key: string]: number } = {};

    expenses
      .filter((e) => {
        const expenseDate = new Date(e.date);
        const selected = new Date(selectedDate);
        return (
          expenseDate.getMonth() === selected.getMonth() &&
          expenseDate.getFullYear() === selected.getFullYear()
        );
      })
      .forEach((e) => {
        if (!categoryTotals[e.category]) {
          categoryTotals[e.category] = 0;
        }
        categoryTotals[e.category] += e.amount;
      });

    return Object.keys(categoryTotals).map((category) => ({
      name: category,
      value: categoryTotals[category],
    }));
  };
  const categoryData = getCategoryData();

  const COLORS = [
    "#F04770", // pink
    "#F78C6A", // orange
    "#FFD167", // yellow
    "#06D7A0", // green
    "#108AB1", // teal
    "#073A4B", // dark blue
  ];

  const changeDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split("T")[0]);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const filteredExpenses = expenses.filter((e) => e.date === selectedDate);

  return (
    <>
      <Navbar></Navbar>

      <div className="space-y-6 max-w-3xl mx-auto p-6">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow-md max-w-3xl mx-auto p-6">
          <p className="text-sm opacity-80">
            Total Spent in {currentMonthName}
          </p>
          <h3 className="text-3xl font-semibold mt-2">
            ₹{monthlyTotal.toLocaleString("en-IN")}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Expense" : "Add Expense"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              className="p-2 border rounded"
              type="number"
              placeholder="Amount"
              min={0}
              max={1000000}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <select
              className={`p-2 border border-gray-300 rounded-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black ${
                category === "" ? "text-gray-400" : "text-black"
              }`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled className="text-gray-400">
                Select Category
              </option>

              {categories.map((cat) => (
                <option key={cat} value={cat} className="text-black">
                  {cat}
                </option>
              ))}
            </select>

            <input
              className="p-2 border rounded"
              type="date"
              value={date}
              max={getTodayDate()}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <input
              maxLength={120}
              className="p-2 border rounded"
              placeholder="Comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button className="col-span-2 bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800">
              {editingId ? "Update Expense" : "Add Expense"}
            </button>

            {editingId && (
              <button
                onClick={resetForm}
                className="col-span-2 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel Editing
              </button>
            )}
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Expenses</h2>

          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              ←
            </button>

            <div className="text-lg font-medium text-gray-700">
              {formatDate(selectedDate)}
            </div>

            <button
              onClick={() => changeDate(1)}
              disabled={selectedDate === new Date().toISOString().split("T")[0]}
              className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-40"
            >
              →
            </button>
          </div>

          {expenses.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <Lottie
                animationData={financeAnimation}
                loop
                className="w-96 h-96"
              />

              <p className="text-gray-500 text-lg mt-4">
                No expenses yet. Add your first
              </p>
            </div>
          )}
          <ul className="space-y-3">
            {filteredExpenses.map((e) => (
              <li
                key={e.id}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <p className="font-semibold text-lg">
                      ₹{e.amount.toLocaleString("en-IN")}
                    </p>
                    {e.comment && (
                      <p className="text-sm text-gray-700 break-normal leading-snug line-clamp-2">
                        <span className="inline">
                          {expandedId === e.id
                            ? e.comment
                            : truncateText(e.comment, 30)}

                          {e.comment.length > 30 && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedId(expandedId === e.id ? null : e.id)
                              }
                              className="ml-1 text-purple-600 hover:underline text-xs whitespace-nowrap"
                            >
                              {expandedId === e.id ? "Show less" : "Read more"}
                            </button>
                          )}
                        </span>
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {e.category} • {e.date}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(e)}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    <AiFillEdit size={22}></AiFillEdit>
                  </button>

                  <button
                    onClick={() => deleteExpense(e.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <AiFillDelete size={22}></AiFillDelete>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md mt-6">
          <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>

          {categoryData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6">
              <Lottie
                animationData={analyticsAnimation}
                loop
                className="w-96 h-96"
              />
              <p className="text-gray-500 mt-4">No category data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
