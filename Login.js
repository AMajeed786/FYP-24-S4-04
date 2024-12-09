import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { db } from "./firebase-config.js"; // Firestore instance

// =============================
// Step 1: Handle Login Form Submission
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  // Check if the login form exists
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent default form submission behavior
      console.log("Login form submitted.");

      // Get email and password input values
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        // Log in the user
        const userCredential = await loginUser(auth, email, password);
        console.log("User logged in:", userCredential.user);

        // Fetch user role and redirect based on role
        const userId = userCredential.user.uid; // Get the user ID
        const result = await getUserRoleAndStatus(userId);

        if (!result.isActive) {
          alert("Your account is inactive. Please contact support.");
          await signOut(auth); // Log out inactive users
          return;
        }

        alert(result.welcomeMessage);
        console.log("Redirecting to:", result.redirectUrl);
        window.location.href = result.redirectUrl; // Redirect based on the role
      } catch (error) {
        console.error("Error logging in:", error.message);
        alert("Login failed: " + error.message);
      }
    });
  }
});

// =============================
// Step 2: Authentication State Listener
// =============================
// Listen for Authentication State Changes
onAuthStateChanged(auth, async (user) => {
  const loginLink = document.getElementById("loginLink");
  const editProfileButton = document.getElementById("editProfLink");
  const joinUsButton = document.getElementById("joinUsButton");

  if (user) {
    console.log("User is logged in:", user.email);

    try {
      const userDoc = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDoc);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        if (!userData.isActive) {
          alert("Your account is inactive. Please contact support.");
          await signOut(auth); // Log out inactive users
          return;
        }

        // Update UI for logged-in state
        if (editProfileButton) editProfileButton.style.display = "block"; // Show Edit Profile button
        if (joinUsButton) joinUsButton.style.display = "none"; // Hide Join Us button

        // Set logout functionality for login link
        if (loginLink) {
          loginLink.onclick = async (event) => {
            event.preventDefault();
            await signOut(auth);
            alert("You are now logged out.");
            window.location.href = "Home.html"; // Redirect to Home page after logout
          };
        }
      } else {
        console.error("User data not found.");
        alert("An error occurred. Please log in again.");
        await signOut(auth);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      alert("An error occurred. Please log in again.");
      await signOut(auth);
    }
  } else {
    console.log("User is not logged in.");

    // Update UI for logged-out state
    if (loginLink) loginLink.href = "Login.html"; // Redirect login link to Login page
    if (editProfileButton) editProfileButton.style.display = "none"; // Hide Edit Profile button
    if (joinUsButton) joinUsButton.style.display = "block"; // Show Join Us button
  }
});


// =============================
// Step 3: Helper Functions
// =============================

// 3.1: Log in the user
async function loginUser(auth, email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential; // Return the userCredential object
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error; // Throw error to handle it in the form submission
  }
}

// 3.2: Log out the user
async function logoutUser(auth) {
  try {
    await signOut(auth);
    console.log("User logged out successfully.");
    window.location.href = "Home.html"; // Redirect to Home page after logout
  } catch (error) {
    console.error("Logout failed:", error.message);
    throw error; // Throw error to handle it
  }
}

// 3.3: Get User Role and Account Status
async function getUserRoleAndStatus(userId) {
  const userDoc = doc(db, "users", userId);
  const userSnap = await getDoc(userDoc);

  if (userSnap.exists()) {
    const userData = userSnap.data();

    if (!userData.isActive) {
      return { isActive: false }; // Account is inactive
    }

    // Return role and redirection info
    return {
      isActive: true,
      redirectUrl: userData.role === "admin" ? "adminDashboard.html" : "Home.html",
      welcomeMessage:
        userData.role === "admin"
          ? "Welcome System Administrator!"
          : "Welcome to the Home Page!",
    };
  }

  throw new Error("User data not found"); // Throw error if user data is missing
}
