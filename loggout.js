$(document).ready(function() {
  // Logout button click event
  $('#logout-button').click(function() {
    // Clear user data (e.g., token) from storage
    localStorage.removeItem('accessToken');

    // Redirect to login page
    window.location.href = 'loggin.html';
  });
});
