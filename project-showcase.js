const projects = [
  {
    title: "Club House Beltrão", category: "Mercado imobiliário", domain: "club-house-beltr-o.pages.dev", image: "assets/images/club-house-beltrao.webp", mobileImage: "assets/images/club-house-beltrao-mobile.png", url: "https://club-house-beltr-o.pages.dev/#inicio", color: "#b9d4e9", ink: "#0b2033", summary: "Uma experiência imobiliária que transforma desejo em visita.", challenge: "Apresentar um empreendimento completo sem transformar a navegação em um catálogo frio ou confuso.", solution: "Uma narrativa visual que organiza apartamentos, lazer, localização e condições comerciais em uma jornada contínua.", experience: "Imagens amplas, hierarquia editorial e pontos de contato posicionados nos momentos de maior intenção.", result: "Uma vitrine digital preparada para qualificar o interesse e levar o visitante ao atendimento comercial."
  },
  {
    title: "Silvestro Engenharia", category: "Engenharia e construção", domain: "silvestro-engenharia.pages.dev", image: "assets/images/silvestro-engenharia.webp", mobileImage: "assets/images/silvestro-engenharia-mobile.png", url: "https://silvestro-engenharia.pages.dev/", color: "#d7b37a", ink: "#21170d", summary: "Solidez técnica transformada em autoridade digital.", challenge: "Traduzir experiência de engenharia e execução de obras em uma presença clara, confiável e contemporânea.", solution: "Estrutura institucional que equilibra serviços, obras, diferenciais e canais de orçamento.", experience: "Composição sóbria, portfólio visual e navegação orientada às dúvidas de quem está contratando.", result: "Uma base profissional para apresentar capacidade técnica e sustentar novas conversas comerciais."
  },
  {
    title: "Oenning Advocacia", category: "Advocacia", domain: "oenningadvocacia.adv.br", image: "assets/images/oenning-advocacia.webp", mobileImage: "assets/images/oenning-advocacia.webp", mobilePosition: "18% top", url: "https://oenningadvocacia.adv.br/", color: "#d8d0c0", ink: "#241d16", summary: "Confiança jurídica com clareza, sobriedade e proximidade.", challenge: "Apresentar áreas de atuação e autoridade profissional respeitando a sobriedade esperada do setor jurídico.", solution: "Uma experiência institucional organizada por confiança, clareza de serviços e acesso facilitado ao escritório.", experience: "Tipografia editorial, ritmo calmo e conteúdo estruturado para responder às principais dúvidas.", result: "Uma presença própria que fortalece credibilidade e torna o primeiro contato mais seguro."
  },
  {
    title: "Modelo Psicologia", category: "Saúde e bem-estar", domain: "dev-sandro.github.io/modelo-psi", image: "assets/images/modelo-psi.webp", mobileImage: "assets/images/modelo-psi-mobile.png", url: "https://dev-sandro.github.io/modelo-psi/", color: "#c9d9ce", ink: "#183129", summary: "Acolhimento digital antes mesmo da primeira conversa.", challenge: "Construir confiança em um serviço sensível sem recorrer a fórmulas genéricas ou linguagem distante.", solution: "Uma narrativa acolhedora que apresenta abordagem, especialidades, equipe e caminhos de agendamento.", experience: "Cores suaves, leitura confortável e interface pensada para reduzir insegurança e facilitar o contato.", result: "Um modelo adaptável para profissionais que precisam comunicar cuidado, segurança e competência."
  }
];

const showcase = document.querySelector("[data-project-showcase]");
const media = document.querySelector("[data-project-media]");
const title = document.querySelector("[data-project-title]");
const category = document.querySelector("[data-project-category]");
const summary = document.querySelector("[data-project-summary]");
const domain = document.querySelector("[data-project-domain]");
const desktopImage = document.querySelector("[data-project-desktop]");
const mobileImage = document.querySelector("[data-project-mobile]");
const current = document.querySelector("[data-project-current]");
const total = document.querySelector("[data-project-total]");
const dialog = document.querySelector("[data-case-dialog]");
let activeIndex = 0;
let projectChanging = false;

if (total) total.textContent = String(projects.length).padStart(2, "0");

function fillCase(project) {
  dialog?.querySelector("[data-case-category]").replaceChildren(project.category);
  dialog?.querySelector("[data-case-title]").replaceChildren(project.title);
  const caseLink = dialog?.querySelector("[data-case-link]");
  if (caseLink) caseLink.href = project.url;
  const caseImage = dialog?.querySelector("[data-case-image]");
  if (caseImage) { caseImage.src = project.image; caseImage.alt = `Projeto ${project.title}`; }
  dialog?.querySelector("[data-case-challenge]").replaceChildren(project.challenge);
  dialog?.querySelector("[data-case-solution]").replaceChildren(project.solution);
  dialog?.querySelector("[data-case-experience]").replaceChildren(project.experience);
  dialog?.querySelector("[data-case-result]").replaceChildren(project.result);
}

function renderProject(index, animate = true) {
  if (projectChanging) return;
  activeIndex = (index + projects.length) % projects.length;
  const project = projects[activeIndex];
  const update = () => {
    showcase?.style.setProperty("--project-color", project.color);
    showcase?.style.setProperty("--project-ink", project.ink);
    if (title) title.textContent = project.title;
    if (category) category.textContent = project.category;
    if (summary) summary.textContent = project.summary;
    if (domain) domain.textContent = project.domain;
    if (desktopImage) { desktopImage.src = project.image; desktopImage.alt = `Projeto ${project.title} em desktop`; }
    if (mobileImage) {
      mobileImage.src = project.mobileImage || project.image;
      mobileImage.alt = `Versão móvel do projeto ${project.title}`;
      mobileImage.style.objectPosition = project.mobilePosition || "center top";
    }
    if (current) current.textContent = String(activeIndex + 1).padStart(2, "0");
    fillCase(project);
  };

  if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { update(); return; }
  projectChanging = true;
  media?.classList.add("is-changing");
  window.setTimeout(update, 260);
  window.setTimeout(() => { media?.classList.remove("is-changing"); projectChanging = false; }, 650);
}

document.querySelector("[data-project-next]")?.addEventListener("click", () => renderProject(activeIndex + 1));
document.querySelector("[data-project-prev]")?.addEventListener("click", () => renderProject(activeIndex - 1));

function openCase() {
  if (!dialog) return;
  fillCase(projects[activeIndex]);
  const show = () => { dialog.showModal(); document.body.classList.add("case-open"); };
  if (document.startViewTransition) document.startViewTransition(show);
  else show();
}

function closeCase() {
  if (!dialog) return;
  const close = () => { dialog.close(); document.body.classList.remove("case-open"); };
  if (document.startViewTransition) document.startViewTransition(close);
  else close();
}

document.querySelector("[data-open-case]")?.addEventListener("click", openCase);
document.querySelector("[data-close-case]")?.addEventListener("click", closeCase);
dialog?.addEventListener("click", (event) => { if (event.target === dialog) closeCase(); });
dialog?.addEventListener("cancel", (event) => { event.preventDefault(); closeCase(); });
renderProject(0, false);
