// Import Firestore and Firebase app from firebase-config.js
import { db } from "./firebase-config.js"; // Assuming firebase-config.js is in the same directory
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Function to fetch and display users
async function fetchUsers() {
  try {
    const usersCollection = collection(db, "users"); // Replace "users" with your Firestore collection name
    const snapshot = await getDocs(usersCollection);

    // Get reference to the HTML table body
    const userList = document.getElementById("user-list");

    snapshot.forEach((doc) => {
      const user = doc.data();

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
        <td><button class="disable-account-btn">Disable Account</button></td>
      `;

      // Append the row to the table body
      userList.appendChild(row);

      // Event listener for 'Change Password' button
      row.querySelector(".change-password-btn").addEventListener("click", () => {
        // Functionality for changing password (to be implemented)
        alert(`Change password for ${user.email}`);
      });

      // Event listener for 'Disable Account' button
      row.querySelector(".disable-account-btn").addEventListener("click", () => {
        // Functionality for disabling account (to be implemented)
        alert(`Disable account for ${user.email}`);
      });
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// Call fetchUsers when the script loads
fetchUsers();
