"use strict";

/* fade-in background */
const signInSection = document.querySelector('.sign-in');
signInSection.classList.add('sign-in_fade-in');


/* change background image aftre 8 hours */
const backgroundImageUrls = ['../img/flowers.jpg', '../img/lake.jpg', '../img/waterfall.jpg'];
const timeDiff = 1000 * 60 * 60 * 8; // ms * sec * min * hours

class App {
    constructor(urls, timeDiff, storageName, domElement) {
        this.urls = urls;
        this.timeDiff = timeDiff;
        this.currentTime = new Date().getTime();
        this.initTime = this.currentTime;
        this.nextIterationTime = this.initTime + this.timeDiff;
        this.storageName = storageName;
        this.domElement = document.querySelector(domElement);
        this.bgUrl = this.getRandomBgUrl(this.urls);
    }

    hasDataInStorage() {
        return !!localStorage.getItem(this.storageName);
    }

    getRandomBgUrl(urls) {
        return urls[Math.floor(Math.random() * urls.length)];
    }

    setDataToStorage() {
        localStorage.setItem(this.storageName, JSON.stringify({
            initTime: this.initTime,
            bgUrl: this.bgUrl
        }));
    }

    getDataFromStorage() {
        return JSON.parse(localStorage.getItem(this.storageName));
    }

    updateDataFromStorage() {
        const data = this.getDataFromStorage();
        this.initTime = data.initTime;
        this.bgUrl = data.bgUrl;
    }

    setBgImage() {
        this.domElement.style.backgroundImage = `url(${this.bgUrl})`;
    }

    findNewImage(oldUrl) {
        const updatedUrlsArray = this.urls.filter((url) => {
            return url !== oldUrl;
        });

        this.bgUrl = this.getRandomBgUrl(updatedUrlsArray);
    }

    init() {
        if (this.hasDataInStorage()) {
            this.updateDataFromStorage();
            this.setBgImage();
        } else {
            this.setDataToStorage();
            this.setBgImage();
            return;
        }

        if ((this.currentTime - this.initTime) > this.timeDiff) {
            this.initTime += Math.floor((this.currentTime - this.initTime) / this.timeDiff) * this.timeDiff;
            this.findNewImage(this.bgUrl);
            this.setBgImage();
            this.setDataToStorage();
        }
    }

}

const updateBgImage = new App(backgroundImageUrls, timeDiff, 'bgUpdateSettings', '.sign-in__bg-wrapper');
updateBgImage.init();