const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const gsapSectionSelector = "#process, #about, #projects, #contact";
const revealItems = Array.from(
  document.querySelectorAll(".content-card, .contact-form")
).filter((item) => !item.closest(gsapSectionSelector));
const scrubItems = Array.from(document.querySelectorAll(".section-heading")).filter(
  (item) => !item.closest(gsapSectionSelector)
);

revealItems.forEach((item, index) => {
  item.classList.add("reveal");
  item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
});

if (!reducedMotion.matches) {
  let frame = 0;

  const updateScrub = () => {
    frame = 0;
    const viewportHeight = window.innerHeight;

    scrubItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const start = Number(item.dataset.scrubStart ?? 0.9) * viewportHeight;
      const end = Number(item.dataset.scrubEnd ?? 0.35) * viewportHeight;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      const lift = (1 - progress) * 20;

      item.style.opacity = String(0.55 + progress * 0.45);
      item.style.transform = `translate3d(0, ${lift}px, 0)`;
    });
  };

  const requestScrubUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(updateScrub);
  };

  window.addEventListener("scroll", requestScrubUpdate, { passive: true });
  window.addEventListener("resize", requestScrubUpdate);
  updateScrub();
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

