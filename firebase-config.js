    // Import Firebase modules directly from CDN
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
    import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
    import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

  // firebase-config.js
  const firebaseConfig = {
    apiKey: "AIzaSyALeu97RwpKvqUDe_5Ugs9yTwp8oLlgkP8",
    authDomain: "chatbot-project---tourism.firebaseapp.com",
    projectId: "chatbot-project---tourism",
    storageBucket: "chatbot-project---tourism.appspot.com",
    messagingSenderId: "995285850120",
    appId: "1:995285850120:web:b3b98bb7d0cb51eabf59bd",
    measurementId: "G-JFP58XQHFC",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  export { app, auth, db };

  console.log("Firebase initialized successfully.");
