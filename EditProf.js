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
            // Check if the email has changed
            if (newEmail && newEmail !== user.email) {
                // Update email in Firebase Auth
                await updateEmail(user, newEmail); // Update email in Firebase

                // Send verification email
                await user.sendEmailVerification();
                console.log("Verification email sent to:", newEmail);

                // Inform the user that they need to verify the new email
                alert("A verification email has been sent to your new email. Please verify it before proceeding.");

                // Pause further execution here, as the email verification is required before proceeding.
                return; // Stop execution until verification is complete
            }

            // Update username in Firestore (this happens only if the email isn't changed)
            if (newUsername) {
                await updateDoc(doc(db, "users", user.uid), { name: newUsername });
            }

            // Update password if provided (this happens only if the email isn't changed)
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
/*test*/