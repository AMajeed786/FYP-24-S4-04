import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    // Handle form submission for registration
    document.getElementById("register-form").addEventListener("submit", async (event) => {
        event.preventDefault();
            // Retrieve form values
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const name = document.getElementById("name").value;
        try {
            // Register the user
            await registerUser(email, password, name);
            alert("Registration successful!");

            // Redirect to the home page upon success
            window.location.href = "Home.html";
        } catch (error) {
            // Handle errors during registration
            console.error("Error during registration:", error.message);
            alert("Registration failed: " + error.message);
        }
    });

});






async function registerUser(email, password, name) {
    try {
        // Register the user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid; // Get UID

        console.log("User registered in Firebase Authentication:", userCredential.user);

        // Save user metadata in Firestore
        await setDoc(doc(db, "users", uid), {
            name: name,
            email: email,
            role: "tourist",
            createdAt: new Date().toISOString(),
        });

        console.log("User metadata saved to Firestore.");
        alert("Registration successful!");

        // Redirect the user
        window.location.href = "login.html";
    } catch (error) {
        console.error("Error during registration:", error.message);
        alert("Registration failed: " + error.message);
    }
}

