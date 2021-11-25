        import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js';
        import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js';
                      
        const firebaseConfig = {
      
          apiKey: "AIzaSyCwveqN2Kxjn5U82NJn6pkoJ-zj_94ewaU",
      
          authDomain: "readercomments-43e7c.firebaseapp.com",
      
          projectId: "readercomments-43e7c",
      
          storageBucket: "readercomments-43e7c.appspot.com",
      
          messagingSenderId: "304340858985",
      
          appId: "1:304340858985:web:4c564cffba41bc78e60af8"
      
        };
        
        const app = initializeApp(firebaseConfig);
                
        export const db = getFirestore();
        
        
        
           