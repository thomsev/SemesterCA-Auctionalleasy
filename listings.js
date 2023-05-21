$(document).ready(function () {
  // Fetch items
  fetchItems();

  /**
   * Fetch items and display them in the UI
   * @param {string} API_BASE_URL - The base URL of the API
   */
  function fetchItems() {
    fetch(`${API_BASE_URL}/api/v1/auction/listings`)
      .then(response => response.json())
      .then(items => {
        // Create a new row
        let rowDiv = $('<div class="row"></div>');

        // For each item, create a div and append it to the row
        items.forEach((item, index) => {
          var itemDiv = `
            <div class="col-md-6 item" data-id="${item.id}">
              <img src="${item.media[0]}" alt="Item picture">
              <p>Title: ${item.title}</p>
              <p>Description: ${item.description}</p>
              <p>Ends at: ${item.endsAt}</p>
              <form class="bid-form">
                <input type="number" class="bid-input" placeholder="Enter your bid">
                <button type="submit" class="btn btn-primary bid-button">Bid</button>
              </form>
            </div>
          `;
          rowDiv.append(itemDiv);

          // After every two items, append the row to the container and create a new row
          if ((index + 1) % 2 === 0) {
            $('#items-container').append(rowDiv);
            rowDiv = $('<div class="row"></div>');
          }
        });

        // Append the last row if it has any items
        if (rowDiv.children().length > 0) {
          $('#items-container').append(rowDiv);
        }

        // Check if user is logged in
        const accessToken = localStorage.getItem('accessToken');
        const isLoggedIn = !!accessToken;

        // Add event listeners to bid buttons
        $('.bid-button').click(function (e) {
          e.preventDefault();

          if (!isLoggedIn) {
            alert('You need to log in to place a bid.');
            return;
          }

          var itemId = $(this).closest('.item').data('id');
          var bidAmount = $(this).siblings('.bid-input').val();

          // Call API endpoint to make a bid
          fetch(`${API_BASE_URL}/api/v1/auction/listings/${itemId}/bids`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              amount: bidAmount
            })
          })
            .then(handleResponse) // Handle response
            .then(updatedListing => {
              alert('Bid placed successfully!');

              // Update the listing in the UI
              var itemDiv = `
                <div class="item" data-id="${updatedListing.id}">
                  <img src="${updatedListing.media[0]}" alt="Item picture">
                  <p>Title: ${updatedListing.title}</p>
                  <p>Description: ${updatedListing.description}</p>
                  <p>Ends at: ${new Date(updatedListing.endsAt).toLocaleString()}</p>
                  <p>Number of bids: ${updatedListing._count.bids}</p>
                  <form class="bid-form">
                    <input type="number" class="bid-input" placeholder="Enter your bid">
                    <button type="submit" class="btn btn-primary bid-button">Bid</button>
                  </form>
                </div>
              `;

              $(`[data-id="${updatedListing.id}"]`).replaceWith(itemDiv);
            })
            .catch(handleError); // Handle error
        });
      })
      .catch(error => {
        console.error('Error fetching items:', error);  // Log error
        $('#items-container').append('<p>Error loading items</p>');
      });
  }

  /**
   * Handle the API response
   * @param {Response} response - The API response object
   * @returns {Promise} - A promise resolving to the JSON data of the response
   */
  function handleResponse(response) {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  }

  /**
   * Handle error
   * @param {Error} error - The error object
   */
  function handleError(error) {
    alert('Failed to place bid: ' + error.message);
  }
});
