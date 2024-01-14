import { requestBooks } from './src/API/API.js';
import './src/components/banner.js';
import { renderTemplate, container } from './src/components/card.js';
import './main.css';

const loadMoreButton = document.querySelector(".book__more-button");
const bookMenuButtons = document.querySelectorAll(".books__menu-button");
const bookMenuListItems = document.querySelectorAll(".books__menu-item");

let currentApiRequest;
let currentRequestIndex;

function resetSearchData() {
    currentApiRequest = "";
    currentRequestIndex = 0;
}

function setSearchData(button, array) {
    currentApiRequest = button.dataset.type;
    currentRequestIndex = array.length;
}

requestBooks(bookMenuButtons[0].dataset.type).then((res) => {
    let booksInfo = res.items;
    if(booksInfo.length === 6) {
        loadMoreButton.style.display = "block";
    }
    renderTemplate(booksInfo);
    setSearchData(bookMenuButtons[0], booksInfo);
});

bookMenuButtons.forEach((button) => {
    button.addEventListener("click", () => {
        container.innerHTML = "";
        resetSearchData();
        bookMenuListItems.forEach((item) => {
            item.classList.remove("books__menu-item_type_selected");
        });
        button.parentElement.classList.add("books__menu-item_type_selected");
        requestBooks(button.dataset.type).then((res) => {
            let booksInfo = res.items;
            if(booksInfo.length === 6) {
                loadMoreButton.style.display = "block";
            }
            renderTemplate(booksInfo);
            setSearchData(button, booksInfo);
        });
    });
});

loadMoreButton.addEventListener("click", () => {
    requestBooks(currentApiRequest, currentRequestIndex).then((res) => {
        let booksInfo = res.items;
        if(booksInfo.length < 6) {
            loadMoreButton.style.display = "none";
        }
        renderTemplate(booksInfo);
        currentRequestIndex += booksInfo.length;
    });
});