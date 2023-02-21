function loadFeedbackSlider() {
    let feedbackSlider;
    const mediaQuery = window.matchMedia('(max-width: 650px)');
    mediaQuery.onchange = (e) => mediaChanged();

    mediaChanged();

    function mediaChanged() {
        try {
            feedbackSlider.destroy();
        } catch {
        }
        if (mediaQuery.matches) {
            feedbackSlider = new Swiper('.feedback-swiper', {
                grabCursor: true,
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.feedback-swiper__pagination',
                    clickable: true
                },
            });
        } else {
            feedbackSlider = new Swiper('.feedback-swiper', {
                effect: "cards",
                grabCursor: true,
                loop: true,
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                }
            });
        }
    }
}

function loadAboutSlider() {
    let aboutSwiper = new Swiper('.about-swiper', {
        loop: true,
        lazy: true,
        pagination: {
            el: '.about-swiper__pagination',
            clickable: true
        },
    });

    let sliderLight = document.getElementsByClassName("about-swiper__light")[0];
    aboutSwiper.on('slideChange', function () {
        let activeSlider = aboutSwiper.slides[aboutSwiper.activeIndex];
        sliderLight.animate([
            {opacity: '1'},
            {opacity: '0'}
        ], 300).addEventListener('finish', function () {
            sliderLight.src = activeSlider.src;
            sliderLight.animate([
                {opacity: '0'},
                {opacity: '1'}
            ], 300)
        });
    });
}

function runTimeUpdater() {
    function getDateByUTC(offset) {
        let d = new Date();
        return new Date(d.getTime() + (d.getTimezoneOffset() * 60000) + (3600000 * offset));
    }

    function timeUpdate() {
        let newTime = getDateByUTC(3);
        document.getElementById("informer-time").innerText = `${newTime.getHours()}:${newTime.getMinutes()} `
        setTimeout(timeUpdate, 60000);
    }

    timeUpdate();
}

function runWeatherUpdater() {
    function weatherUpdate() {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=Taganrog&units=metric&lang=ru&appid=dd7e2ad6faaa5809a4a3d5bf27273de8")
            .then((response) => response.json()).then((data) => {
            const {description} = data.weather[0];
            const {temp} = data.main;
            document.getElementById("informer-weather").innerText = `${Math.round(temp)}, ${description}`
        });
        setTimeout(weatherUpdate, 180000);
    }

    weatherUpdate();
}

function initMap() {
    let scriptEle = document.createElement("script");

    scriptEle.setAttribute("src", "https://api-maps.yandex.ru/2.1/?apikey=-&lang=ru_RU");
    scriptEle.setAttribute("async", true);

    document.body.appendChild(scriptEle);

    // success event
    scriptEle.addEventListener("load", () => {
        ymaps.ready(() => {
            let map = new ymaps.Map('ymap', {
                center: [47.208735, 38.936694],
                zoom: 13
            });

            map.controls.remove('geolocationControl');
            map.controls.remove('searchControl');
            map.controls.remove('trafficControl');
            map.controls.remove('typeSelector');
            map.controls.remove('zoomControl');
            map.controls.remove('rulerControl');
        });
    });
}

function loadHrefSmoothScroll() {
    function scrollIt(destination, duration = 1600, callback) {
        const start = window.pageYOffset;
        const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

        const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
        const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
        const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset) + 700;

        if ('requestAnimationFrame' in window === false) {
            window.scroll(0, destinationOffsetToScroll);
            if (callback) {
                callback();
            }
            return;
        }

        function scroll() {
            const now = 'now' in window.performance ? performance.now() : new Date().getTime();
            const t = Math.min(1, ((now - startTime) / duration));
            const timeFunction = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

            if (window.pageYOffset === destinationOffsetToScroll) {
                if (callback) {
                    callback();
                }
                return;
            }

            requestAnimationFrame(scroll);
        }

        scroll();
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (el) {
        el.addEventListener("click", function () {
            scrollIt(document.querySelector(this.getAttribute('href')));
        });
    });
}

loadAboutSlider();
runTimeUpdater();
runWeatherUpdater();
loadFeedbackSlider();
loadHrefSmoothScroll();


let mapLoaded = false;
let map = document.getElementById("ymap");
window.addEventListener("scroll", () => {
    if (!mapLoaded && map.getBoundingClientRect().top < window.innerHeight) {
        mapLoaded = true;
        initMap();
    }
});

let feedbackForm = document.getElementsByClassName('feedback-form')[0];
function openModal() {
    feedbackForm.style.display = "block";
    feedbackForm.animate([{opacity: '0'}, {opacity: '1'}], 300).addEventListener('finish', function () {
        feedbackForm.style.opacity = "1";
    });
}

function hideModal() {
    if(event.target !== event.currentTarget) return;
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

