import { db } from './fb.js';
import { getFirestore, collection, getDocs, addDoc, onSnapshot, doc, deleteDoc, query, where, updateDoc } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js';
import { enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js';

const fsdb = db;
const commentsList = document.querySelector('#comments_list');
const form = document.querySelector('#add_comment');

function renderComments(resDoc) {
  let li = document.createElement("li");
  let friendlyname = document.createElement("span");
  let email = document.createElement("span");
  let region = document.createElement("span");
  /* let role = document.createElement("span"); *//* note: consider Use Case before implementing */
  /* let status = document.createElement("span"); *//* note: consider Use Case before implementing */
  let comment = document.createElement("span");
  /* let cross = document.createElement('div'); *//* note: consider Use Case before implementing */

  li.setAttribute('data-id', resDoc.id);
  li.setAttribute('class', 'commentslist');
  friendlyname.textContent = "Name: " + resDoc.data().friendlyname;
  email.textContent = "Email: " + resDoc.data().email;
  region.textContent = "Region: " + resDoc.data().region;
  /* role.textContent = "Role: " + resDoc.data().role; *//* note: consider Use Case before implementing */
  /* status.textContent = "Subscriber Status: " + resDoc.data().active; *//* note: consider Use Case before implementing */
  comment.textContent = "Comment: " + resDoc.data().comment;
  /* cross.textContent = 'X'; *//* note: consider Use Case before implementing */

  li.appendChild(friendlyname);
  li.appendChild(email);
  li.appendChild(region);
  /* li.appendChild(role); *//* note: consider Use Case before implementing */
  /* li.appendChild(status); *//* note: consider Use Case before implementing */
  li.appendChild(comment);
  /* li.appendChild(cross); *//* note: consider Use Case before implementing */
  commentsList.appendChild(li);
}

/*async - preferred over syncron*/
async function getUserComments(fs) {
  const commentsCollection = collection(fs, "Users");
  const querySnapshot = await getDocs(commentsCollection);
    querySnapshot.forEach((doc) => {
      renderComments(doc)
    })
}

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

form.addEventListener(('submit'), (e) => {
  e.preventDefault();
  const docRef = addDoc(collection(db, "Users"), {
      friendlyname: form.friendlyname.value,
      email: form.email.value,
      region: form.region.value,
     /*  role: form.role.value, *//* note: consider Use Case before implementing */
     /*  active: form.active.value, *//* note: consider Use Case before implementing */
      comment: form.comment.value
  }).catch((error) => console.log(error));
  form.reset();
})

getUserComments(fsdb);



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

/*ToDo*/
/*Not for PWA user view*/
/*track changes*/
/* note: consider Use Case before implementing */
/*comments should be approved by moderator before adding*/
/*possible use: add/append new comments to commentsList.appendChild(li);*/
/*note: remove will be for logged in admin view*/
/*implement with template literal, create element*/
/* const unsub = onSnapshot(collection(fs, "Users"), (doc) => {
  //console.log(doc.docChanges());
  doc.docChanges().forEach((change) => {
    //console.log(change, change.doc.data(), change.doc.id);
    if (change.type === "added") {
      //do..
    }
    if (change.type === "removed") {
      //do..
    }
  });
});  */

/*-------End ToDo--------*/
