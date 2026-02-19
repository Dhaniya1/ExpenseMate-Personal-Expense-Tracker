import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../index.css";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";



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

  
  const { logout } = useAuth();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(getTodayDate());
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  
  
  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Other"
  ]

  const fetchExpenses = async () => {
    const res = await API.get("/expenses/");
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(Number(amount) <= 0 ) {
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


  

  return (
    <>

    <Navbar></Navbar>


    
    <div className="space-y-6 max-w-3xl mx-auto p-6 shado">

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

          <button className="col-span-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
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

        {expenses.length === 0 && (
          <p className="text-gray-500 text-center py-6 text-lg">
            No expenses yet. Add your first one 🎉
          </p>
        )}


        <ul className="space-y-3">
          {expenses.map((e) => (
            <li
              key={e.id}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <div>
                <div className="flex items-baseline gap-4">
                <p className="font-semibold text-lg">₹{e.amount.toLocaleString("en-IN")}</p>
                {e.comment && (
            <p className="text-sm text-gray-700">
              {e.comment}
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
    </div>
    </>
  );
};

export default Dashboard;
