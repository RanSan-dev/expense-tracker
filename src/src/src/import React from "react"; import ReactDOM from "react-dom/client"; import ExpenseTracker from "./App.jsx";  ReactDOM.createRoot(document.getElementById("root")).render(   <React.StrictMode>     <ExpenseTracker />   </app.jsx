const { useState, useEffect } = React;

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ date: "", vendor: "", amount: "", category: "", card: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("expenseAppData");
    if (saved) setExpenses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("expenseAppData", JSON.stringify(expenses));
  }, [expenses]);

  const handleSubmit = () => {
    if (!form.date || !form.vendor || !form.amount || !form.category) {
      alert("Fill all fields");
      return;
    }

    const newItem = { ...form, amount: parseFloat(form.amount) };

    if (editingIndex !== null) {
      const updated = [...expenses];
      updated[editingIndex] = newItem;
      setExpenses(updated);
      setEditingIndex(null);
    } else {
      setExpenses([...expenses, newItem]);
    }

    setForm({ date: "", vendor: "", amount: "", category: "", card: "" });
  };

  const editExpense = (i) => {
    setForm(expenses[i]);
    setEditingIndex(i);
  };

  const deleteExpense = (i) => {
    const updated = [...expenses];
    updated.splice(i, 1);
    setExpenses(updated);
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    React.createElement("div", { className: "p-6" },
      React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Expense Tracker"),

      React.createElement("div", { className: "mb-4" },
        React.createElement("input", {
          type: "date",
          value: form.date,
          onChange: e => setForm({ ...form, date: e.target.value })
        }),
        React.createElement("input", {
          placeholder: "Vendor",
          value: form.vendor,
          onChange: e => setForm({ ...form, vendor: e.target.value })
        }),
        React.createElement("input", {
          type: "number",
          placeholder: "Amount",
          value: form.amount,
          onChange: e => setForm({ ...form, amount: e.target.value })
        }),
        React.createElement("input", {
          placeholder: "Category",
          value: form.category,
          onChange: e => setForm({ ...form, category: e.target.value })
        }),
        React.createElement("button", {
          onClick: handleSubmit,
          className: "bg-blue-500 text-white px-3 py-1 ml-2"
        }, "Save")
      ),

      React.createElement("div", null,
        React.createElement("h2", null, "Total: $" + total),
        expenses.map((e, i) =>
          React.createElement("div", { key: i },
            `${e.date} | ${e.vendor} | $${e.amount}`,
            React.createElement("button", { onClick: () => editExpense(i) }, " Edit "),
            React.createElement("button", { onClick: () => deleteExpense(i) }, " Delete ")
          )
        )
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(ExpenseTracker)
);
