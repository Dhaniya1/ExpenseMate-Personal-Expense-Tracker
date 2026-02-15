import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

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

  const fetchExpenses = async () => {
    const res = await API.get("/expenses/");
    console.log("expenses from API:", res.data); 
    setExpenses(res.data.data ?? res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();

    await API.post("/expenses/", {
      amount: Number(amount),
      category,
      date,
      comment,
    });

    setAmount("");
    setCategory("");
    setDate("");
    setComment("");

    fetchExpenses();
  };

  const deleteExpense = async (id: number) => {
    await API.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  return (
    <div className="page">
      <h1>My Expenses</h1>

      <button onClick={logout}>Logout</button>

      <form onSubmit={addExpense}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button type="submit">Add Expense</button>
      </form>

      <h2>Expense List</h2>

      <ul>
        {expenses.map((e) => (
          <li key={e.id}>
            ₹{e.amount} - {e.category} - {e.date}
            <button onClick={() => deleteExpense(e.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
