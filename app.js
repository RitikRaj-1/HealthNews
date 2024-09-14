const API_KEY = "9ba46422e55847098855c2995664151e"
const url = "https://newsapi.org/v2/everything?q="

window.addEventListener("load", () => fetchNews("Health"));

async function fetchNews(query) {
    try {
        const res = await fetch(`/.Netlify/functions/fetchNews?q=${query}`); // Calling the Netlify function instead
        const data = await res.json();
        console.log('API Response:', data); // To check what the function returns
        bindData(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}


function reload() {
    window.location.reload();
}

function bindData(articles) {
    const cardscontainer = document.getElementById("card-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardscontainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;

        const cardclone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardclone, article);
        cardscontainer.appendChild(cardclone);
    });
}

function fillDataInCard(cardclone, article) {
    const newsimg = cardclone.querySelector('#news-img');
    const newstitle = cardclone.querySelector('#news-title');
    const newssoruce = cardclone.querySelector('#news-source');
    const newsdesc = cardclone.querySelector('#news-desc');
    const bookmarkBtn = cardclone.querySelector('#bookmark-btn');

    newsimg.src = article.urlToImage;
    newstitle.innerHTML = article.title;
    newsdesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    });

    newssoruce.innerHTML = `${article.source.name} - ${date}`;

    const articleId = article.url; // Using the article URL as the unique ID

    // Check if the article is already bookmarked
    if (localStorage.getItem(`bookmark-${articleId}`)) {
        bookmarkBtn.classList.add("bookmarked");
        bookmarkBtn.innerText = "Bookmarked";
    }

    bookmarkBtn.addEventListener("click", () => {
        if (localStorage.getItem(`bookmark-${articleId}`)) {
            // Remove bookmark
            localStorage.removeItem(`bookmark-${articleId}`);
            bookmarkBtn.classList.remove("bookmarked");
            bookmarkBtn.innerText = "Bookmark";
        } else {
            // Add bookmark
            localStorage.setItem(`bookmark-${articleId}`, JSON.stringify(article));
            bookmarkBtn.classList.add("bookmarked");
            bookmarkBtn.innerText = "Bookmarked";
        }
    });

    // cardclone.firstElementChild.addEventListener('click', () => {
    //     window.open(article.url, "_blank");
    // });
}

let curSelectitem = null;

function onNavItemClick(id) {
    fetchNews(id);
    const navitem = document.getElementById(id);
    curSelectitem?.classList.remove("active");
    curSelectitem = navitem;
    curSelectitem.classList.add("active");
    console.log("Here");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("news-input");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectitem?.classList.remove('active');
    curSelectitem = null;
});

// Show and hide the modal
const bookmarkNavBtn = document.getElementById("bookmark-nav-btn");
const bookmarkModal = document.getElementById("bookmark-modal");
const closeBtn = document.getElementById("close-btn");

bookmarkNavBtn.addEventListener("click", () => {
    displayBookmarks();
    bookmarkModal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
    bookmarkModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target == bookmarkModal) {
        bookmarkModal.style.display = "none";
    }
});

function displayBookmarks() {
    const bookmarksSection = document.getElementById("bookmarks-section");

    // Clear the existing content
    bookmarksSection.innerHTML = "<h2>Bookmarked Articles</h2>";

    // Retrieve all bookmarked articles
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("bookmark-")) {
            const article = JSON.parse(localStorage.getItem(key));
            const cardclone = document.getElementById("template-news-card").content.cloneNode(true);
            fillDataInCard(cardclone, article);
            bookmarksSection.appendChild(cardclone);
        }
    }
}

