(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  class ScrollReveal {
    static observer = null;

    static getObserver() {
      if (this.observer) return this.observer;

      this.observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -8% 0px",
        },
      );

      return this.observer;
    }

    constructor(element, { delay = 0, duration = 0.8, distance = 32 } = {}) {
      if (!element || element.dataset.revealReady === "true") return;

      element.dataset.reveal = "";
      element.dataset.revealReady = "true";
      element.style.setProperty("--reveal-delay", `${delay * 1000}ms`);
      element.style.setProperty("--reveal-duration", `${duration * 1000}ms`);
      element.style.setProperty("--reveal-distance", `${distance}px`);

      if (reducedMotion.matches) {
        element.classList.add("is-revealed");
        return;
      }

      ScrollReveal.getObserver().observe(element);
    }

    static add(selector, options) {
      document.querySelectorAll(selector).forEach((element) => {
        new ScrollReveal(element, options);
      });
    }

    static sequence(selector, { delay = 0, step = 0.08, ...options } = {}) {
      document.querySelectorAll(selector).forEach((element, index) => {
        new ScrollReveal(element, {
          ...options,
          delay: delay + index * step,
        });
      });
    }
  }

  const setupSectionReveals = () => {
    document.documentElement.classList.add("reveal-enabled");

    ScrollReveal.add(".hero-title", { delay: 0, duration: 0.9, distance: 48 });
    ScrollReveal.add(".hero .intro", { delay: 0.1, distance: 28 });

    ScrollReveal.add(".who-is-section .section-heading", { distance: 28 });
    ScrollReveal.add(".who-is-description", { delay: 0.08, distance: 28 });
    ScrollReveal.add(".who-is-poster", { delay: 0.16, duration: 0.9, distance: 48 });

    ScrollReveal.add(".works-section .section-heading", { distance: 28 });
    ScrollReveal.sequence(".works-card", {
      delay: 0.08,
      step: 0.07,
      duration: 0.85,
      distance: 44,
    });

    ScrollReveal.add(".spotlight-text", { distance: 28 });
    ScrollReveal.add(".reveal-art", { delay: 0.1, duration: 0.9, distance: 48 });

    ScrollReveal.add(".portfolio-section .section-heading", { distance: 28 });
    ScrollReveal.sequence(".portfolio-tile", {
      delay: 0.08,
      step: 0.07,
      duration: 0.85,
      distance: 48,
    });

    ScrollReveal.add(".request-title", { distance: 28 });
    ScrollReveal.add(".request-description", { delay: 0.08, distance: 28 });
    ScrollReveal.add(".request-form", { delay: 0.16, duration: 0.85, distance: 40 });
    ScrollReveal.add(".request-cube", { delay: 0.22, duration: 0.9, distance: 48 });
    ScrollReveal.add(".request-actions", { delay: 0.28, distance: 28 });

    ScrollReveal.sequence(".site-footer__column", {
      step: 0.07,
      distance: 28,
    });
    ScrollReveal.add(".dot-scatter", { delay: 0.18, duration: 0.9, distance: 48 });
  };

  window.ScrollReveal = ScrollReveal;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupSectionReveals, { once: true });
  } else {
    setupSectionReveals();
  }
})();
