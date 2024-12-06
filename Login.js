import { auth } from "./firebase-config.js";
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    // Handle Form Submission for login
    const form = document.getElementById("login-form");

    if (form) {
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
                window.location.href = "Home.html"; // Redirect to Home page after login
            } catch (error) {
                console.error("Error logging in:", error.message);
                alert("Login failed: " + error.message);
            }
        });
    } else {
        console.error("Login form not found.");
    }
});

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

    // Async logout function
    async function logoutUser(auth) {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error.message);
            throw error; // Throw the error to be caught in the event listener
        }
    }

    // Listen for Authentication State Changes
    onAuthStateChanged(auth, (user) => {
        const loginLink = document.getElementById("loginLink");
        const editProfileButton = document.getElementById("editProfLink");
        const joinUsButton = document.getElementById("joinUsButton");

        if (user) {
            console.log("User is logged in:", user.email);

            // Update UI for logged-in state
            if (loginLink) {
                loginLink.onclick = async (event) => {
                    event.preventDefault();
                        await logoutUser(auth);
                        alert("You are now logged out.");
                        window.location.href = "Home.html"; // Redirect to Home page after logout

                };
            }

            if (editProfileButton) {
                editProfileButton.style.display = "show"; // Show Edit Profile button
            }
            if (joinUsButton) {
                joinUsButton.style.display = "none"; // Hide Join Us button
            }

        } else {
            console.log("User is not logged in.");

            // Update UI for logged-out state
            if (loginLink) {
                loginLink.href = "Login.html"; // Make loginLink point to login page
            }

            if (editProfileButton) {
                editProfileButton.style.display = "none"; // Hide Edit Profile button
            }
            if (joinUsButton) {
                joinUsButton.style.display = "block"; // Show Join Us button
            }

        }
    });
