/* header.js — шапка сайта "Абдыш-Ата" */
/* Логика для site_header.html: скрытие при скролле + бургер-меню */

document.addEventListener('DOMContentLoaded', function () {
    const header = document.getElementById('siteHeader');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    let lastScrollY = window.scrollY;

    function initHeader() {
        if (!header) return;

        window.addEventListener('scroll', function () {
            const currentScroll = window.scrollY;

            if (currentScroll > 180 && currentScroll > lastScrollY) {
                header.classList.add('is-hidden');
            } else {
                header.classList.remove('is-hidden');
            }

            lastScrollY = currentScroll;
        });

        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', function () {
                menuToggle.classList.toggle('is-active');
                mobileMenu.classList.toggle('is-open');
            });

            mobileMenu.querySelectorAll('a, button').forEach(function (item) {
                item.addEventListener('click', function () {
                    menuToggle.classList.remove('is-active');
                    mobileMenu.classList.remove('is-open');
                });
            });
        }
    }

    initHeader();
});
