import { addItemToCart, removeItemFromCart, isBookInCart } from './cart.js';

export const container = document.querySelector(".books__cards");

function fillRatingStars(book, ratingStars, reviewContainer) {
    if (book.volumeInfo.averageRating) {
        let ratingNumber = Number(book.volumeInfo.averageRating);
        for (let i = 0; i <= 4; i++) {
            if (ratingNumber >= i) {
                ratingStars[i].querySelector("#starFill").setAttribute("offset", "100%");
            } else {
                let x = (i - ratingNumber) * 100;
                ratingStars[i].querySelector("#starFill").setAttribute("offset", `${x}%`);
                break;
            }
        }
    } else {
        reviewContainer.style.visibility = "hidden";
    }
}

function toggleBookInCart(book, button) {
    if(isBookInCart(book.id)) {
        removeItemFromCart(book.id);
        button.classList.remove("book__buy-button_type_pressed");
        button.textContent = "buy now";
    } else {
        addItemToCart(book.id);
        button.classList.add("book__buy-button_type_pressed");
        button.textContent = "in the cart";
    }
}

export function renderTemplate(booksInfo) {

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
            colorPath.setAttribute("fill", `url(#${book.id}${[i]})`);
        }

        if (book.volumeInfo.imageLinks) {
            bookImg.src = book.volumeInfo.imageLinks.thumbnail;
        } else {
            bookImg.src = "./src/images/book_default.png";
        }

        bookAuthor.textContent = book.volumeInfo.authors.join(", ");

        bookName.textContent = book.volumeInfo.title;
        if (book.volumeInfo.ratingsCount) {
            bookReviewCount.textContent = `${book.volumeInfo.ratingsCount} review(s)`;
        } else {
            bookReviewCount.textContent = "";
        }

        fillRatingStars(book, ratingStars, reviewContainer);

        bookDescription.textContent = book.volumeInfo.description;

        if(book.saleInfo.retailPrice) {
            saleInfo.textContent = book.saleInfo.retailPrice;
        } else {
            saleInfo.style.visibility = "hidden";
        }

        buyButton.addEventListener('click', () => {

            toggleBookInCart(book, buyButton);
            
        });

        if(isBookInCart(book.id)) {
            buyButton.classList.add("book__buy-button_type_pressed");
            buyButton.textContent = "in the cart";
        }


        container.append(card);
    });
}