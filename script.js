// Slideshow functionality
let slideIndex = 0;

function showSlide(index) {
    const slides = document.getElementsByClassName("slide");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[index].style.display = "flex";
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % 3;  // Adjust this number if you add more slides
    showSlide(slideIndex);
}

function prevSlide() {
    slideIndex = (slideIndex - 1 + 3) % 3;  // Adjust this number if you add more slides
    showSlide(slideIndex);
}

// Initial slide display
showSlide(slideIndex);

// Chatbot toggle visibility
function toggleChatbot() {
    const chatbot = document.getElementById("chatbot");
    chatbot.style.display = chatbot.style.display === "none" || chatbot.style.display === "" ? "block" : "none";
}

// Handle prompt button clicks in chatbot
function handlePrompt1(prompt) {
    const chatbotBody = document.querySelector(".chatbot-body");
    chatbotBody.innerHTML = `<p>You selected: <strong>${prompt}</strong></p><p>Loading information...</p>`;
    
    // Simulate loading data for each prompt (you can replace this with actual data fetching later)
    setTimeout(() => {
        if (prompt === 'FAQ') {
            displayFAQ();
        } else if (prompt === 'Top 10 Dining') {
            chatbotBody.innerHTML = "<p>Top 10 Dining spots in Singapore:</p><ul><li>Restaurant 1</li><li>Restaurant 2</li><li>Restaurant 3</li></ul>";
        } else if (prompt === 'Top 10 Spa') {
            chatbotBody.innerHTML = "<p>Top 10 Spa spots in Singapore:</p><ul><li>Spa 1</li><li>Spa 2</li><li>Spa 3</li></ul>";
        } else if (prompt === 'Location-Based Recommendations') {
            getLocationBasedRecommendations();
        } else if (prompt === 'Website Navigation') {
            chatbotBody.innerHTML = "<p>Navigate to:</p><ul><li><a href='#about-us'>About Us</a></li><li><a href='#tourist-recommendation'>Tourist Recommendation</a></li><li><a href='#join-us'>Join Us</a></li></ul>";
        }
    }, 1000); // Simulated delay
}

// Handle prompt button clicks
function handlePrompt2(prompt) {
    const chatbotBody = document.getElementById("chatbotBody");
    const message = document.createElement("div");
    message.className = "chatbot-message";
    message.innerText = `You selected: ${prompt}`;
    chatbotBody.appendChild(message);

    // Response example
    let responseText = "";
    if (prompt === "FAQ") {
        responseText = "Here are some frequently asked questions...";
    } else if (prompt === "Top 10 Dining") {
        responseText = "Here are the top 10 dining places...";
    } else if (prompt === "Top 10 Spa") {
        responseText = "Here are the top 10 spas...";
    }

    const response = document.createElement("div");
    response.className = "chatbot-message";
    response.innerText = responseText;
    chatbotBody.appendChild(response);

    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

// Function to display FAQ responses
function displayFAQ() {
    const chatbotBody = document.getElementById("chatbotBody");
    chatbotBody.innerHTML = `<p>Frequently Asked Questions:</p>
                             <ul>
                                <li>What is the currency in Singapore? - Singapore Dollar (SGD)</li>
                                <li>Best time to visit? - December to June</li>
                                <li>Is English widely spoken? - Yes, English is an official language.</li>
                             </ul>`;
}

function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    const chatbotBody = document.getElementById("chatbotBody");

    if (userInput.trim() !== "") {
        const userMessage = document.createElement("div");
        userMessage.className = "user-message";
        userMessage.innerText = userInput;
        chatbotBody.appendChild(userMessage);

        const botResponse = document.createElement("div");
        botResponse.className = "chatbot-message";

        if (/weather/i.test(userInput)) {
            botResponse.innerText = "Singapore is generally warm and humid year-round.";
        } else if (/currency/i.test(userInput)) {
            botResponse.innerText = "The currency in Singapore is the Singapore Dollar (SGD).";
        } else {
            botResponse.innerText = "Thank you for your message! I'll get back to you on that.";
        }

        chatbotBody.appendChild(botResponse);
        document.getElementById("userInput").value = "";
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }
}

// Function to get location-based recommendations
function getLocationBasedRecommendations() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const chatbotBody = document.getElementById("chatbotBody");
    chatbotBody.innerHTML = `<p>Your location has been detected.</p><p>Here are some recommendations based on your location:</p><ul><li>Attraction 1 near you</li><li>Attraction 2 near you</li><li>Restaurant 1 near you</li></ul>`;
}

function showError(error) {
    const chatbotBody = document.getElementById("chatbotBody");
    chatbotBody.innerHTML = "<p>Location access denied. Unable to provide location-based recommendations.</p>";
}

function navigateTo(page) {
    window.location.href = page;
}







