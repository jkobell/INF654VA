import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged  } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js';
                      
        const firebaseConfig = {
      
          apiKey: "AIzaSyCwveqN2Kxjn5U82NJn6pkoJ-zj_94ewaU",
      
          authDomain: "readercomments-43e7c.firebaseapp.com",
      
          projectId: "readercomments-43e7c",
      
          storageBucket: "readercomments-43e7c.appspot.com",
      
          messagingSenderId: "304340858985",
      
          appId: "1:304340858985:web:4c564cffba41bc78e60af8"
      
        };
        
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        //auth -- signed in status change; i.e, to logout status
        onAuthStateChanged(auth, (user) => {
            if(user) {
                console.log("User logged in: ", user.email);

            }
            else {
                console.log("User is logged out");
            }
        });

        //signup
        const signupForm = document.querySelector("#signup-form");
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            //get user info
            const email = signupForm["signup-email"].value;
            const password = signupForm["signup-password"].value;

            createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                const user = userCredential.user;
                console.log("User signup with createUserWithEmailAndPassword fb method");
                console.log(user);
                const modal = document.querySelector("#modal-signup");
                M.Modal.getInstance(modal).close();
                signupForm.reset();
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
        });

        //logout
        const logout = document.querySelector("#logout");
        logout.addEventListener("click", (e) => {
            e.preventDefault();
            signOut(auth).then(() => {
            console.log("User logout with signOut fb method");
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
        });

        //login
        const loginForm = document.querySelector("#login-form");
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = loginForm["login-email"].value;
            const password = loginForm["login-password"].value;

            signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                const user = userCredential.user;
                console.log("User login with signInWithEmailAndPassword fb method");
                console.log(user);
                const modal = document.querySelector("#modal-login");
                M.Modal.getInstance(modal).close();
                signupForm.reset();
                }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
        });
        

        


