    document.addEventListener('DOMContentLoaded', function () {
        const body = document.body;

        const header = document.getElementById('siteHeader');
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        const heroAssets = document.getElementById('heroAssets');
        const heroProductCard = document.getElementById('heroProductCard');
        const heroCanFallback = document.getElementById('heroCanFallback');
        const heroImage = document.getElementById('heroImage');
        const heroTitle = document.getElementById('heroTitle');
        const heroCategory = document.getElementById('heroCategory');
        const heroDescription = document.getElementById('heroDescription');
        const heroPrev = document.getElementById('heroPrev');
        const heroNext = document.getElementById('heroNext');
        const heroDots = document.getElementById('heroDots');

        const productTabs = document.querySelectorAll('.product-tab');
        const productPanels = document.querySelectorAll('.product-panel');

        const awardPrev = document.getElementById('awardPrev');
        const awardNext = document.getElementById('awardNext');
        const awardsTrack = document.getElementById('awardsTrack');

        const cookieBanner = document.getElementById('cookieBanner');
        const cookieAccept = document.getElementById('cookieAccept');
        const cookieReject = document.getElementById('cookieReject');

        const ageOverlay = document.getElementById('ageOverlay');
        const ageYes = document.getElementById('ageYes');
        const ageNo = document.getElementById('ageNo');

        const requestOverlay = document.getElementById('requestOverlay');
        const requestClose = document.getElementById('requestClose');
        const requestForm = document.getElementById('requestForm');
        const formSuccess = document.getElementById('formSuccess');
        const requestButtons = document.querySelectorAll('[data-open-request]');

        let lastScrollY = window.scrollY;
        let currentHeroSlide = 0;
        let heroTimer = null;

        const asset = {
            mango: heroAssets ? heroAssets.dataset.mango : '',
            mojito: heroAssets ? heroAssets.dataset.mojito : '',
            czech: heroAssets ? heroAssets.dataset.czech : '',
            bavarian: heroAssets ? heroAssets.dataset.bavarian : ''
        };

        const heroSlides = [
            {
                image: asset.mango,
                title: 'Манго / клубника',
                category: 'Nitro Fresh',
                label: 'NITRO',
                description: 'Сочное сочетание манго и клубники в ярком формате для главного промо-блока.'
            },
            {
                image: asset.mojito,
                title: 'Мохито',
                category: 'Nitro Fresh',
                label: 'MOJITO',
                description: 'Свежий вкус с цитрусовой нотой и выразительной зеленой палитрой.'
            },
            {
                image: asset.mango,
                title: 'Витрина напитков',
                category: 'Каталог',
                label: 'FRESH',
                description: 'Крупный промо-слайдер для вывода новинок, вкусов и сезонных предложений.'
            }
        ];

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

        function markHeroImageMissing(label) {
            if (heroProductCard) {
                heroProductCard.classList.add('is-image-missing');
            }

            if (heroCanFallback) {
                heroCanFallback.dataset.label = label || 'NITRO';
            }

            if (heroImage) {
                heroImage.classList.add('is-hidden');
            }
        }

        function markHeroImageLoaded() {
            if (heroProductCard) {
                heroProductCard.classList.remove('is-image-missing');
            }

            if (heroImage) {
                heroImage.classList.remove('is-hidden');
            }
        }

        function createHeroDots() {
            if (!heroDots) return;

            heroDots.innerHTML = '';

            heroSlides.forEach(function (_, index) {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.setAttribute('aria-label', 'Слайд ' + (index + 1));

                if (index === currentHeroSlide) {
                    dot.classList.add('active');
                }

                dot.addEventListener('click', function () {
                    setHeroSlide(index);
                    restartHeroTimer();
                });

                heroDots.appendChild(dot);
            });
        }

        function setHeroSlide(index) {
            if (!heroImage || !heroTitle || !heroCategory || !heroDescription) return;

            currentHeroSlide = (index + heroSlides.length) % heroSlides.length;
            const slide = heroSlides[currentHeroSlide];

            heroImage.style.opacity = '0';
            heroImage.style.transform = 'translateY(12px) rotate(-4deg)';

            window.setTimeout(function () {
                markHeroImageLoaded();

                if (heroCanFallback) {
                    heroCanFallback.dataset.label = slide.label;
                }

                heroImage.src = slide.image;
                heroImage.alt = slide.title;
                heroTitle.textContent = slide.title;
                heroCategory.textContent = slide.category;
                heroDescription.textContent = slide.description;

                heroImage.onload = function () {
                    markHeroImageLoaded();
                    heroImage.style.opacity = '1';
                    heroImage.style.transform = '';
                };

                heroImage.onerror = function () {
                    markHeroImageMissing(slide.label);
                    heroImage.style.opacity = '1';
                    heroImage.style.transform = '';
                };
            }, 170);

            if (heroDots) {
                heroDots.querySelectorAll('button').forEach(function (dot, dotIndex) {
                    dot.classList.toggle('active', dotIndex === currentHeroSlide);
                });
            }
        }

        function nextHeroSlide() {
            setHeroSlide(currentHeroSlide + 1);
        }

        function prevHeroSlide() {
            setHeroSlide(currentHeroSlide - 1);
        }

        function startHeroTimer() {
            heroTimer = window.setInterval(nextHeroSlide, 5600);
        }

        function restartHeroTimer() {
            if (heroTimer) {
                window.clearInterval(heroTimer);
            }

            startHeroTimer();
        }

        function initHero() {
            if (heroImage) {
                heroImage.addEventListener('error', function () {
                    const slide = heroSlides[currentHeroSlide];
                    markHeroImageMissing(slide ? slide.label : 'NITRO');
                });
            }

            createHeroDots();

            if (heroNext) {
                heroNext.addEventListener('click', function () {
                    nextHeroSlide();
                    restartHeroTimer();
                });
            }

            if (heroPrev) {
                heroPrev.addEventListener('click', function () {
                    prevHeroSlide();
                    restartHeroTimer();
                });
            }

            startHeroTimer();
        }

        function openProductTab(tabName) {
            productTabs.forEach(function (tab) {
                tab.classList.toggle('active', tab.dataset.tab === tabName);
            });

            productPanels.forEach(function (panel) {
                panel.classList.toggle('active', panel.dataset.panel === tabName);
            });
        }

        function initProductTabs() {
            productTabs.forEach(function (tab) {
                tab.addEventListener('click', function () {
                    openProductTab(tab.dataset.tab);
                });
            });

            document.querySelectorAll('[data-open-tab]').forEach(function (link) {
                link.addEventListener('click', function () {
                    const tabName = link.dataset.openTab;

                    window.setTimeout(function () {
                        openProductTab(tabName);
                    }, 80);
                });
            });
        }

        function initImageFallbacks() {
            document.querySelectorAll('.drink-card img').forEach(function (img) {
                const card = img.closest('.drink-card');

                img.addEventListener('error', function () {
                    if (!card) return;

                    img.classList.add('is-hidden');
                    card.classList.add('is-image-missing');

                    if (!card.dataset.fallback) {
                        card.dataset.fallback = 'NASEKOV';
                    }
                });

                img.addEventListener('load', function () {
                    if (!card) return;

                    img.classList.remove('is-hidden');
                    card.classList.remove('is-image-missing');
                });
            });
        }

        function initAwards() {
            if (!awardsTrack) return;

            if (awardNext) {
                awardNext.addEventListener('click', function () {
                    awardsTrack.scrollBy({
                        left: 320,
                        behavior: 'smooth'
                    });
                });
            }

            if (awardPrev) {
                awardPrev.addEventListener('click', function () {
                    awardsTrack.scrollBy({
                        left: -320,
                        behavior: 'smooth'
                    });
                });
            }
        }

        function showCookieBanner() {
            if (!cookieBanner) return;

            const cookieAnswer = localStorage.getItem('cookieAnswer');

            if (!cookieAnswer) {
                window.setTimeout(function () {
                    cookieBanner.classList.add('is-visible');
                }, 900);
            }
        }

        function closeCookieBanner(answer) {
            localStorage.setItem('cookieAnswer', answer);

            if (cookieBanner) {
                cookieBanner.classList.remove('is-visible');
            }
        }

        function initCookies() {
            showCookieBanner();

            if (cookieAccept) {
                cookieAccept.addEventListener('click', function () {
                    closeCookieBanner('accepted');
                });
            }

            if (cookieReject) {
                cookieReject.addEventListener('click', function () {
                    closeCookieBanner('rejected');
                });
            }
        }

        function initAgeGate() {
            if (!ageOverlay) return;

            const confirmed = localStorage.getItem('ageConfirmed');

            if (!confirmed) {
                ageOverlay.classList.add('is-visible');
                body.classList.add('no-scroll');
            }

            if (ageYes) {
                ageYes.addEventListener('click', function () {
                    localStorage.setItem('ageConfirmed', 'yes');
                    ageOverlay.classList.remove('is-visible');
                    body.classList.remove('no-scroll');
                });
            }

            if (ageNo) {
                ageNo.addEventListener('click', function () {
                    ageOverlay.querySelector('h2').textContent = 'Доступ ограничен';
                    ageOverlay.querySelector('p').textContent =
                        'Закрытые разделы 18+ недоступны без подтверждения возраста. Остальные информационные разделы сайта можно просматривать отдельно.';
                    ageYes.style.display = 'none';
                    ageNo.textContent = 'Понятно';
                    ageNo.addEventListener('click', function () {
                        ageOverlay.classList.remove('is-visible');
                        body.classList.remove('no-scroll');
                    }, { once: true });
                }, { once: true });
            }
        }

        function openRequestModal() {
            if (!requestOverlay) return;

            requestOverlay.classList.add('is-visible');
            body.classList.add('no-scroll');

            if (formSuccess) {
                formSuccess.classList.remove('is-visible');
            }
        }

        function closeRequestModal() {
            if (!requestOverlay) return;

            requestOverlay.classList.remove('is-visible');
            body.classList.remove('no-scroll');
        }

        function initRequestModal() {
            requestButtons.forEach(function (button) {
                button.addEventListener('click', openRequestModal);
            });

            if (requestClose) {
                requestClose.addEventListener('click', closeRequestModal);
            }

            if (requestOverlay) {
                requestOverlay.addEventListener('click', function (event) {
                    if (event.target === requestOverlay) {
                        closeRequestModal();
                    }
                });
            }

            if (requestForm) {
                requestForm.addEventListener('submit', function (event) {
                    event.preventDefault();

                    if (formSuccess) {
                        formSuccess.classList.add('is-visible');
                    }

                    requestForm.reset();
                });
            }

            document.addEventListener('keydown', function (event) {
                if (event.key === 'Escape') {
                    closeRequestModal();
                }
            });
        }

        function initRevealAnimation() {
            const revealItems = document.querySelectorAll(
                '.section-head, .ceo-grid, .map-card, .product-panel, .production-card, .award-card, .cta-card'
            );

            if (!('IntersectionObserver' in window)) {
                revealItems.forEach(function (item) {
                    item.classList.add('is-revealed');
                });
                return;
            }

            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.12
            });

            revealItems.forEach(function (item) {
                item.classList.add('reveal-item');
                observer.observe(item);
            });
        }

        initHeader();
        initHero();
        initProductTabs();
        initImageFallbacks();
        initAwards();
        initCookies();
        initAgeGate();
        initRequestModal();
        initRevealAnimation();
    });
