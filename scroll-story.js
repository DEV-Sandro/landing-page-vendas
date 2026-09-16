const story = document.querySelector("[data-scroll-story]");
const storyPrefix = document.querySelector("[data-story-prefix]");
const storyWord = document.querySelector("[data-story-word]");
const storySuffix = document.querySelector("[data-story-suffix]");
const storyLead = document.querySelector("[data-story-lead]");
const storyStatus = document.querySelector("[data-story-status]");
const routeCounter = document.querySelector("[data-route-counter]");
const routePath = document.querySelector("[data-route-path]");
const routeNodes = [...document.querySelectorAll("[data-route-node]")];
const storyProgress = document.querySelector("[data-story-progress]");
const storySteps = [...document.querySelectorAll("[data-story-step]")];
const depthCards = [...document.querySelectorAll("[data-depth]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const narrative = [
  { prefix: "Chega de ser", word: "INVISÍVEL", suffix: " na internet.", lead: "Seu cliente pesquisa antes de entrar em contato. Criamos o site e os caminhos digitais para ele encontrar sua empresa e conversar com você.", status: "TRAÇANDO O CAMINHO" },
  { prefix: "Sua empresa precisa ser", word: "ENCONTRADA", suffix: ".", lead: "Uma presença própria ajuda quem procura seu serviço a entender o que você oferece, no momento certo.", status: "PRESENÇA ENCONTRADA" },
  { prefix: "Sua marca precisa ser", word: "LEMBRADA", suffix: ".", lead: "Identidade visual, conteúdo claro e uma boa experiência transformam a primeira visita em confiança.", status: "CONFIANÇA CONSTRUÍDA" },
  { prefix: "Seu negócio merece ser", word: "ESCOLHIDO", suffix: ".", lead: "Quando tudo faz sentido, fica mais fácil dar o próximo passo e iniciar uma conversa com sua empresa.", status: "CONTATO PRONTO" }
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
  if (routePath) routePath.style.strokeDashoffset = String(100 - progress * 100);
  storySteps.forEach((item, index) => item.classList.toggle("is-active", index === step));
  routeNodes.forEach((node, index) => node.classList.toggle("is-active", index <= step));

  if (step !== currentStep) {
    currentStep = step;
    const content = narrative[step];
    if (storyPrefix) storyPrefix.textContent = content.prefix;
    if (storySuffix) storySuffix.textContent = content.suffix;
    if (storyWord) {
      storyWord.classList.toggle("is-invisible", step === 0);
      storyWord.textContent = content.word;
    }
    if (storyLead) storyLead.textContent = content.lead;
    if (storyStatus) storyStatus.textContent = content.status;
    if (routeCounter) routeCounter.textContent = `${String(step + 1).padStart(2, "0")} — 04`;
    window.dispatchEvent(new CustomEvent("mapa:story-change", { detail: { step } }));
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
