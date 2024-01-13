



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