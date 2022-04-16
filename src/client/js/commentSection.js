const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const comments = document.querySelectorAll(".video__comment");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = text;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.className = "delete__comment";
  span2.addEventListener("click", hanleDelete);
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "" || text.trim() === "") {
    return;
  }
  // console.log(JSON.stringify({ text }));
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};
if (form) {
  form.addEventListener("submit", handleSubmit);
}

const hanleDelete = async (event) => {
  const targetComment = event.target.parentNode;
  targetComment.remove();
  const commentId = targetComment.dataset.id;
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
};

let commentsNumber;
let deleteBtn = document.querySelector(".delete__comment");
if (deleteBtn) {
  for (commentsNumber = 0; commentsNumber < comments.length; commentsNumber++) {
    deleteBtn = comments[commentsNumber].querySelector(".delete__comment");
    deleteBtn.addEventListener("click", hanleDelete);
  }
}
