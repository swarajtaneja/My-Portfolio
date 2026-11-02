/* =========================
   SWARAJ PORTFOLIO — JS
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  // Delayed, minimum-duration intro so the progress animation is visible.
  const pageLoader = document.getElementById("pageLoader");
  const loaderBar = document.getElementById("loaderBar");
  const loaderPercent = document.getElementById("loaderPercent");
  const loaderStartedAt = Date.now();
  const MIN_LOADER_TIME = 650;
  let displayedProgress = 0;
  let loaderTimer = null;
  let pageLoaded = document.readyState === "complete";

  const setLoaderProgress = value => {
    displayedProgress = Math.max(displayedProgress, Math.min(100, value));
    if (loaderBar) loaderBar.style.width = `${displayedProgress}%`;
    if (loaderPercent) loaderPercent.textContent = `${Math.round(displayedProgress)}%`;
  };

  if (pageLoader) {
    // Start immediately and advance quickly without holding the page unnecessarily.
    loaderTimer = window.setInterval(() => {
      if (displayedProgress < 92) {
        setLoaderProgress(displayedProgress + Math.max(2.5, (92 - displayedProgress) * 0.18));
      }
    }, 30);

    const finishWhenReady = () => {
      if (!pageLoaded) return;
      const remaining = Math.max(0, MIN_LOADER_TIME - (Date.now() - loaderStartedAt));
      window.setTimeout(() => {
        if (loaderTimer) window.clearInterval(loaderTimer);
        setLoaderProgress(100);
        window.setTimeout(() => pageLoader.classList.add("is-done"), 100);
        window.setTimeout(() => pageLoader.remove(), 500);
      }, remaining);
    };

    if (!pageLoaded) {
      window.addEventListener("load", () => { pageLoaded = true; finishWhenReady(); }, { once: true });
    } else {
      finishWhenReady();
    }
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });

    document.addEventListener("click", event => {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const progress = document.getElementById("progress");
  let progressFrame = 0;
  const updateProgress = () => {
    progressFrame = 0;
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progress.style.transform = `scaleX(${fraction})`;
  };
  const scheduleProgress = () => {
    if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
  };
  updateProgress();
  window.addEventListener("scroll", scheduleProgress, { passive: true });
  window.addEventListener("resize", scheduleProgress, { passive: true });

  const revealItems = document.querySelectorAll(
    ".hero-text, .hero-art, .section-title, .about-copy, .skill, .education-card, .project, .social-list, .contact-inner"
  );
  revealItems.forEach(item => item.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }
});
