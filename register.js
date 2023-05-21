/**
 * Register form submission handler
 * @param {string} API_BASE_URL - The base URL of the API
 */
$(document).ready(function() {
  $('#register-form').submit(function(e) {
    e.preventDefault();

    // Get form input values
    var name = $('#name').val();
    var email = $('#email').val();
    var password = $('#password').val();

    // Validate name
    if (!name.match(/^[a-zA-Z0-9_]+$/)) {
      alert("Name must contain only letters, digits, and underscores.");
      return;
    }

    // Validate email
    if (!email.endsWith('stud.noroff.no') && !email.endsWith('noroff.no')) {
      alert('Please enter a valid email address with the domain "stud.noroff.no" or "noroff.no".');
      return;
    }

    // Validate password
    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    // Prepare user data for registration
    var userData = {
      name: name,
      email: email,
      password: password
    };

    // Send registration request
    fetch(`${API_BASE_URL}/api/v1/auction/auth/register`, {
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
 * Handle the registration success
 * @param {Object} json - The JSON data of the successful response
 */
function handleSuccess(json) {
  alert('Registration successful!');
  // Redirect user to login page
  window.location.href = 'login.html';
}

/**
 * Handle registration error
 * @param {Error} error - The error object
 */
function handleError(error) {
  alert('Registration failed: ' + error.message);
}
