$(document).ready(function () {
  // Form submit handler
  $("#post-item-form").submit(function (e) {
    e.preventDefault();

    var itemName = $("#item-name").val();
    var itemPrice = $("#item-price").val();
    var itemEndTime = $("#item-end-time").val();
    var itemImageUrl = $("#item-image-url").val();
    var itemDescription = $("#item-description").val(); // Add the item description

    // Post item
    postItem({
      title: itemName,
      price: itemPrice,
      endTime: itemEndTime,
      imageUrl: itemImageUrl,
      description: itemDescription // Include the item description
    });
  });
});

/**
 * Post an item
 * @param {Object} itemData - The data of the item to be posted
 */
function postItem(itemData) {
  fetch(`${API_BASE_URL}/api/v1/auction/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify({
      title: itemData.title,
      description: itemData.description, // Include the item description
      tags: [], // Optional: Add tags if needed
      media: [itemData.imageUrl], // Optional: Add media URLs if needed
      endsAt: itemData.endTime,
    }),
  })
    .then(handleResponse) // Handle response
    .then(() => {
      alert("Item posted successfully!");
    })
    .catch(handleError); // Handle error
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
  alert("Failed to post item: " + error.message);
}
