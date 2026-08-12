const root = document.documentElement;
const wipe = document.querySelector(".color-wipe");
const choices = [...document.querySelectorAll("[data-dna-choice]")];
const validExperiences = ["digital", "premium", "corporate"];

const experienceMeta = {
  digital: { themeColor: "#f3f2ec", wipe: "#1fd886", ink: "#07120c", label: "DIGITAL DNA" },
  premium: { themeColor: "#09090b", wipe: "#c9ff2e", ink: "#080a03", label: "PREMIUM DNA" },
  corporate: { themeColor: "#edf1f5", wipe: "#1559a8", ink: "#ffffff", label: "CORPORATE DNA" }
};

let activeExperience = validExperiences.includes(localStorage.getItem("mapa-site-dna"))
  ? localStorage.getItem("mapa-site-dna")
  : "digital";
let changing = false;

function updateExperience(experience) {
  const meta = experienceMeta[experience];
  activeExperience = experience;
  root.dataset.experience = experience;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", meta.themeColor);
  choices.forEach((choice) => choice.setAttribute("aria-pressed", String(choice.dataset.dnaChoice === experience)));
  localStorage.setItem("mapa-site-dna", experience);
  window.dispatchEvent(new CustomEvent("mapa:dna-change", { detail: { experience } }));
}

function animateExperience(experience) {
  if (changing || experience === activeExperience || !validExperiences.includes(experience)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !wipe) {
    updateExperience(experience);
    return;
  }

  changing = true;
  const meta = experienceMeta[experience];
  wipe.style.setProperty("--wipe-color", meta.wipe);
  wipe.style.setProperty("--wipe-text", meta.ink);
  wipe.querySelector("span").textContent = meta.label;
  wipe.classList.remove("is-leaving");
  wipe.classList.add("is-entering");

  window.setTimeout(() => updateExperience(experience), 420);
  window.setTimeout(() => {
    wipe.classList.remove("is-entering");
    wipe.classList.add("is-leaving");
  }, 650);
  window.setTimeout(() => {
    wipe.classList.remove("is-leaving");
    changing = false;
  }, 1220);
}

updateExperience(activeExperience);
choices.forEach((choice) => choice.addEventListener("click", () => animateExperience(choice.dataset.dnaChoice)));
