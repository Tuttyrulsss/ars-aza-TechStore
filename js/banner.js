document.addEventListener('DOMContentLoaded', () => {
    // Баннер
    const bannerSlides = document.querySelectorAll('.banner-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentIndex = 0;

    function showSlide(index) {
        bannerSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % bannerSlides.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + bannerSlides.length) % bannerSlides.length;
        showSlide(currentIndex);
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    setInterval(nextSlide, 5000); // Автопереход каждые 5 секунд
    showSlide(currentIndex);

    // Кнопка каталога
    const catalogBtn = document.getElementById('catalogBtn');
    const catalogMenu = document.getElementById('catalogMenu');

    catalogBtn.addEventListener('click', () => {
        catalogMenu.classList.toggle('active');
    });
});
