import { requestBooks } from './src/API/API.js';
import './src/components/banner.js'

const container = document.querySelector(".books__cards")
const loadMoreButton = document.querySelector(".book__more-button");
const bookMenuButtons = document.querySelectorAll(".books__menu-button");
const bookMenuListItems = document.querySelectorAll(".books__menu-item");
const firstBookMenuButton = document.querySelector(".books__menu-button");
const cartItemsCount = document.querySelector(".header__items-count");


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

function removeBookFromArray(array, id) {
    let boughtBookIndex = array.indexOf(id);
    array.splice(boughtBookIndex, 1);
    return array;
}

function updateBooksInCart(book, button) {
    if(boughtBooks.includes(book.id)) {
        removeBookFromArray(boughtBooks, book.id)
        localStorage.setItem('boughtBooks', JSON.stringify(boughtBooks));
        console.log("book deleted", boughtBooks)
        removeItemFromCart();
        button.classList.remove("book__buy-button_type_pressed");
        button.textContent = "buy now";
    } else {
        boughtBooks.push(book.id)
        localStorage.setItem('boughtBooks', JSON.stringify(boughtBooks));
        addItemToCart();
        button.classList.add("book__buy-button_type_pressed");
        button.textContent = "in the cart";
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
            saleInfo.textContent = book.saleInfo.retailPrice;
        } else {
            saleInfo.style.visibility = "hidden";
        }

        // function removeBookFromArray(array, id) {
        //     let boughtBookIndex = array.indexOf(id);
        //     array.splice(boughtBookIndex, 1);
        //     return array;
        // }

        buyButton.addEventListener('click', () => {

            updateBooksInCart(book, buyButton)
            // if(boughtBooks.includes(book.id)) {
            //     removeBookFromArray(boughtBooks, book.id)
            //     localStorage.setItem('boughtBooks', JSON.stringify(boughtBooks));
            //     console.log("book deleted", boughtBooks)
            //     removeItemFromCart();
            //     buyButton.classList.remove("book__buy-button_type_pressed");
            //     buyButton.textContent = "buy now";
            // } else {
            //     boughtBooks.push(book.id)
            //     localStorage.setItem('boughtBooks', JSON.stringify(boughtBooks));
            //     addItemToCart();
            //     buyButton.classList.add("book__buy-button_type_pressed");
            //     buyButton.textContent = "in the cart";
            // }

            
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