import { db, app } from './fb.js';
import { getAuth, onAuthStateChanged, updateProfile } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js';
import { getFirestore, collection, getDocs, addDoc, onSnapshot, doc, deleteDoc, query, where, updateDoc } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js';
import { enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js';


const auth = getAuth(app);

const fsdb = db;
const commentsList = document.querySelector('#comments_list');
const form = document.querySelector('#add_comment');

const submit_loggedin = document.querySelector(".submit_comment_loggedin_wrapper");
const submit_loggedout = document.querySelector(".submit_comment_loggedout_wrapper");
const comment_form = document.querySelector(".formcontent");

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

  const set_submit = (user) => {
    if (user) {
        submit_loggedin.style.display = "block";
        comment_form.style.display = "block";
        submit_loggedout.style.display = "none";
    }
    else {
        submit_loggedout.style.display = "block";
        submit_loggedin.style.display = "none";
        comment_form.style.display = "none";
    }
  };

  

  onAuthStateChanged(auth, (user) => {
    let current_comments_list = document.querySelectorAll('.commentslist');
    
    //remove all comments in list before creating new list and view
    if (current_comments_list != null && current_comments_list.length > 0) {
      current_comments_list.forEach (c => {
        commentsList.removeChild(c);
      });
    }
        
    let get_comments = getUserComments(fsdb, user);
    let set_submit_form = set_submit(user);

      if(user) {
          console.log("User logged in at reader_comments: ", user.email);
          console.log("User object at reader_comments: ", user);
      }
      else {
          console.log("User is logged out at reader_comments:");
      }
});

//async is preferred
async function getUserComments(fs, current_user) {
  const commentsCollection = collection(fs, "Users");
  const querySnapshot = await getDocs(commentsCollection);
    querySnapshot.forEach((doc) => {
      if(current_user) {
        if (current_user.displayName === "administrator") {
          renderCommentsAdmin(doc);
        }
        else if (current_user.displayName === "moderator") {
          renderCommentsModerator(doc);
        }
        else {
          renderCommentsUser(doc);
        }
      }
      else {
        renderCommentsUser(doc);
      }
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
              const comment = document.querySelector(`.commentslist[data-id = "${change.doc.id}"]`);
              comment.remove();
          }
      });
    }
  });
  
//Administrator View
function renderCommentsAdmin(resDoc) {
  let li = document.createElement("li");
  let friendlyname = document.createElement("span");
  let email = document.createElement("span");
  let region = document.createElement("span");

  let moderator_wrapper = document.createElement('div');
  let moderator_label = document.createElement('label');
  let moderator_span = document.createElement("span");
  let moderator_checkbox = document.createElement("input");
  
  let delete_comment = document.createElement('button');
  let edit_comment_wrapper = document.createElement('div');
  let edit_comment_form = document.createElement('form');
  let edit_comment_div = document.createElement('div');
  let edit_comment_label = document.createElement('label');
  let edit_comment_textarea = document.createElement('textarea');
  let edit_comment_save = document.createElement('button');
  

  li.setAttribute('data-id', resDoc.id);
  li.setAttribute('class', 'commentslist');

  moderator_checkbox.setAttribute('type', 'checkbox');

  delete_comment.style.padding = '2px';
  delete_comment.style.float = 'right';
  edit_comment_textarea.style.padding = '10px'; 
  edit_comment_textarea.style.height = '5em'; 

  edit_comment_wrapper.setAttribute('class', 'formcontent');
  edit_comment_form.setAttribute('id', 'edit_comment');
  edit_comment_label.setAttribute('for', 'comment');
  edit_comment_textarea.setAttribute('name', 'comment');
  edit_comment_textarea.setAttribute('id', 'comment');

  edit_comment_save.style.padding = '2px';
  edit_comment_save.style.float = 'none';
  edit_comment_save.style.margin = 'auto';


  friendlyname.textContent = "Name: " + resDoc.data().friendlyname;
  email.textContent = "Email: " + resDoc.data().email;
  region.textContent = "Region: " + resDoc.data().region;
  delete_comment.textContent = "Remove";
  edit_comment_label.textContent = "Comment: ";
  edit_comment_textarea.textContent = resDoc.data().comment;
  edit_comment_save.textContent = "Save";

  moderator_span.textContent = "Moderator: ";
  moderator_checkbox.checked = resDoc.data().moderator;

  
  moderator_label.appendChild(moderator_checkbox);
  moderator_label.appendChild(moderator_span);
  moderator_wrapper.appendChild(moderator_label);
  edit_comment_form.appendChild(moderator_wrapper);

  edit_comment_div.appendChild(edit_comment_label);
  edit_comment_div.appendChild(edit_comment_textarea);
  edit_comment_div.appendChild(edit_comment_save);
  edit_comment_form.appendChild(edit_comment_div);

  edit_comment_wrapper.appendChild(edit_comment_form);

  li.appendChild(delete_comment); 
  li.appendChild(friendlyname);
  li.appendChild(email);
  li.appendChild(region);
  li.appendChild(edit_comment_wrapper);
  
  commentsList.appendChild(li);
  
  edit_comment_save.addEventListener('click', (e) => {
    e.preventDefault();
    let id = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id');
    let update_record = doc(fsdb, "Users", id);
    let comment_value = e.target.parentNode.children[1].value;
    let moderator_value = e.target.parentNode.parentNode.children[0].children[0].children[0].checked;
    
    updateDoc(update_record, {
      comment: comment_value,
      moderator: moderator_value
    }).catch((error) => console.log(error));
  })
  

  delete_comment.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    deleteDoc(doc(fsdb, "Users", id))
  })
}


//Moderator View
function renderCommentsModerator(resDoc) {
  let li = document.createElement("li");
  let friendlyname = document.createElement("span");
  let region = document.createElement("span");
  let delete_comment = document.createElement('button');
  let edit_comment_wrapper = document.createElement('div');
  let edit_comment_form = document.createElement('form');
  let edit_comment_div = document.createElement('div');
  let edit_comment_label = document.createElement('label');
  let edit_comment_textarea = document.createElement('textarea');
  let edit_comment_save = document.createElement('button');
  

  li.setAttribute('data-id', resDoc.id);
  li.setAttribute('class', 'commentslist');
  delete_comment.style.padding = '2px';
  delete_comment.style.float = 'right';
  edit_comment_textarea.style.padding = '10px'; 
  edit_comment_textarea.style.height = 'auto'; 

  edit_comment_wrapper.setAttribute('class', 'formcontent');
  edit_comment_form.setAttribute('id', 'edit_comment');
  edit_comment_label.setAttribute('for', 'comment');
  edit_comment_textarea.setAttribute('name', 'comment');
  edit_comment_textarea.setAttribute('id', 'comment');

  edit_comment_save.style.padding = '2px';
  edit_comment_save.style.float = 'none';
  edit_comment_save.style.margin = 'auto';


  friendlyname.textContent = "Name: " + resDoc.data().friendlyname;
  region.textContent = "Region: " + resDoc.data().region;
  delete_comment.textContent = "Remove";
  edit_comment_label.textContent = "Comment: ";
  edit_comment_textarea.textContent = resDoc.data().comment;
  edit_comment_save.textContent = "Save";

  edit_comment_div.appendChild(edit_comment_label);
  edit_comment_div.appendChild(edit_comment_textarea);
  edit_comment_div.appendChild(edit_comment_save);
  edit_comment_form.appendChild(edit_comment_div);
  edit_comment_wrapper.appendChild(edit_comment_form);

  

  li.appendChild(delete_comment); 
  li.appendChild(friendlyname);
  li.appendChild(region);
  li.appendChild(edit_comment_wrapper);
  
  commentsList.appendChild(li);
  
  edit_comment_save.addEventListener('click', (e) => {
    e.preventDefault();
    let id = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id');
    let update_record = doc(fsdb, "Users", id);
    let comment_value = e.target.parentNode.children[1].value;
    
    updateDoc(update_record, {
      comment: comment_value
    }).catch((error) => console.log(error));
  })
  

  delete_comment.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    deleteDoc(doc(fsdb, "Users", id))
  })
}

//User View
function renderCommentsUser(resDoc) {
  let li = document.createElement("li");
  let friendlyname = document.createElement("span");
  let region = document.createElement("span");
  let comment = document.createElement("span");

  li.setAttribute('data-id', resDoc.id);
  li.setAttribute('class', 'commentslist');
  friendlyname.textContent = "Name: " + resDoc.data().friendlyname;
  region.textContent = "Region: " + resDoc.data().region;
  comment.textContent = "Comment: " + resDoc.data().comment;

  li.appendChild(friendlyname);
  li.appendChild(region);
  li.appendChild(comment);
  commentsList.appendChild(li);
}

//Reader comment submit
form.addEventListener(('submit'), (e) => {
  e.preventDefault();
  const docRef = addDoc(collection(db, "Users"), {
      friendlyname: form.friendlyname.value,
      email: form.email.value,
      region: form.region.value,
      moderator: false, //default == false
      comment: form.comment.value
  }).catch((error) => console.log(error));
  form.reset();
})

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

/*-------End ToDo--------*/
