/**
 * Login form submission handler
 * @param {string} API_BASE_URL - The base URL of the API
 */
const API_BASE_URL = 'https://nf-api.onrender.com';

$(document).ready(function() {
  $('#login-form').submit(function(e) {
    e.preventDefault();
    var email = $('#login-email').val();
    var password = $('#login-password').val();

    // Validate email
    if (!email.endsWith('stud.noroff.no') && !email.endsWith('noroff.no')) {
      alert('Please enter a valid email address with the domain "stud.noroff.no" or "noroff.no".');
      return;
    }

    // Prepare user data for login
    var userData = {
      email: email,
      password: password
    };

    // Send login request
    fetch(`${API_BASE_URL}/api/v1/auction/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    .then(handleResponse) // Handle response
    .then(handleSuccess) // Handle success
    .catch(handleError); // Handle error
  });
});

/**
 * Handle the API response
 * @param {Response} response - The API response object
 * @returns {Promise} - A promise resolving to the JSON data of the response
 */
function handleResponse(response) {
  if (!response.ok) {
    return response.json().then(json => {
      throw new Error(json.errors[0].message);
    });
  }
  return response.json();
}

/**
 * Handle the login success
 * @param {Object} json - The JSON data of the successful response
 */
function handleSuccess(json) {
  // Store the JWT tokens and user data in localStorage
  localStorage.setItem('accessToken', json.accessToken);
  localStorage.setItem('user', JSON.stringify(json));

  alert('Login successful!');
  window.location.href = 'index.html';
}

/**
 * Handle login error
 * @param {Error} error - The error object
 */
function handleError(error) {
  alert('Login failed: ' + error.message);
}
