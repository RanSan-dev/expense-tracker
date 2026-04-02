import React, { useState, useEffect } from "react";

export default function ExpenseTracker() {
  const [page, setPage] = useState("dashboard");
  const [expenses, setExpenses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({ date: "", vendor: "", amount: "", category: "", card: "", type: "card" });
  const [categories, setCategories] = useState([]);
  const [cards, setCards] = useState([]);
  const [income, setIncome] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("expenseAppData");
    if (saved) {
      const data = JSON.parse(saved);
      setExpenses(data.expenses || []);
      setCategories(data.categories || []);
      setCards(data.cards || []);
      setIncome(data.income || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("expenseAppData", JSON.stringify({ expenses, categories, cards, income }));
  }, [expenses, categories, cards, income]);

  const handleSubmit = () => {
    if (!form.date || !form.vendor || !form.amount || !form.category) {
      alert("Please fill all fields");
      return;
    }

    if (editingIndex !== null) {
      const updated = [...expenses];
      updated[editingIndex] = { ...form, amount: parseFloat(form.amount) };
      setExpenses(updated);
      setEditingIndex(null);
    } else {
      setExpenses([...expenses, { ...form, amount: parseFloat(form.amount) }]);
    }

    setForm({ date: "", vendor: "", amount: "", category: "", card: "", type: "card" });
  };

  const editExpense = (index) => {
    setForm(expenses[index]);
    setEditingIndex(index);
  };

  const deleteExpense = (index) => {
    const updated = [...expenses];
    updated.splice(index, 1);
    setExpenses(updated);
  };

  const exportData = () => {
    const data = { expenses, categories, cards, income };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expense-data.json";
    a.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setExpenses(data.expenses || []);
        setCategories(data.categories || []);
        setCards(data.cards || []);
        setIncome(data.income || []);
        alert("Data imported successfully");
      } catch {
        alert("Invalid file");
      }
    };
    reader.readAsText(file);
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = income.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const remaining = totalIncome - totalSpent;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">💰 Expense Tracker (Online)</h1>
        <div className="flex gap-2">
          <button onClick={() => setPage("dashboard")} className="px-3 py-1 bg-white rounded">Dashboard</button>
          <button onClick={() => window.print()} className="px-3 py-1 bg-green-500 text-white rounded">Print</button>
          <button onClick={exportData} className="px-3 py-1 bg-blue-500 text-white rounded">Export</button>
          <label className="px-3 py-1 bg-purple-500 text-white rounded cursor-pointer">
            Import
            <input type="file" onChange={importData} hidden />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded">Income: ${totalIncome}</div>
        <div className="bg-white p-4 rounded">Spent: ${totalSpent}</div>
        <div className="bg-white p-4 rounded">Remaining: ${remaining}</div>
      </div>

      <div className="bg-white p-4 rounded mb-6">
        <h2>{editingIndex !== null ? "Edit" : "Add"} Expense</h2>
        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <input placeholder="Vendor" value={form.vendor} onChange={e => setForm({ ...form, vendor: e.target.value })} />
        <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
        <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <input placeholder="Card" value={form.card} onChange={e => setForm({ ...form, card: e.target.value })} />
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-3 py-1 mt-2 rounded">Save</button>
      </div>

      <div className="bg-white p-4 rounded">
        <h2>Transactions</h2>
        {expenses.map((e, i) => (
          <div key={i} className="flex justify-between border-b py-1">
            <span>{e.date} | {e.vendor} | ${e.amount}</span>
            <div>
              <button onClick={() => editExpense(i)} className="text-blue-500 mr-2">Edit</button>
              <button onClick={() => deleteExpense(i)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
