import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Navbar";

type Expense = {
  id: number;
  amount: number;
  category: string;
  date: string;
  comment: string;
};

const Dashboard = () => {
  const { logout } = useAuth();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchExpenses = async () => {
    const res = await API.get("/expenses/");
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    setDate("");
    setComment("");
    setEditingId(null);
  };

  return (
    <>

    <Header></Header>


    
    <div className="space-y-6 max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Expense Tracker</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Expense" : "Add Expense"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            className="p-2 border rounded"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <input
            className="p-2 border rounded"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <input
            className="p-2 border rounded"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            className="p-2 border rounded"
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button className="col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            {editingId ? "Update Expense" : "Add Expense"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="col-span-2 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
            >
              Cancel Editing
            </button>
          )}
        </form>
      </div>

      {/* Expense List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Your Expenses</h2>

        <ul className="space-y-3">
          {expenses.map((e) => (
            <li
              key={e.id}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <div>
                <p className="font-semibold">₹{e.amount}</p>
                <p className="text-sm text-gray-500">
                  {e.category} • {e.date}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(e)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteExpense(e.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
