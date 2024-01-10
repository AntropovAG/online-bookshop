// export const banners = [
//     {
//         "src": "./src/images/banner_01.png",
//         "alt": "first banner"
//     },
//     {
//         "src": "./src/images/banner_02.png",
//         "alt": "second banner"
//     },
//     {
//         "src": "./src/images/banner_03.png",
//         "alt": "third banner"
//     }
// ];

// export let currentIndex = 0;
// export let renderTimer = 5000;
// export const bannerImage = document.querySelector(".banner__image");
// export const bannerNavigationButtons = document.querySelectorAll(".banner__radio-button");
// export function renderIntervalBanner() {
//     if (currentIndex === banners.length - 1) {
//         renderBanner(banners, 0);
//     } else {
//         renderBanner(banners, currentIndex + 1);
//     }
// }

// export let indervalId = setInterval(renderIntervalBanner, renderTimer);

// export function renderBanner(array, newIndex) {
//     bannerNavigationButtons[currentIndex].classList.remove("banner__radio-button_type_selected")
//     bannerImage.src = array[newIndex].src;
//     bannerImage.alt = array[newIndex].alt;
//     bannerNavigationButtons[newIndex].classList.add("banner__radio-button_type_selected");
//     currentIndex = newIndex
// }