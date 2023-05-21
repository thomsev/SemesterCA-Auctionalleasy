const API_BASE_URL = 'https://nf-api.onrender.com';

/**
 * Get the credit count for the current user
 * @returns {Promise<number>} - A promise resolving to the credit count
 */
function getCreditCount() {
  const name = JSON.parse(localStorage.getItem('user')).name;
  const accessToken = localStorage.getItem('accessToken');
  if (!name || !accessToken) {
    return Promise.reject(new Error('User data or access token not found in local storage'));
  }

  const url = `${API_BASE_URL}/api/v1/auction/profiles/${name}/credits`;
  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
    .then(handleResponse) // Handle response
    .then(user => user.credits); // Extract credit count from the user object
}

/**
 * Update the credit count on the page
 */
function updateCreditCount() {
  const creditCountElement = document.getElementById('credit-count');
  getCreditCount()
    .then(creditCount => {
      creditCountElement.textContent = creditCount;
    })
    .catch(handleError); // Handle error
}

// Initialize credit tracker
updateCreditCount();

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
 * Handle error
 * @param {Error} error - The error object
 */
function handleError(error) {
  console.error(error);
  const creditCountElement = document.getElementById('credit-count');
  creditCountElement.textContent = 'to log in to view your';
}