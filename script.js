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

            // Hide the search container and show credentials
            document.querySelector('.logo').style.display = 'none'; // Hide the logo
            document.querySelector('.search-container').style.display = 'none'; // Hide the search container
            document.getElementById('credentials').style.display = 'block'; // Show credentials
            document.getElementById('card').style.display = 'none'; // Hide the card
        } else {
            errorMessageDiv.textContent = 'Error: Search term must be "ctms" or "CTMS".'; // Set the error message
        }
    } else {
        errorMessageDiv.textContent = 'Please enter a search term.'; // Set the error message for empty input
    }
}

async function authenticate(username, password) {
    const response = await fetch('http://localhost:4023/api/v24.2/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            username: username,
            password: password,
        }),
    });

    if (!response.ok) {
        const textResponse = await response.text(); // Get text response
        console.error('Authentication failed:', textResponse);
        throw new Error('Authentication failed: Invalid Username or Password');
    }

    const data = await response.json();
    console.log("Authentication response:", data);

    if (data.sessionId) {
        console.log('SessionId :: ' + data.sessionId);
        return data.sessionId; // Return the session ID directly
    } else {
        console.error('Authentication error:', data);
        throw new Error(data.errors || 'Authentication failed');
    }
}

async function fetchCTMSObject(sessionId) {
    console.log('Session ID:', sessionId);
    const response = await fetch('http://localhost:4023/api/v24.2/metadata/vobjects', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionId}`,
            'Content-Type': 'application/json'
        },
    });

    const textResponse = await response.text(); // Log the raw text response
    console.log('Raw API Response:', textResponse);

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch CTMS object:', errorData);
        throw new Error('Failed to fetch CTMS object: ' + (errorData.errors || 'Unknown error'));
    }

    const data = JSON.parse(textResponse); // Parse the text response
    console.log("CTMS Data:", data); // Log the fetched data

    return data; // Return the entire data object
}

function displayCTMSData(ctmsData) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear previous content

    const objects = ctmsData.objects; // Access the objects array from the response

    if (Array.isArray(objects) && objects.length > 0) {
        objects.forEach(obj => {
            const objDiv = document.createElement('div');
            objDiv.className = 'object';
            objDiv.innerHTML = `
                <h2><strong>${obj.label}</strong></h2>
                <p><strong>Name:</strong> ${obj.name}</p>
                <p><strong>Description:</strong> ${obj.description || 'No description available'}</p>
                <hr />
            `;
            outputDiv.appendChild(objDiv);
        });
    } else {
        console.log('No objects returned from the API.');
        outputDiv.innerHTML = 'No objects returned from the API.';
    }
}

document.getElementById('fetchCTMS').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Hide the output and title initially
    const outputDiv = document.getElementById('output');
    const ctmsTitle = document.getElementById('ctmsTitle');
    const loadingMessageDiv = document.getElementById('loadingMessage');
    const errorMessageDiv = document.getElementById('errorMessage'); // Get the error message div

    outputDiv.style.display = 'none'; // Ensure it's hidden before fetching
    ctmsTitle.style.display = 'none'; // Ensure it's hidden before fetching
    loadingMessageDiv.style.display = 'block'; // Show loading message

    // Clear previous error messages
    errorMessageDiv.textContent = ''; // Clear the error message

    try {
        const sessionId = await authenticate(username, password);
        console.log("Authenticated successfully:", sessionId);
        
        const ctmsData = await fetchCTMSObject(sessionId);
        displayCTMSData(ctmsData); // Call to display data

        // Hide the credentials form and show the card
        document.getElementById('credentials').style.display = 'none';
        document.getElementById('card').style.display = 'block'; // Show the card
        
        // Show the title and output div
        ctmsTitle.style.display = 'block'; // Show the title
        outputDiv.style.display = 'block'; // Show the output div

    } catch (error) {
        errorMessageDiv.textContent = 'Error: ' + error.message; // Display the error in the UI
        outputDiv.innerHTML = ''; // Clear output on error
        outputDiv.style.display = 'block'; // Show the output div for error messages
    } finally {
        loadingMessageDiv.style.display = 'none'; // Hide loading message
    }
});
