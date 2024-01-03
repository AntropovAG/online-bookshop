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

bannerImage.src = banners[0].src;
bannerImage.alt = banners[0].alt;