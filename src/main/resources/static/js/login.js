/**
 * @fileoverview Login page functionality.
 * Handles user authentication and token management.
 */

/** @const {string} Base URL for API endpoints. */
const API_BASE_URL = '/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      }));
      window.location.href = 'dashboard.html';
    } else {
      const error = await response.json();
      showError(error.message || 'Login failed. Please check your credentials.');
    }
  } catch (error) {
    showError('An error occurred. Please try again.');
  }
});

/**
 * Shows an error message.
 * @param {string} message - Error message to display.
 */
function showError(message) {
  const errorAlert = document.getElementById('errorAlert');
  errorAlert.textContent = message;
  errorAlert.classList.remove('d-none');

  setTimeout(() => {
    errorAlert.classList.add('d-none');
  }, 5000);
}
