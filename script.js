const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const empty = document.getElementById("empty");
const totalEl = document.getElementById("total");
const monthTotalEl = document.getElementById("monthTotal");
const dateInput = document.getElementById("date");

dateInput.value = new Date().toISOString().split("T")[0];

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function save() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function render() {
  list.innerHTML = "";
  empty.style.display = expenses.length ? "none" : "block";

  let total = 0;
  let monthTotal = 0;
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  expenses.forEach((expense, index) => {
    const amount = Number(expense.amount);
    total += amount;

    const d = new Date(expense.date + "T00:00:00");
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      monthTotal += amount;
    }

    const li = document.createElement("li");
    li.className = "expense";
    li.innerHTML = `
      <div class="info">
        <strong>${escapeHtml(expense.title)}</strong>
        <small>${escapeHtml(expense.category)} • ${expense.date}</small>
      </div>
      <div class="right">
        <strong>₹${amount.toFixed(2)}</strong>
        <button class="delete" onclick="removeExpense(${index})">Delete</button>
      </div>`;
    list.appendChild(li);
  });

  totalEl.textContent = `₹${total.toFixed(2)}`;
  monthTotalEl.textContent = `₹${monthTotal.toFixed(2)}`;
}

function removeExpense(index) {
  expenses.splice(index, 1);
  save();
  render();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

form.addEventListener("submit", event => {
  event.preventDefault();

  expenses.unshift({
    title: document.getElementById("title").value.trim(),
    amount: document.getElementById("amount").value,
    category: document.getElementById("category").value,
    date: dateInput.value
  });

  save();
  form.reset();
  dateInput.value = new Date().toISOString().split("T")[0];
  render();
});

render();
