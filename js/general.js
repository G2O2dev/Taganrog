document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

//region Feedback Form

let feedbackForm = document.getElementsByClassName('feedback-form')[0];

function openModal() {
    feedbackForm.style.display = "block";
    feedbackForm.animate([{opacity: '0'}, {opacity: '1'}], 300).addEventListener('finish', function () {
        feedbackForm.style.opacity = "1";
    });
}

function hideModal() {
    if (event.target !== event.currentTarget) return;
    feedbackForm.animate([{opacity: '1'}, {opacity: '0'}], 300).addEventListener('finish', function () {
        feedbackForm.style.opacity = "0";
        feedbackForm.style.display = "none";
    });
}

function updatePlaceholder() {
    let msg = document.getElementById("msg-txt");
    if (msg.textContent === "") {
        msg.classList.remove("hide-after");
    } else {
        msg.classList.add("hide-after");
    }
}

function redirectFocus() {
    document.getElementById("msg-txt").focus();
}

//endregion

const header = document.getElementById("header");
const headerBox = document.getElementById("header-box");
const headerUl = header.getElementsByTagName("ul")[0];
const burgerBtn = document.getElementById("burger");
const headerTexts = header.getElementsByTagName("a");

let isBurgerEnabled = false;
let isHeaderFloating = false;

window.addEventListener("scroll", () => updateScroll());

function updateScroll() {
    if (isHeaderFloating) {
        let headerBoxRect = headerBox.getBoundingClientRect();
        if ((showBurgerMediaQuery.matches && headerBoxRect.bottom >= 0) || (!showBurgerMediaQuery.matches && headerBoxRect.top >= 0)) {
            hideFloatingMenu();
        }
    } else {
        let headerRect = header.getBoundingClientRect();
        if ((showBurgerMediaQuery.matches && headerRect.bottom <= 0) || (!showBurgerMediaQuery.matches && headerRect.top <= 0)) {
            headerBox.style.height = headerRect.height + "px";
            showFloatingMenu();
        }
    }
}

function showFloatingMenu() {
    isHeaderFloating = true;
    header.style.transition = "";

    if (showBurgerMediaQuery.matches) {
        enableBurger();
        hideBurgerMenu();
    } else {
        header.style.borderWidth = "0 2px 2px 2px";
        header.style.borderRadius = "0 0 30px 30px";
    }

    header.style.position = "fixed";
    header.style.top = "0";
    header.style.zIndex = "15";
    header.style.bottom = "auto";
    header.style.borderColor = "rgba(255, 255, 255, 0.45)";

    header.style.background = "rgba(128, 128, 128, 0.4)";
    header.style.backdropFilter = "blur(6px)";
    for (let i = 0; i !== headerTexts.length; i++) {
        headerTexts[i].style.color = "#fff"
    }

    header.style.transition = "all .4s";
}
function hideFloatingMenu() {
    isHeaderFloating = false;

    if (showBurgerMediaQuery.matches) {
        disableBurger();
        hideBurgerMenu();
    }

    header.removeAttribute("style");
    headerBox.removeAttribute("style");

    for (let i = 0; i !== headerTexts.length; i++)
        headerTexts[i].removeAttribute("style")
}


burgerBtn.addEventListener("click", () => {
    if (burgerBtn.classList.contains("open")) {
        hideBurgerMenu();
    } else {
        showBurgerMenu();
    }
});

function enableBurger() {
    isBurgerEnabled = true;
    burgerBtn.style.display = "block";

    headerUl.style.flexWrap = "nowrap"
    headerUl.style.flexDirection = "column"

    header.style.height = "100%";
    header.style.width = "auto";

    header.style.padding = "60px 40px 0 0";
    header.style.borderRadius = "0 30px 30px 0";
    header.style.borderWidth = "0 2px 0 0";
}

function disableBurger() {
    isBurgerEnabled = false;
    header.style.transition = "none";

    burgerBtn.removeAttribute("style");
    headerUl.removeAttribute("style");

    header.style.transition = "all .4s";
}

function showBurgerMenu() {
    burgerBtn.classList.add("open");

    header.style.display = "block";
    header.style.left = "0";
}

function hideBurgerMenu() {
    burgerBtn.classList.remove("open");

    header.style.left = (-header.getBoundingClientRect().width).toString() + "px";
}


const showBurgerMediaQuery = window.matchMedia('(max-width: 944px)');
showBurgerMediaQuery.onchange = (e) => {
    if (isHeaderFloating) {
        header.removeAttribute("style");
        if(isBurgerEnabled) {
            disableBurger();
        }
        showFloatingMenu();
    }
};