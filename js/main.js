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
    let map = new ymaps.Map('ymap', {
        center: [47.208735, 38.936694],
        zoom: 13
    });

    map.controls.remove('geolocationControl'); // удаляем геолокацию
    map.controls.remove('searchControl'); // удаляем поиск
    map.controls.remove('trafficControl'); // удаляем контроль трафика
    map.controls.remove('typeSelector'); // удаляем тип
    map.controls.remove('zoomControl'); // удаляем контрол зуммирования
    map.controls.remove('rulerControl'); // удаляем контрол правил
}

loadAboutSlider();
runTimeUpdater();
runWeatherUpdater();
loadFeedbackSlider();
ymaps.ready(initMap);


