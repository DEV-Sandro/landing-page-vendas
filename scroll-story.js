const story = document.querySelector("[data-scroll-story]");
const storyHeading = document.querySelector("[data-story-heading]");
const storyPrefix = document.querySelector("[data-story-prefix]");
const storyWord = document.querySelector("[data-story-word]");
const storySuffix = document.querySelector("[data-story-suffix]");
const storyLead = document.querySelector("[data-story-lead]");
const storyStatus = document.querySelector("[data-story-status]");
const storyProgress = document.querySelector("[data-story-progress]");
const storySteps = [...document.querySelectorAll("[data-story-step]")];
const depthCards = [...document.querySelectorAll("[data-depth]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const narrative = [
  { prefix: "Chega de ser", word: "INVISÍVEL", suffix: " na internet.", lead: "Enquanto sua empresa não aparece, a concorrência ocupa a busca, conquista a confiança e fecha a venda.", status: "BUSCANDO SINAL..." },
  { prefix: "Sua empresa precisa ser", word: "ENCONTRADA", suffix: ".", lead: "Ela deve aparecer no momento em que o cliente procura exatamente o serviço que você oferece.", status: "SINAL LOCALIZADO" },
  { prefix: "Sua marca precisa ser", word: "LEMBRADA", suffix: ".", lead: "Uma identidade consistente transforma uma visita rápida em reconhecimento, autoridade e preferência.", status: "MARCA RECONHECIDA" },
  { prefix: "Seu negócio merece ser", word: "ESCOLHIDO", suffix: ".", lead: "Uma experiência clara reduz a dúvida, facilita o contato e aproxima sua empresa da próxima venda.", status: "ROTA CONCLUÍDA" }
];

let currentStep = -1;
let ticking = false;

function updateNarrative() {
  if (!story) return;
  const bounds = story.getBoundingClientRect();
  const scrollable = Math.max(1, story.offsetHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -bounds.top / scrollable));
  const step = Math.min(narrative.length - 1, Math.floor(progress * narrative.length));

  if (storyProgress) storyProgress.style.width = `${progress * 100}%`;
  storySteps.forEach((item, index) => item.classList.toggle("is-active", index === step));

  if (step !== currentStep) {
    currentStep = step;
    const content = narrative[step];
    if (storyPrefix) storyPrefix.textContent = content.prefix;
    if (storySuffix) storySuffix.textContent = content.suffix;
    if (storyWord) {
      storyWord.classList.toggle("is-invisible", step === 0);
      storyWord.textContent = content.word;
    }
    if (!reducedMotion && storyHeading) {
      storyHeading.animate([{ opacity: .25, filter: "blur(6px)", transform: "translateY(10px)" }, { opacity: 1, filter: "blur(0)", transform: "translateY(0)" }], { duration: 620, easing: "cubic-bezier(.16,1,.3,1)" });
    }
    if (storyLead) storyLead.textContent = content.lead;
    if (storyStatus) storyStatus.textContent = content.status;
  }
}

function updateDepth() {
  if (reducedMotion || window.innerWidth < 921) return;
  depthCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const centerDelta = rect.top + rect.height / 2 - window.innerHeight / 2;
    const depth = Number(card.dataset.depth || 0);
    const shift = Math.max(-40, Math.min(40, centerDelta * depth));
    card.style.transform = `translate3d(0, ${shift}px, 0)`;
  });
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateNarrative();
    updateDepth();
    ticking = false;
  });
}

updateNarrative();
updateDepth();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
