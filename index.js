import { requestBooks } from './src/API/API.js'


const banners = [
    {
        "src": "./src/images/banner_01.png",
        "alt": "first banner"
    },
    {
        "src": "./src/images/banner_02.png",
        "alt": "second banner"
    },
    {
        "src": "./src/images/banner_03.png",
        "alt": "third banner"
    }
];

const bannerImage = document.querySelector(".banner__image");
const bannerNavigationButtons = document.querySelectorAll(".banner__radio-button");
const container = document.querySelector(".books__cards")
const loadMoreButton = document.querySelector(".book__more-button");
const bookMenuButtons = document.querySelectorAll(".books__menu-button");
const bookMenuListItems = document.querySelectorAll(".books__menu-item");
const firstBookMenuButton = document.querySelector(".books__menu-button");
const cartItemsCount = document.querySelector(".header__items-count");


let currentIndex = 0;
let renderTimer = 5000;
let currentApiRequest;
let currentRequestIndex;
let cartItems = 0;
const boughtBooks = localStorage.getItem("boughtBooks")?JSON.parse(localStorage.getItem("boughtBooks")):[];

if (localStorage.getItem("cartItems")) {
    cartItems = Number(localStorage.getItem("cartItems"));
    renderCart();
}

function renderCart() {
    if (cartItems > 0) {
        cartItemsCount.textContent = cartItems;
        console.log(cartItems)
        cartItemsCount.style.display = "block";
    } else {
        cartItemsCount.style.display = "none";
    }
}

function addItemToCart() {
    cartItems += 1;
    localStorage.setItem("cartItems", cartItems);
    renderCart();
}

function removeItemFromCart() {
    cartItems -= 1;
    localStorage.setItem("cartItems", cartItems);
    renderCart();
}


function renderIntervalBanner() {
    if (currentIndex === banners.length - 1) {
        renderBanner(banners, 0);
    } else {
        renderBanner(banners, currentIndex + 1);
    }
}

let indervalId = setInterval(renderIntervalBanner, renderTimer);

function renderBanner(array, newIndex) {
    bannerNavigationButtons[currentIndex].classList.remove("banner__radio-button_type_selected")
    bannerImage.src = array[newIndex].src;
    bannerImage.alt = array[newIndex].alt;
    bannerNavigationButtons[newIndex].classList.add("banner__radio-button_type_selected");
    currentIndex = newIndex
}

renderBanner(banners, currentIndex);

bannerNavigationButtons.forEach((button) => {
    button.addEventListener("click", () => {
        clearInterval(indervalId);
        renderBanner(banners, Number(button.dataset.index));
        indervalId = setInterval(renderIntervalBanner, renderTimer);
    })
})

function fillRatingStars(book, ratingStars, reviewContainer) {
    if (book.volumeInfo.averageRating) {
        let ratingNumber = Number(book.volumeInfo.averageRating)
        for (let i = 0; i <= 4; i++) {
            if (ratingNumber >= i) {
                ratingStars[i].querySelector("#starFill").setAttribute("offset", "100%");
            } else {
                let x = (i - ratingNumber) * 100;
                ratingStars[i].querySelector("#starFill").setAttribute("offset", `${x}%`);
                break
            }
        }
    } else {
        reviewContainer.style.visibility = "hidden"
    }
}

function renderTemplate(booksInfo) {

    booksInfo.forEach((book) => {
        const card = document.querySelector("#card__template").content.querySelector(".book__card").cloneNode(true);
        const bookImg = card.querySelector(".book__img");
        const bookAuthor = card.querySelector(".book__author");
        const bookName = card.querySelector(".book__name");
        const bookReviewCount = card.querySelector(".book__review-count");
        const ratingStars = card.querySelectorAll(".book__review-star");
        const reviewContainer = card.querySelector(".book__review-container");
        const bookDescription = card.querySelector(".book__description");
        const saleInfo = card.querySelector(".book__price");
        const buyButton = card.querySelector(".book__buy-button");
        

        for (let i = 0; i < ratingStars.length; i++) {
            let gradient = ratingStars[i].querySelector("#half_grad");
            let colorPath = ratingStars[i].querySelector("#color_path");
            gradient.setAttribute("id", `${book.id}${[i]}`);
            colorPath.setAttribute("fill", `url(#${book.id}${[i]})`)
        }

        if (book.volumeInfo.imageLinks) {
            bookImg.src = book.volumeInfo.imageLinks.thumbnail;
        } else {
            bookImg.src = "./src/images/book_default.png"
        }

        bookAuthor.textContent = book.volumeInfo.authors.join(", ");

        bookName.textContent = book.volumeInfo.title;
        if (book.volumeInfo.ratingsCount) {
            bookReviewCount.textContent = `${book.volumeInfo.ratingsCount} review(s)`
        } else {
            bookReviewCount.textContent = ""
        }

        fillRatingStars(book, ratingStars, reviewContainer)

        bookDescription.textContent = book.volumeInfo.description;

        if(book.saleInfo.retailPrice) {
            console.log(book.saleInfo.retailPrice)
            saleInfo.textContent = book.saleInfo.retailPrice;
        } else {
            saleInfo.style.visibility = "hidden";
        }

        function removeBookFromArray(array, id) {
            let boughtBookIndex = array.indexOf(id);
            array.splice(boughtBookIndex, 1);
            return array;
        }

        buyButton.addEventListener('click', () => {

            if(boughtBooks.includes(book.id)) {
                console.log("book already bought", book.id);
                removeBookFromArray(boughtBooks, book.id)
                localStorage.setItem('boughtBooks', JSON.stringify(boughtBooks));
                console.log("book deleted", boughtBooks)
                removeItemFromCart();
                buyButton.classList.remove("book__buy-button_type_pressed");
                buyButton.textContent = "buy now";
            } else {
                console.log("book not bought, adding!")
                boughtBooks.push(book.id)
                localStorage.setItem('boughtBooks', JSON.stringify(boughtBooks));
                addItemToCart();
                buyButton.classList.add("book__buy-button_type_pressed");
                buyButton.textContent = "in the cart";
            }

            
        })

        if(boughtBooks.includes(book.id)) {
            buyButton.classList.add("book__buy-button_type_pressed");
            buyButton.textContent = "in the cart";
        }


        container.append(card);
    })
}

function resetSearchData() {
    currentApiRequest = "";
    currentRequestIndex = 0;
}

requestBooks(firstBookMenuButton.dataset.type).then((res) => {
    let booksInfo = res.items;
    if(booksInfo.length === 6) {
        loadMoreButton.style.display = "block";
    }
    renderTemplate(booksInfo);
    currentApiRequest = firstBookMenuButton.dataset.type;
    currentRequestIndex = booksInfo.length;
})

bookMenuButtons.forEach((button) => {
    button.addEventListener("click", () => {
        container.innerHTML = "";
        resetSearchData();
        bookMenuListItems.forEach((item) => {
            item.classList.remove("books__menu-item_type_selected")
        });
        button.parentElement.classList.add("books__menu-item_type_selected")
        requestBooks(button.dataset.type).then((res) => {
            let booksInfo = res.items;
            if(booksInfo.length === 6) {
                loadMoreButton.style.display = "block";
            }
            console.log(booksInfo);
            renderTemplate(booksInfo);
            currentApiRequest = button.dataset.type;
            currentRequestIndex = booksInfo.length;
        })
    })
})

loadMoreButton.addEventListener("click", () => {
    console.log("before: ", currentRequestIndex)
    requestBooks(currentApiRequest, currentRequestIndex).then((res) => {
        console.log(currentRequestIndex)
        let booksInfo = res.items;
        console.log("More: ", booksInfo)
        if(booksInfo.length < 6) {
            loadMoreButton.style.display = "none";
        }
        renderTemplate(booksInfo);
        currentRequestIndex += booksInfo.length;
    })
})