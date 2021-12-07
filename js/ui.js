const commentsList = document.querySelector('#comments_list');

const renderComment = (data, id) => {
    const html = `
    <li class="commentslist" data-id ="${id}">
        <span>Name: ${data.friendlyname}
        </span>
        <span>Email:  ${data.email}
        </span>
        <span>Region: ${data.region}
        </span>
        <span>Moderator: ${data.moderator}
        </span>
        <span>Comment: ${data.comment}
        </span>
    </li>
    `;
      
    commentsList.innerHTML += html;
  };
  