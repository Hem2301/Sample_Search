let searchValue = ''; // Initialize the search value

function inputChange() {
    const inputElement = document.getElementById('searchInput');
    searchValue = inputElement.value; // Update the searchValue with the input value
    console.log('Current search value:', searchValue); // Log the current value
    document.getElementById('errorMessage').textContent = ''; // Clear the error message
}

function onSearch(event) {
    event.preventDefault(); // Prevent the default form submission

    const errorMessageDiv = document.getElementById('errorMessage'); // Get the error message div

    if (searchValue) {
        // Check if searchValue is equal to "ctms", case insensitive
        if (searchValue.toLowerCase() === 'ctms') {
            console.log('Searching for:', searchValue);
            errorMessageDiv.textContent = ''; // Clear any previous error messages
            // Proceed with the search action, e.g., redirect
            // window.location.href = `searchResults.html?query=${encodeURIComponent(searchValue)}`;
        } else {
            errorMessageDiv.textContent = 'Error: Search term must be "ctms" or "CTMS".'; // Set the error message
        }
    } else {
        errorMessageDiv.textContent = 'Please enter a search term.'; // Set the error message for empty input
    }
}
