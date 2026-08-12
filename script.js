document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const whatsappFloat = document.querySelector(".whatsapp-float");
const menuLinks = menu ? [...menu.querySelectorAll("a")] : [];

function closeMenu({ returnFocus = false } = {}) {
  if (!menu || !menuToggle) return;
  menu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  document.body.classList.remove("menu-open");
  if (returnFocus) menuToggle.focus();
}

function openMenu() {
  if (!menu || !menuToggle) return;
  menu.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Fechar menu");
  document.body.classList.add("menu-open");
  menuLinks[0]?.focus();
}

menuToggle?.addEventListener("click", () => menuToggle.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu());
menuLinks.forEach((link) => link.addEventListener("click", () => closeMenu()));
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") closeMenu({ returnFocus: true }); });
window.addEventListener("resize", () => { if (window.innerWidth > 920) closeMenu(); });

function updateChrome() {
  header?.classList.toggle("scrolled", window.scrollY > 10);
  whatsappFloat?.classList.toggle("is-visible", window.scrollY > 520);
}
updateChrome();
window.addEventListener("scroll", updateChrome, { passive: true });

document.querySelectorAll("[data-year]").forEach((element) => { element.textContent = String(new Date().getFullYear()); });

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");
if (reducedMotion || !("IntersectionObserver" in window)) revealItems.forEach((item) => item.classList.add("is-visible"));
else {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8%", threshold: .08 });
  revealItems.forEach((item) => observer.observe(item));
}
