import { banners } from '../utils/constants.js';

const bannerNavigationButtons = document.querySelectorAll(".banner__radio-button");
const bannerImage = document.querySelector(".banner__image");
let currentIndex = 0;
let renderTimer = 5000;
let indervalId = setInterval(renderIntervalBanner, renderTimer);


function renderBanner(array, newIndex) {
    bannerNavigationButtons[currentIndex].classList.remove("banner__radio-button_type_selected");
    bannerImage.src = array[newIndex].src;
    bannerImage.alt = array[newIndex].alt;
    bannerNavigationButtons[newIndex].classList.add("banner__radio-button_type_selected");
    currentIndex = newIndex;
}

function renderIntervalBanner() {
    if (currentIndex === banners.length - 1) {
        renderBanner(banners, 0);
    } else {
        renderBanner(banners, currentIndex + 1);
    }
}

renderBanner(banners, currentIndex);

bannerNavigationButtons.forEach((button) => {
    button.addEventListener("click", () => {
        clearInterval(indervalId);
        renderBanner(banners, Number(button.dataset.index));
        indervalId = setInterval(renderIntervalBanner, renderTimer);
    });
});