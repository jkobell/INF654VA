import { db } from './fb.js';
import { getFirestore, collection, getDocs, addDoc, onSnapshot, doc, deleteDoc, query, where, updateDoc } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js';
import { enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js';

const fsdb = db;
const commentsList = document.querySelector('#comments_list');
const form = document.querySelector('#add_comment');

enableIndexedDbPersistence(db)
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          console.log("Persistence failed.");
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          console.log("Persistence is not valid.");
      }
  });

//async is preferred
async function getUserComments(fs) {
  const commentsCollection = collection(fs, "Users");
  const querySnapshot = await getDocs(commentsCollection);
    querySnapshot.forEach((doc) => {
      renderCommentsAdmin(doc)
    });
}

  /*track changes*/
  var initState = true;
  const unsub = onSnapshot(collection(db, "Users"), (snapshot) => {
    if (initState)
        {
          initState = false;
        }
    else {
    console.log(snapshot.docChanges());
    snapshot.docChanges().forEach((change) => {
        console.log(change, change.doc.data(), change.doc.id);
        console.log("hasPendingWrites: ", change.doc.metadata.hasPendingWrites);
        console.log("fromCache: ", change.doc.metadata.fromCache);
        console.log("_document", change.doc._document);

        
        
          if (change.type === "added" &&
          //change.doc.metadata.hasPendingWrites === true &&
          change.doc.metadata.fromCache === false) {//true, false onSubmit
          console.log("An add event has occured!");
          console.log("initState: ", initState);
          renderComment(change.doc.data(), change.doc.id);
          }
          if (change.type === "removed" &&
              change.doc.metadata.hasPendingWrites === false &&
              change.doc.metadata.fromCache === false) {//false. false remove
              console.log("A removed event has occured!");
              console.log("change doc ID: ", change.doc.id)
              const comment = document.querySelector(`.commentslist[data-id = ${change.doc.id}]`);
              comment.remove();
              //do..
          }
        
      
      });
    }
  }); 

function renderCommentsAdmin(resDoc) {
  let li = document.createElement("li");
  let friendlyname = document.createElement("span");
  let email = document.createElement("span");
  let region = document.createElement("span");
  let moderator = document.createElement("span");
  let comment = document.createElement("span");
  let cross = document.createElement('div');
  

  li.setAttribute('data-id', resDoc.id);
  li.setAttribute('class', 'commentslist');
  friendlyname.textContent = "Name: " + resDoc.data().friendlyname;
  email.textContent = "Email: " + resDoc.data().email;
  region.textContent = "Region: " + resDoc.data().region;
  moderator.textContent = "Moderator: " + resDoc.data().moderator;
  comment.textContent = "Comment: " + resDoc.data().comment;
  cross.textContent = 'X'; 

  li.appendChild(friendlyname);
  li.appendChild(email);
  li.appendChild(region);
  li.appendChild(moderator); 
  li.appendChild(comment);
  li.appendChild(cross); 
  commentsList.appendChild(li);

  cross.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    deleteDoc(doc(fsdb, "Users", id))
  })
}

form.addEventListener(('submit'), (e) => {
  e.preventDefault();
  const docRef = addDoc(collection(db, "Users"), {
      friendlyname: form.friendlyname.value,
      email: form.email.value,
      region: form.region.value,
      moderator: "false", //default == false
      comment: form.comment.value
  }).catch((error) => console.log(error));
  form.reset();
})

getUserComments(fsdb);

/*track changes*/
/* const unsub = onSnapshot(collection(fsdb, "Users"), (doc) => {
  //console.log(doc.docChanges());
  doc.docChanges().forEach((change) => {
    //console.log(change, change.doc.data(), change.doc.id);
    if (change.type === "added") {
      console.log("An add event has occured!");
      renderComment(change.doc.data(), change.doc.id);
    }
    if (change.type === "removed") {
      //do..
    }
  });
});  */

/*-------Begin ToDo--------*/
/*ToDo*/
/*Not for PWA user view*/
/*use as find query for logged in admin view*/
/* const q = query(collection(db, "Users"), where("region", "==", "CAeast")); */

/* const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data())
        }) */

/*ToDo*/
/*Not for PWA user view*/
/*use as edit-update for logged in admin view*/
/* const upDoc = doc(db, "Users", "4lUayGBAJNj7NjOy4Kz5"); */
/* updateDoc(upDoc, {
  region: "CAeast"
}) */

/*ToDo*/
/*Not for PWA user view*/
/*call deleteDoc as delete comment for logged in admin view*/
/* cross.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    deleteDoc(doc(db, "Users", id))
}) */

/*ToDo*/
/*Not for PWA user view*/
/*use as query for logged in admin view*/
/* run for Users list data */
/* getUsers(db); */
/* async function getUsers(db) {
  const querySnapshot = await getDocs(collection(db, "Users"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
});
} */

/*ToDo performance test sync vs async*/
/*sync*/
/* const users = getDocs(collection(db, "Users")).then((snapshot) => {
  snapshot.forEach((doc) => {
      renderComments(doc)
  })
}) */


/*-------End ToDo--------*/
