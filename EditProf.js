import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, updateEmail, updatePassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Authenticated user:", user);
            initializeForm(user); // Pass the user to initialize the form
        } else {
            alert("You need to be logged in to edit your profile.");
            window.location.href = "login.html"; // Redirect to login if not authenticated
        }
    });
});

async function initializeForm(user) {
    const usernameField = document.getElementById("username");
    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");

    try {
        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            usernameField.value = userData.name || "";
            emailField.value = userData.email || "";
        } else {
            console.error("No user data found in Firestore.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error.message);
    }

    // Handle form submission
    document.querySelector("form").addEventListener("submit", async (event) => {
        event.preventDefault();

        const newUsername = usernameField.value;
        const newEmail = emailField.value;
        const newPassword = passwordField.value;

        try {
            // Update email if changed
            if (newEmail && newEmail !== user.email) {
                await updateEmail(user, newEmail);
                await updateDoc(doc(db, "users", user.uid), { email: newEmail });
            }

            // Update username in Firestore
            if (newUsername) {
                await updateDoc(doc(db, "users", user.uid), { name: newUsername });
            }

            // Update password if provided
            if (newPassword) {
                await updatePassword(user, newPassword);
            }

            alert("Profile updated successfully!");
            window.location.reload(); // Refresh to reflect changes
        } catch (error) {
            console.error("Error updating profile:", error.message);
            alert("Failed to update profile: " + error.message);
        }
    });
}
