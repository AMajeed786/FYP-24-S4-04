// Import Firestore and Firebase app from firebase-config.js
import { db } from "./firebase-config.js"; // Assuming firebase-config.js is in the same directory
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Function to fetch and display users
async function fetchUsers() {
  try {
    const usersCollection = collection(db, "users"); // Reference the Firestore 'users' collection
    const snapshot = await getDocs(usersCollection); // Fetch all documents in the collection

    // Get reference to the HTML table body
    const userList = document.getElementById("user-list");

    snapshot.forEach((docSnap) => {
      const user = docSnap.data(); // Get document data
      const docId = docSnap.id; // Get the document ID

      // Format createdAt timestamp
      const createdAt = user.createdAt
        ? new Date(user.createdAt).toLocaleString()
        : "N/A";

      // Create a new row for each user
      const row = document.createElement("tr");

      // Add user data to the row
      row.innerHTML = `
        <td>${createdAt}</td>
        <td>${user.email || "N/A"}</td>
        <td>${user.name || "N/A"}</td>
        <td>${user.role || "N/A"}</td>
        <td><button class="change-password-btn">Change Password</button></td>
        <td><button class="toggle-account-btn">${user.isActive ? "Disable Account" : "Activate Account"}</button></td>
      `;

      // Append the row to the table body
      userList.appendChild(row);

      // Event listener for 'Change Password' button
      row.querySelector(".change-password-btn").addEventListener("click", () => {
        alert(`Change password for ${user.email}`);
      });

      // Event listener for 'Disable/Activate Account' button
      const toggleButton = row.querySelector(".toggle-account-btn");
      toggleButton.addEventListener("click", async () => {
        const action = user.isActive ? "disable" : "activate";
        if (confirm(`Are you sure you want to ${action} the account for ${user.email}?`)) {
          try {
            // Update Firestore to toggle the `isActive` field
            const userDoc = doc(db, "users", docId);
            await updateDoc(userDoc, { isActive: !user.isActive });

            // Update the UI
            toggleButton.textContent = user.isActive ? "Activate Account" : "Disable Account";
            user.isActive = !user.isActive; // Update the local state
            alert(`Account ${action}d successfully.`);
          } catch (error) {
            console.error(`Error ${action}ing account:`, error.message);
            alert(`Failed to ${action} account. See console for details.`);
          }
        }
      });
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// Call fetchUsers when the script loads
fetchUsers();
