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

function initMap(e) {
    const map = document.getElementById("ymap");
    if (map.getBoundingClientRect().top < window.innerHeight) {
        window.removeEventListener("scroll", initMap);

        let script = document.createElement("script");
        script.setAttribute("src", "https://api-maps.yandex.ru/2.1/?apikey=-&lang=ru_RU");
        document.body.appendChild(script);

        script.addEventListener("load", () => {
            ymaps.ready(() => {
                let map = new ymaps.Map('ymap', {
                    center: [47.208735, 38.936694],
                    zoom: 13.3
                });

                map.controls.remove('geolocationControl');
                map.controls.remove('searchControl');
                map.controls.remove('trafficControl');
                map.controls.remove('typeSelector');
                map.controls.remove('zoomControl');
                map.controls.remove('rulerControl');

                let places = document.getElementsByClassName("place");
                let cluster = new ymaps.Clusterer();
                for (let i = 0; i < places.length; i++) {
                    let cords = [parseFloat(places[i].getAttribute("data-coordinates-x")), parseFloat(places[i].getAttribute("data-coordinates-y"))];
                    let placemark = new ymaps.Placemark(cords, {
                        iconCaption: places[i].getElementsByClassName("place__header")[0].innerHTML,
                    }, {});
                    cluster.add(placemark);

                    places[i].addEventListener('click', () => {
                        map.panTo(cords);
                        setTimeout(function () {
                            map.setCenter(cords);
                            map.setZoom(16, {smooth: true, duration: 300});
                        }, 630);
                    });

                    placemark.events.add('click', function (e) {
                        map.panTo(cords);
                        setTimeout(function () {
                            map.setCenter(cords);
                            map.setZoom(16, {smooth: true, duration: 300});
                        }, 630);
                    });
                }
                map.geoObjects.add(cluster);
            });
        });
    }
}

loadAboutSlider();
runTimeUpdater();
runWeatherUpdater();
loadFeedbackSlider();
window.addEventListener("scroll", initMap);

