/**
 * @fileoverview Registration page functionality.
 * Handles new user registration and account creation.
 */

/** @const {string} Base URL for API endpoints. */
const API_BASE_URL = '/api';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({firstName, lastName, email, password}),
    });

    if (response.ok) {
      const data = await response.json();
      showSuccess('Registration successful! Redirecting to login...');

      setTimeout(() => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        }));
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      const error = await response.json();
      showError(error.message || 'Registration failed. Please try again.');
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
  document.getElementById('successAlert').classList.add('d-none');

  setTimeout(() => {
    errorAlert.classList.add('d-none');
  }, 5000);
}

/**
 * Shows a success message.
 * @param {string} message - Success message to display.
 */
function showSuccess(message) {
  const successAlert = document.getElementById('successAlert');
  successAlert.textContent = message;
  successAlert.classList.remove('d-none');
  document.getElementById('errorAlert').classList.add('d-none');
}
