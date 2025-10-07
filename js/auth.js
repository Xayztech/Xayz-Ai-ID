const firebaseConfig = {
  apiKey: "AIzaSyAxpsXzKUYdEzlbuM6znZpd8ZNhUfJiiPc",
  authDomain: "xayz-ai-id.firebaseapp.com",
  projectId: "xayz-ai-id",
  storageBucket: "xayz-ai-id.firebasestorage.app",
  messagingSenderId: "410799810395",
  appId: "1:410799810395:web:e010f40c21713a0f965c7e"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const currentPage = window.location.pathname.split('/').pop();

const signInWithGoogle = () => {
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log("Login berhasil:", result.user);
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Login gagal:", error);
        });
};

const signOutUser = () => {
    auth.signOut()
        .then(() => {
            console.log("Logout berhasil");
            window.location.href = "login.html";
        })
        .catch((error) => {
            console.error("Logout gagal:", error);
        });
};

auth.onAuthStateChanged(user => {
    if (user) {
        if (currentPage === 'login.html') {
            window.location.href = 'index.html';
        }
    } else {
        if (currentPage !== 'login.html') {
            window.location.href = 'login.html';
        }
    }
});

if (currentPage === 'login.html') {
    const loginBtn = document.getElementById('login-google-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', signInWithGoogle);
    }
}