const cartItemsCount = document.querySelector(".header__items-count");
let boughtBooks = localStorage.getItem("boughtBooks")?JSON.parse(localStorage.getItem("boughtBooks")):[];

renderCart();

function renderCart() {
    if (boughtBooks.length > 0) {
        cartItemsCount.textContent = boughtBooks.length;
        cartItemsCount.style.display = "block";
    } else {
        cartItemsCount.style.display = "none";
    }
}

export function addItemToCart(bookId) {
    if(!boughtBooks.includes(bookId)) {
    boughtBooks.push(bookId);
    localStorage.setItem('boughtBooks', JSON.stringify(boughtBooks));
    renderCart();
    }
}

export function removeItemFromCart(bookId) {
    if(boughtBooks.includes(bookId)) {
    let boughtBookIndex = boughtBooks.indexOf(bookId);
    boughtBooks = boughtBooks.toSpliced(boughtBookIndex, 1);
    localStorage.setItem('boughtBooks', JSON.stringify(boughtBooks));
    renderCart();
    }
}

export function isBookInCart(bookId){
    return boughtBooks.includes(bookId);
}