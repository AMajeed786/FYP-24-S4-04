import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

// Handle Form Submission for login
const form = document.getElementById("login-form");

if (!form) {
    console.error("Login form not found.");
} else {
    console.log("Login form found.");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("Form submitted.");

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const userCredential = await loginUser(auth, email, password);
            console.log("User logged in:", userCredential.user);
            alert("Login successful!");
            window.location.href = "Home.html";
        } catch (error) {
            console.error("Error logging in:", error.message);
            alert("Login failed: " + error.message);
        }
    });
}


// Async login function
async function loginUser(auth, email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential; // Return the userCredential object
    } catch (error) {
        console.error("Login failed:", error.message);
        throw error; // Throw the error to be caught in the event listener
    }
}
