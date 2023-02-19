let aboutSwiper = new Swiper('.swiper', {
    loop: true,
    lazy: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
});

let sliderLight = document.getElementsByClassName("slider-light")[0];
sliderLight.src = aboutSwiper.slides[aboutSwiper.activeIndex].src;
aboutSwiper.on('slideChange', function () {
    sliderLight.animate([
        {opacity: '1'},
        {opacity: '0'}
    ], 300).addEventListener('finish', function () {
        sliderLight.src = aboutSwiper.slides[aboutSwiper.activeIndex].src;
        sliderLight.animate([
            {opacity: '0'},
            {opacity: '1'}
        ], 300)
    });
});