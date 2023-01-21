const feedList = document.querySelector(".feed-list");
const feedDetail = document.querySelector(".feed-detail");
const newFeedComponent = document.querySelector(".new-feed");
const feedContent = feedDetail.querySelector(".content");
const homeTitle = document.querySelector(".home-title");
const btnSendComment = document.querySelector(".btn");
let currentFeedId,
  currentUser = {
    id: "1",
    firstName: "ADAMA",
    lastName: "DIABY",
  };
// load feeds from database
const loadFeeds = () => {
  fetch("feeds/")
    .then((response) => response.json())
    .then((feeds) => {
      elements = ``;

      feeds.forEach((feed) => {
        elements += `<li class='feed flow' data-feed_id='${feed.id}'> 
                <div class='flow'>
                    <h2> ${feed.title} </h2>
                    <p> ${feed.excerpt} </p>
                </div>
                <div>
                    <p> ${feed.user.first_name} ${feed.user.last_name} </p>
                </div>
                <img src='${feed.image}'/>
             </li>`;
      });

      //   console.log(elements);
      feedList.innerHTML = elements;
    });
};

const startLoading = () => {
  document.querySelector(".loading").classList.remove("hidden");
};

const stopLoading = () => {
  document.querySelector(".loading").classList.add("hidden");
};

const loadFeedComments = (feed_id) => {
  commentsList = feedDetail.querySelector(".feed-comments");
  fetch(`/feeds/${feed_id}/comments`)
    .then((response) => response.json())
    .then((comments) => {
      let commentElements = ``;
      comments.forEach((comment) => {
        commentElements += `
          <li>
            <div class='user'>
              <div class='profile'></div>
              <div class='content'>
                <h3 class='username'> ${comment.user.firstName} ${comment.user.lastName} </h3>
                <p> ${comment.content} </p>
            </div>
            </div>
          </li>
        `;
      });

      // append comments
      commentsList.innerHTML = commentElements;
    })
    .catch((error) => console.log(error));
};

const showFeedDetail = (feed_id) => {
  //   console.log(feed_id);
  // hide feedList
  feedList.classList.add("hidden");
  // show feed detail with detail
  //   fetch feed
  startLoading();
  fetch(`feeds/${feed_id}`)
    .then((response) => response.json())
    .then((feed) => {
      stopLoading();

      // show feedDetail compoent
      feedDetail.classList.remove("hidden");

      const feedElement = `
            <div>
            <h1 class='feed-title'> ${feed.title} </h1>
            <p class='feed-content'> ${feed.content} </p>
      `;
      feedContent.innerHTML = feedElement;
      // feedDetail.appendChild(feedContent);
      feedDetail.insertBefore(feedContent, feedDetail.firstChild);

      // load feedComments
      loadFeedComments(feed_id);
      currentFeedId = feed_id;
    });
};

function getCookie(name) {
  let cookie = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return cookie ? cookie[2] : null;
}

const goToHomePage = () => {
  feedList.classList.remove("hidden");
  feedDetail.classList.add("hidden");
  newFeedComponent.classList.add("hidden");
  loadFeeds();
};

// APP LOGIC

homeTitle.addEventListener("click", () => {
  goToHomePage();
});

btnSendComment.addEventListener("click", (e) => {
  e.preventDefault();
  const input = document.querySelector(".form-input");
  const message = input.value;
  // the user id should be feyched from the server but for tesing purposes im hardcodin git here
  // just the user id to comment on the behalf of that user
  const data = {
    content: message,
    feedId: currentFeedId,
    userId: currentUser.id,
  };
  fetch(`new-comment/`, {
    method: "post",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("response data", data);
      // loadComments
      loadFeedComments(currentFeedId);
    })
    .catch((error) => {
      // an error occured
      // console.log(error);
    });
});

// new feed

// handle by form
const formEl = document.querySelector(".new-feed-form");
formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  var formData = new FormData(formEl);
  fetch("new-feed/", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success:", result);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

document.querySelector(".btn-new-feed").addEventListener("click", () => {
  feedList.classList.add("hidden");
  feedDetail.classList.add("hidden");
  newFeedComponent.classList.remove("hidden");
});

// document.querySelector(".btn-post-feed").addEventListener("click", (e) => {
//   e.preventDefault();
//   form = document.querySelector(".new-feed-form");
//   titleInput = form.querySelector("#title");
//   excerptInput = form.querySelector("#excerpt");
//   contentInput = form.querySelector("#content");

//   data = {
//     title: titleInput.value,
//     excerpt: excerptInput.value,
//     content: contentInput.value,
//     userId: currentUser.id,
//   };

//   // post data to new-feed/
//   fetch(`new-feed/`, {
//     method: "post",
//     headers: {
//       "Content-Type": "application/json",
//       "X-CSRFToken": getCookie("csrftoken"),
//     },
//     body: JSON.stringify(data),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("resonse data:", data);
//       goToHomePage();
//       titleInput.value = "";
//       excerptInput.value = "";
//       contentInput.value = "";
//     })
//     .catch((error) => {
//       console.log("error posting new feed:", error);
//     });
// });

// load initial feeds
loadFeeds();

// a feed clicked
feedList.addEventListener("click", (e) => {
  // console.log("Target", e.target.classList.contains("feed"));

  //   if clicked element is a feed
  // fetch that feed data and show it
  // if cliked element is a child element get parent which is feed
  if (e.target.classList.contains("feed")) {
    // console.log("feed clicked");
    showFeedDetail(+e.target.dataset.feed_id);
  } else {
    // console.log("child element clicked");
    // traverse the DOM to find feed element
    let feed = e.target.parentElement;
    while (feed.classList.contains("feed") == false) {
      feed = feed.parentElement;
    }

    // feed is found
    showFeedDetail(+feed.dataset.feed_id);
  }
});
