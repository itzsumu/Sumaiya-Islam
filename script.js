
/* =========================
   AOS ANIMATION
========================= */

if (typeof AOS !== "undefined") {
    AOS.init({
        duration: 800,
        once: true,
        offset: 80
    });
}


/* =========================
   DARK / LIGHT MODE
========================= */

const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem("portfolio-theme") || "light";

body.setAttribute("data-theme", savedTheme);

function updateThemeButton() {
    const currentTheme = body.getAttribute("data-theme");

    if (currentTheme === "dark") {
        themeToggle.textContent = "☀️ Light";
        themeToggle.setAttribute("aria-label", "Switch to light mode");
    } else {
        themeToggle.textContent = "🌙 Dark";
        themeToggle.setAttribute("aria-label", "Switch to dark mode");
    }
}

if (themeToggle) {
    updateThemeButton();

    themeToggle.addEventListener("click", () => {
        const currentTheme = body.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        body.setAttribute("data-theme", newTheme);
        localStorage.setItem("portfolio-theme", newTheme);

        updateThemeButton();
    });
}


/* =========================
   REUSABLE CAROUSEL FUNCTION
========================= */

function createCarousel(options) {
    const track = document.getElementById(options.trackId);
    const prevButton = document.getElementById(options.prevId);
    const nextButton = document.getElementById(options.nextId);
    const dotsContainer = document.getElementById(options.dotsId);
    const carousel = document.querySelector(options.carouselSelector);

    if (!track || !prevButton || !nextButton || !dotsContainer) {
        console.warn("Carousel elements not found:", options.trackId);
        return;
    }

    const slides = Array.from(track.children);

    if (slides.length === 0) return;

    let currentIndex = 0;
    let maxIndex = 0;
    let autoSlide = null;
    let resizeTimer = null;

    function getVisibleCount() {
        return options.getVisibleCount();
    }

    function calculateMaxIndex() {
        return Math.max(0, slides.length - getVisibleCount());
    }

    function showSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));

        const firstSlide = slides[0];
        const currentSlide = slides[currentIndex];

        const distance = currentSlide.offsetLeft - firstSlide.offsetLeft;

        track.style.transform = `translateX(-${distance}px)`;

        const dots = dotsContainer.querySelectorAll("button");

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });
    }

    function createDots() {
        dotsContainer.innerHTML = "";

        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement("button");

            dot.type = "button";
            dot.className = options.dotClass;
            dot.setAttribute("aria-label", `Go to slide ${i + 1}`);

            dot.addEventListener("click", () => {
                showSlide(i);
                restartAutoSlide();
            });

            dotsContainer.appendChild(dot);
        }
    }

    function updateCarousel() {
        maxIndex = calculateMaxIndex();
        currentIndex = Math.min(currentIndex, maxIndex);

        createDots();

        const showControls = maxIndex > 0;

        prevButton.hidden = !showControls;
        nextButton.hidden = !showControls;
        dotsContainer.hidden = !showControls;

        showSlide(currentIndex);
    }

    function nextSlide() {
        showSlide(currentIndex >= maxIndex ? 0 : currentIndex + 1);
    }

    function previousSlide() {
        showSlide(currentIndex <= 0 ? maxIndex : currentIndex - 1);
    }

    function startAutoSlide() {
        clearInterval(autoSlide);

        if (maxIndex > 0) {
            autoSlide = setInterval(nextSlide, options.interval);
        }
    }

    function stopAutoSlide() {
        clearInterval(autoSlide);
    }

    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    nextButton.addEventListener("click", () => {
        nextSlide();
        restartAutoSlide();
    });

    prevButton.addEventListener("click", () => {
        previousSlide();
        restartAutoSlide();
    });

    if (carousel) {
        carousel.addEventListener("mouseenter", stopAutoSlide);
        carousel.addEventListener("mouseleave", startAutoSlide);
    }

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
            updateCarousel();
            restartAutoSlide();
        }, 200);
    });

    // Initial setup
    updateCarousel();
    startAutoSlide();
}


/* =========================
   PROJECTS CAROUSEL
========================= */

createCarousel({
    trackId: "projectsTrack",
    prevId: "prevProject",
    nextId: "nextProject",
    dotsId: "projectDots",
    dotClass: "project-dot",
    carouselSelector: ".project-carousel",
    interval: 4500,

    getVisibleCount: function () {
        if (window.innerWidth <= 600) return 1;
        if (window.innerWidth <= 900) return 2;
        return 3;
    }
});


/* =========================
   CERTIFICATES CAROUSEL
========================= */

createCarousel({
    trackId: "certificateTrack",
    prevId: "prevCertificate",
    nextId: "nextCertificate",
    dotsId: "certificateDots",
    dotClass: "certificate-dot",
    carouselSelector: ".certificate-carousel",
    interval: 3500,

    getVisibleCount: function () {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        return 3;
    }
});
