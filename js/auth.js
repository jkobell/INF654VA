import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile  } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js';
                      
        const firebaseConfig = {
      
          apiKey: "AIzaSyCwveqN2Kxjn5U82NJn6pkoJ-zj_94ewaU",
      
          authDomain: "readercomments-43e7c.firebaseapp.com",
      
          projectId: "readercomments-43e7c",
      
          storageBucket: "readercomments-43e7c.appspot.com",
      
          messagingSenderId: "304340858985",
      
          appId: "1:304340858985:web:4c564cffba41bc78e60af8"
      
        };
        
        export const app = initializeApp(firebaseConfig);
        export const auth = getAuth(app);

        const loggedOutLinks = document.querySelectorAll(".logged-out");
        const loggedInLinks = document.querySelectorAll(".logged-in");

        
        const account_details_div = document.querySelector('.account-details');
        const display_account_details = (info) => {
            if (info.displayName === null) {
                info.displayName = "Member";
            }
            const html = `
            <div>
                <span>Welcome: </span><span>${info.displayName}</span>
                <br> 
                <span>Logged in as: </span><span>${info.email}</span>
            </div>
            `;
            account_details_div.innerHTML = html;
        };

        const set_login_nav = (user) => {
            if (user) {
                loggedOutLinks.forEach((item) => (item.style.display = "none"));
                loggedInLinks.forEach((item) => (item.style.display = "block"));
            }
            else {
                loggedOutLinks.forEach((item) => (item.style.display = "block"));
                loggedInLinks.forEach((item) => (item.style.display = "none"));
            }
        };

        //auth -- signed in status change; i.e, to logout status
        onAuthStateChanged(auth, (user) => {
            set_login_nav(user);
            if(user) {
                console.log("User logged in: ", user.email);
                console.log("User object: ", user);
                //update administrator or moderator - uncomment ONLY to set displayName
                //set_displayName(user);
            }
            else {
                console.log("User is logged out");
            }
        });

        //Account Details
        const account = document.querySelector('#account');
        account.addEventListener("click", (e) => {
            e.preventDefault();
            let authuser = auth.currentUser;
            display_account_details(authuser);
        });

        const mobile_account = document.querySelector('#mobile_account');
        mobile_account.addEventListener("click", (e) => {
            e.preventDefault();
            let authuser = auth.currentUser;
            display_account_details(authuser);
        });

        //signup
        const signupForm = document.querySelector("#signup-form");
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
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
                console.log("Logout error: ", error.code +" : "+ error.message);
            });
        });

        const mobile_logout = document.querySelector("#mobile_logout");
        mobile_logout.addEventListener("click", (e) => {
            e.preventDefault();
            signOut(auth).then(() => {
            console.log("User logout with signOut fb method");
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Logout error: ", error.code +" : "+ error.message);
            });
        });

        //login
        const loginForm = document.querySelector("#login-form");
        const user_login_error_message = document.querySelector("#user_login_error_message");
        const html = `<h3>Login error: email or password was not correct.</h3>`;
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
                loginForm.reset();
                }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Login error: ", error.code +" : "+ error.message);
                loginForm.reset();
                user_login_error_message.innerHTML = html;
            });
        });

        //To Do: create profile update utility to assign administrator or moderator
        //Usage: create an administartor or moderator, login under created account, updateProfile() user.displayName to administrator or moderator
        //provide login credentials to administrator or moderator
        //note: delete account in Firebase console to remove account
        //uncomment to run as needed
        //const set_displayName = (user) => {
                //update administrator - uncomment ONLY to set displayName
                /* updateProfile(user, {
                    displayName: "administrator"
                    }).then(() => {
                        console.log("displayName set to administrator for: ", auth.currentUser);
                    }).catch((error) => {
                        console.log("profile update error: ", error);
                    }); */

                //update moderator - uncomment ONLY to set displayName
                /* updateProfile(user, {
                    displayName: "moderator"
                    }).then(() => {
                        console.log("displayName set to moderator for: ", auth.currentUser);
                    }).catch((error) => {
                        console.log("profile update error: ", error);
                    }); */
        //};