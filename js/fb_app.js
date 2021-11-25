import { db } from './fb.js';
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, query, where, updateDoc } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js';

/* run for Users list data */
/* getUsers(db); */
/* async function getUsers(db) {
  const querySnapshot = await getDocs(collection(db, "Users"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
});
} */

const commentsList = document.querySelector('#comments_list');
const form = document.querySelector('#add_comment');

function renderComments(resDoc) {
  let li = document.createElement("li");
  let friendlyname = document.createElement("span");
  let email = document.createElement("span");
  let region = document.createElement("span");
  /* let role = document.createElement("span"); */
  /* let status = document.createElement("span"); */
  let comment = document.createElement("span");
  /* let cross = document.createElement('div'); */

  li.setAttribute('data-id', resDoc.id);
  li.setAttribute('class', 'commentslist');
  friendlyname.textContent = "Name: " + resDoc.data().friendlyname;
  email.textContent = "Email: " + resDoc.data().email;
  region.textContent = "Region: " + resDoc.data().region;
  /* role.textContent = "Role: " + resDoc.data().role; */
  /* status.textContent = "Subscriber Status: " + resDoc.data().active; */
  comment.textContent = "Comment: " + resDoc.data().comment;
  /* cross.textContent = 'X'; */

  li.appendChild(friendlyname);
  li.appendChild(email);
  li.appendChild(region);
  /* li.appendChild(role); */
  /* li.appendChild(status); */
  li.appendChild(comment);
  /* li.appendChild(cross); */

  commentsList.appendChild(li);

  /* cross.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    deleteDoc(doc(db, "Users", id))
}) */
}

const users = getDocs(collection(db, "Users")).then((snapshot) => {
  snapshot.forEach((doc) => {
      renderComments(doc)
  })
})

/* const q = query(collection(db, "Users"), where("region", "==", "CAeast")); */

/* const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data())
        }) */

/* const upDoc = doc(db, "Users", "4lUayGBAJNj7NjOy4Kz5"); */

/* updateDoc(upDoc, {
  region: "CAeast"
}) */

form.addEventListener(('submit'), (e) => {
  e.preventDefault();
  const docRef = addDoc(collection(db, "Users"), {
      friendlyname: form.friendlyname.value,
      email: form.email.value,
      region: form.region.value,
     /*  role: form.role.value, */
     /*  active: form.active.value, */
      comment: form.comment.value
  })
  form.reset();
})
