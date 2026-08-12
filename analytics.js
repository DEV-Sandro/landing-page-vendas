(function () {
  "use strict";

  if (window.__sandroAnalyticsLoaded) return;
  window.__sandroAnalyticsLoaded = true;

  const currentScript = document.currentScript;
  const measurementId = currentScript?.dataset.measurementId;
  const storageKey = "sandroWeb.analyticsConsent";
  const privacyUrl = currentScript?.src
    ? new URL("privacy.html", currentScript.src).href
    : "privacy.html";

  if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500
  });

  let analyticsStarted = false;
  let consentBanner;

  function getPreference() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }

  function savePreference(value) {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      // A escolha continua válida durante a visita quando o armazenamento está bloqueado.
    }
  }

  function updateConsent(value) {
    window.gtag("consent", "update", {
      analytics_storage: value,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
  }

  function startAnalytics() {
    if (analyticsStarted) return;
    analyticsStarted = true;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);

    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: true,
      anonymize_ip: true
    });
  }

  function hideBanner() {
    consentBanner?.setAttribute("hidden", "");
  }

  function chooseConsent(value) {
    savePreference(value);

    if (value === "granted") {
      updateConsent("granted");
      startAnalytics();
    } else {
      updateConsent("denied");
    }

    hideBanner();
  }

  function addBannerStyles() {
    if (document.querySelector("[data-consent-styles]")) return;

    const style = document.createElement("style");
    style.dataset.consentStyles = "";
    style.textContent = `
      .consent-banner[hidden] { display: none; }
      .consent-banner {
        position: fixed; z-index: 1000; right: 20px; bottom: 20px;
        width: min(560px, calc(100% - 40px)); padding: 22px;
        border: 1px solid rgba(255, 255, 255, .16); border-radius: 4px; background: #141414;
        box-shadow: 0 24px 70px rgba(0, 0, 0, .55);
        color: #ededed; font-family: Inter, system-ui, sans-serif;
      }
      .consent-banner__title { margin: 0 0 8px; color: #ededed; font-size: 1.08rem; line-height: 1.3; }
      .consent-banner__text { margin: 0; color: #a1a1a1; font-size: .9rem; line-height: 1.6; }
      .consent-banner__text a {
        display: inline; min-height: 0; padding: 0; border-radius: 0; background: transparent;
        color: var(--accent, #1fd886); font-weight: 700; text-decoration: underline; text-underline-offset: 3px;
      }
      .consent-banner__text a:hover { background: transparent; filter: brightness(1.12); }
      .consent-banner__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
      .consent-banner__button {
        min-height: 44px; padding: 10px 16px; border: 1px solid var(--accent, #1fd886);
        border-radius: 3px; background: var(--accent, #1fd886); color: var(--button-text, #07120c); cursor: pointer;
        font: 700 .86rem/1 Inter, system-ui, sans-serif;
      }
      .consent-banner__button:hover { filter: brightness(1.08); }
      .consent-banner__button--secondary { border-color: rgba(255, 255, 255, .22); background: transparent; color: #ededed; }
      .consent-banner__button--secondary:hover { background: #202020; }
      .consent-banner__button:focus-visible { outline: 3px solid var(--accent, #1fd886); outline-offset: 3px; }
      @media (max-width: 560px) {
        .consent-banner { right: 12px; bottom: 12px; width: calc(100% - 24px); padding: 18px; }
        .consent-banner__actions { display: grid; }
      }
    `;
    document.head.appendChild(style);
  }

  function createBanner() {
    if (consentBanner) return consentBanner;

    addBannerStyles();
    consentBanner = document.createElement("section");
    consentBanner.className = "consent-banner";
    consentBanner.setAttribute("role", "dialog");
    consentBanner.setAttribute("aria-labelledby", "consent-title");
    consentBanner.setAttribute("aria-describedby", "consent-description");
    consentBanner.innerHTML = `
      <h2 class="consent-banner__title" id="consent-title">Sua privacidade importa</h2>
      <p class="consent-banner__text" id="consent-description">
        Usamos o Google Analytics somente com sua autorização para entender visitas e melhorar o site.
        Não enviamos dados de formulários nem informações pessoais. <a href="${privacyUrl}">Leia a política de privacidade</a>.
      </p>
      <div class="consent-banner__actions">
        <button class="consent-banner__button" type="button" data-consent-accept>Aceitar métricas</button>
        <button class="consent-banner__button consent-banner__button--secondary" type="button" data-consent-reject>Recusar</button>
      </div>
    `;

    consentBanner.querySelector("[data-consent-accept]").addEventListener("click", () => chooseConsent("granted"));
    consentBanner.querySelector("[data-consent-reject]").addEventListener("click", () => chooseConsent("denied"));
    document.body.appendChild(consentBanner);
    return consentBanner;
  }

  function showBanner({ moveFocus = true } = {}) {
    const banner = createBanner();
    banner.removeAttribute("hidden");
    if (moveFocus) banner.querySelector("[data-consent-accept]")?.focus();
  }

  function eventLocation(element) {
    if (element.closest("header")) return "header";
    if (element.closest("footer")) return "footer";
    if (element.closest(".showcase-section")) return "showcase";
    if (element.closest(".final-cta")) return "final_cta";
    if (element.classList.contains("whatsapp-float")) return "floating_button";
    return "content";
  }

  // Impede que a medição automática envie a URL do WhatsApp, que contém o telefone comercial.
  window.addEventListener("click", (event) => {
    if (getPreference() !== "granted") return;

    const link = event.target.closest("a[href]");
    if (!link) return;

    const targetUrl = new URL(link.href, window.location.href);
    if (targetUrl.hostname !== "wa.me") return;

    event.preventDefault();
    event.stopImmediatePropagation();
    window.gtag("event", "whatsapp_click", {
      link_location: eventLocation(link)
    });

    if (link.target === "_blank") {
      window.open(link.href, "_blank", "noopener,noreferrer");
    } else {
      window.location.assign(link.href);
    }
  }, true);

  document.addEventListener("click", (event) => {
    const settingsButton = event.target.closest("[data-open-privacy-settings]");
    if (settingsButton) {
      event.preventDefault();
      showBanner();
      return;
    }

    if (getPreference() !== "granted") return;

    const link = event.target.closest("a[href]");
    if (!link) return;

    const targetUrl = new URL(link.href, window.location.href);
    if (link.matches("[data-case-link]") && targetUrl.origin !== window.location.origin) {
      window.gtag("event", "portfolio_click", {
        project_domain: targetUrl.hostname
      });
    }
  });

  const preference = getPreference();
  if (preference === "granted") {
    updateConsent("granted");
    startAnalytics();
  } else if (preference !== "denied") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => showBanner({ moveFocus: false }), { once: true });
    } else {
      showBanner({ moveFocus: false });
    }
  }
})();
