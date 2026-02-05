/**
 * @fileoverview Dashboard module for expense management.
 * Handles all expense CRUD operations, filtering, and UI updates.
 */

/** @const {string} Base URL for API endpoints. */
const API_BASE_URL = '/api';

/** @type {?number} Currently selected expense ID for editing. */
let currentEditId = null;

/** @type {?bootstrap.Modal} Bootstrap modal instance for editing expenses. */
let editModal = null;

// Check authentication
if (!localStorage.getItem('token')) {
  window.location.href = 'index.html';
}

/**
 * Initializes the dashboard when DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
  editModal = new bootstrap.Modal(document.getElementById('editModal'));
  loadUserInfo();
  loadExpenses();
  setTodayDate();
  setupEventListeners();
});

/**
 * Loads and displays user information from localStorage.
 */
function loadUserInfo() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    document.getElementById('userName').textContent = user.firstName;
  }
}

/**
 * Sets the expense date input to today's date.
 */
function setTodayDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('expenseDate').value = today;
}

/**
 * Sets up all event listeners for the dashboard.
 */
function setupEventListeners() {
  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('expenseForm').addEventListener('submit', handleAddExpense);
  document.getElementById('saveEditBtn').addEventListener('click', handleEditExpense);
  document.getElementById('customFilterBtn').addEventListener('click', handleCustomFilter);

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const filter = e.target.dataset.filter;
      loadExpenses(filter);
    });
  });
}

/**
 * Loads expenses from the server with optional filtering.
 * @param {string} filter - Filter type ('all', 'week', 'month', '3months').
 * @return {!Promise<void>}
 */
async function loadExpenses(filter = 'all') {
  try {
    let url = `${API_BASE_URL}/expenses`;

    if (filter !== 'all') {
      url += `?filter=${filter}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const expenses = await response.json();
      displayExpenses(expenses);
    } else if (response.status === 401) {
      logout();
    } else {
      showAlert('Failed to load expenses', 'danger');
    }
  } catch (error) {
    showAlert('An error occurred while loading expenses', 'danger');
  }
}

/**
 * Handles custom date range filtering.
 * @return {!Promise<void>}
 */
async function handleCustomFilter() {
  const startDate = document.getElementById('customStartDate').value;
  const endDate = document.getElementById('customEndDate').value;

  if (!startDate || !endDate) {
    showAlert('Please select both start and end dates', 'warning');
    return;
  }

  try {
    const url = `${API_BASE_URL}/expenses?startDate=${startDate}&endDate=${endDate}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const expenses = await response.json();
      displayExpenses(expenses);
    } else {
      showAlert('Failed to filter expenses', 'danger');
    }
  } catch (error) {
    showAlert('An error occurred while filtering expenses', 'danger');
  }
}

/**
 * Displays expenses in the table.
 * @param {!Array<!Object>} expenses - Array of expense objects.
 */
function displayExpenses(expenses) {
  const tbody = document.getElementById('expensesTableBody');

  if (expenses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">No expenses found</td></tr>';
    document.getElementById('totalValue').textContent = '0.00';
    return;
  }

  let total = 0;
  tbody.innerHTML = expenses.map((expense) => {
    total += parseFloat(expense.amount);
    return `
      <tr>
        <td>${formatDate(expense.expenseDate)}</td>
        <td>${expense.description}</td>
        <td><span class="badge bg-info">${formatCategory(expense.category)}</span></td>
        <td>$${parseFloat(expense.amount).toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="showEditModal(${expense.id})">
            <i class="bi bi-pencil"></i> Edit
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">
            <i class="bi bi-trash"></i> Delete
          </button>
        </td>
      </tr>
    `;
  }).join('');

  document.getElementById('totalValue').textContent = total.toFixed(2);
}

/**
 * Handles adding a new expense.
 * @param {!Event} e - Form submit event.
 * @return {!Promise<void>}
 */
async function handleAddExpense(e) {
  e.preventDefault();

  const expense = {
    description: document.getElementById('description').value,
    amount: parseFloat(document.getElementById('amount').value),
    category: document.getElementById('category').value,
    expenseDate: document.getElementById('expenseDate').value,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(expense),
    });

    if (response.ok) {
      showAlert('Expense added successfully!', 'success');
      document.getElementById('expenseForm').reset();
      setTodayDate();
      loadExpenses();
    } else {
      showAlert('Failed to add expense', 'danger');
    }
  } catch (error) {
    showAlert('An error occurred while adding expense', 'danger');
  }
}

/**
 * Shows the edit modal for a specific expense.
 * @param {number} id - The expense ID.
 * @return {!Promise<void>}
 */
async function showEditModal(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const expense = await response.json();
      currentEditId = id;

      document.getElementById('editId').value = expense.id;
      document.getElementById('editDescription').value = expense.description;
      document.getElementById('editAmount').value = expense.amount;
      document.getElementById('editCategory').value = expense.category;
      document.getElementById('editExpenseDate').value = expense.expenseDate;

      editModal.show();
    } else {
      showAlert('Failed to load expense details', 'danger');
    }
  } catch (error) {
    showAlert('An error occurred while loading expense', 'danger');
  }
}

/**
 * Handles expense update submission.
 * @return {!Promise<void>}
 */
async function handleEditExpense() {
  const expense = {
    description: document.getElementById('editDescription').value,
    amount: parseFloat(document.getElementById('editAmount').value),
    category: document.getElementById('editCategory').value,
    expenseDate: document.getElementById('editExpenseDate').value,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${currentEditId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(expense),
    });

    if (response.ok) {
      showAlert('Expense updated successfully!', 'success');
      editModal.hide();
      loadExpenses();
    } else {
      showAlert('Failed to update expense', 'danger');
    }
  } catch (error) {
    showAlert('An error occurred while updating expense', 'danger');
  }
}

/**
 * Deletes an expense after confirmation.
 * @param {number} id - The expense ID.
 * @return {!Promise<void>}
 */
async function deleteExpense(id) {
  if (!confirm('Are you sure you want to delete this expense?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      showAlert('Expense deleted successfully!', 'success');
      loadExpenses();
    } else {
      showAlert('Failed to delete expense', 'danger');
    }
  } catch (error) {
    showAlert('An error occurred while deleting expense', 'danger');
  }
}

/**
 * Formats a date string for display.
 * @param {string} dateString - ISO date string.
 * @return {string} Formatted date.
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats category name for display.
 * @param {string} category - Category in uppercase.
 * @return {string} Formatted category name.
 */
function formatCategory(category) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

/**
 * Shows an alert message.
 * @param {string} message - Alert message.
 * @param {string} type - Alert type (success, danger, warning, etc.).
 */
function showAlert(message, type) {
  const alert = document.getElementById('expenseAlert');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  alert.classList.remove('d-none');

  setTimeout(() => {
    alert.classList.add('d-none');
  }, 3000);
}

/**
 * Logs out the current user.
 */
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}
