// Anime.js 4.5.0 (MIT), mantido localmente em assets/vendor.
// Movimentos pontuais: a leitura e a navegação continuam completas sem animação.
import { animate, stagger } from "./assets/vendor/anime.esm.min.js";

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const canAnimate = () => !motionPreference.matches;
let wordAnimation;

window.addEventListener("mapa:story-change", (event) => {
  if (!canAnimate()) return;
  const word = document.querySelector("[data-story-word]");
  const lead = document.querySelector("[data-story-lead]");
  if (word) {
    wordAnimation?.cancel();
    wordAnimation = animate(word, {
      opacity: [0.35, event.detail.step === 0 ? 0.85 : 1],
      y: [18, 0],
      scale: [0.96, 1],
      rotate: ["-1.5deg", "0deg"],
      duration: 650,
      ease: "outExpo"
    });
  }
  if (lead) animate(lead, { opacity: [0.45, 1], duration: 520, ease: "outCubic" });
});

window.addEventListener("mapa:project-change", () => {
  if (!canAnimate()) return;
  const details = document.querySelectorAll("[data-project-category], [data-project-title], [data-project-summary]");
  animate(details, {
    opacity: [0, 1],
    y: [16, 0],
    delay: stagger(65),
    duration: 580,
    ease: "outExpo"
  });
  animate("[data-project-current]", { opacity: [0.3, 1], scale: [0.82, 1], duration: 500, ease: "outExpo" });
});

window.addEventListener("mapa:case-open", () => {
  if (!canAnimate()) return;
  animate(".case-hero > p, .case-hero > h2, .case-hero > a", {
    opacity: [0, 1],
    y: [24, 0],
    delay: stagger(80),
    duration: 650,
    ease: "outExpo"
  });
});

if ("IntersectionObserver" in window) {
  const serviceObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (!canAnimate()) return;
      const details = entry.target.querySelectorAll(":scope > p, :scope > h3, li");
      animate(details, {
        opacity: [0, 1],
        y: [20, 0],
        delay: stagger(60),
        duration: 620,
        ease: "outExpo"
      });
    });
  }, { threshold: 0.3 });
  document.querySelectorAll(".depth-card").forEach((card) => serviceObserver.observe(card));
}
