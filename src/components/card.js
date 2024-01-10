function fillRatingStars(book, ratingStars, reviewContainer) {
    if (book.volumeInfo.averageRating) {
        console.log("rating: ", book.volumeInfo.averageRating);
        let ratingNumber = Number(book.volumeInfo.averageRating)
        for (let i = 0; i <= 4; i++) {
            if (ratingNumber >= i) {
                console.log("rating: ", ratingNumber, "i: ", i)
                ratingStars[i].querySelector("#starFill").setAttribute("offset", "100%");
                console.log("set full for: ", [i])
            } else {
                console.log("set custom for :", [i])
                let x = (i - ratingNumber) * 100;
                ratingStars[i].querySelector("#starFill").setAttribute("offset", `${x}%`);
                break
            }
        }
    } else {
        reviewContainer.style.visibility = "hidden"
    }
}

export function renderTemplate(booksInfo) {

    booksInfo.forEach((book) => {
        let card = document.querySelector("#card__template").content.querySelector(".book__card").cloneNode(true);
        let bookImg = card.querySelector(".book__img");
        let bookAuthor = card.querySelector(".book__author");
        let bookName = card.querySelector(".book__name");
        let bookReviewCount = card.querySelector(".book__review-count");
        let ratingStars = card.querySelectorAll(".book__review-star");
        let reviewContainer = card.querySelector(".book__review-container")

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

        bookAuthor.textContent = book.volumeInfo.authors;

        bookName.textContent = book.volumeInfo.title;
        if (book.volumeInfo.ratingsCount) {
            bookReviewCount.textContent = `${book.volumeInfo.ratingsCount} review(s)`
        } else {
            bookReviewCount.textContent = ""
        }

        fillRatingStars(book, ratingStars, reviewContainer)

        container.prepend(card);
    })
}