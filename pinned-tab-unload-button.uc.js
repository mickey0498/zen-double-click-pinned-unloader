// Pinned Tab Unload Button
// Agrega un botón sobre el ícono de pestañas pineadas por espacio para
// descargarlas (unload) sin quitarlas del espacio. Solo visible en modo
// compacto. El CSS se inyecta desde este mismo script (no depende de un
// campo "styles" separado en theme.json).

(function () {
  console.log("[PinnedTabUnloadButton] script cargado");

  const BUTTON_CLASS = "zen-pinned-unload-button";
  const STYLE_ID = "zen-pinned-unload-button-style";

  const CSS_TEXT = `
    .tab-icon-stack {
      position: relative;
    }

    .${BUTTON_CLASS} {
      display: none;
      position: absolute;
      top: -3px;
      right: -3px;
      width: 12px;
      height: 12px;
      min-width: 12px;
      padding: 0;
      border-radius: 50%;
      background: color-mix(in srgb, currentColor 15%, transparent);
      cursor: pointer;
      z-index: 2;
    }

    .${BUTTON_CLASS}::before {
      content: "⏻";
      font-size: 9px;
      line-height: 12px;
    }

    .${BUTTON_CLASS}:hover {
      background: color-mix(in srgb, currentColor 30%, transparent);
    }

    :root[zen-compact-mode="true"]
      tab.tabbrowser-tab[pinned]:not([zen-essential]):hover
      .${BUTTON_CLASS} {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS_TEXT;
    document.documentElement.appendChild(style);
    console.log("[PinnedTabUnloadButton] estilos inyectados");
  }

  function unloadTab(tab) {
    if (gBrowser.selectedTab === tab) {
      gBrowser.tabContainer.advanceSelectedTab(1, true);
    }

    try {
      if (typeof gBrowser.explicitUnloadTabs === "function") {
        gBrowser.explicitUnloadTabs([tab]);
      } else {
        gBrowser.discardBrowser(tab, true);
      }
    } catch (e) {
      console.error("[PinnedTabUnloadButton]", e);
    }
  }

  function addButtonToTab(tab) {
    if (!tab || !tab.pinned) return;
    if (tab.hasAttribute("zen-essential")) return;
    if (tab.querySelector(`.${BUTTON_CLASS}`)) return;

    const btn = document.createXULElement("toolbarbutton");
    btn.classList.add(BUTTON_CLASS);
    btn.setAttribute("tooltiptext", "Descargar pestaña");
    btn.addEventListener("click", (event) => {
      console.log("[PinnedTabUnloadButton] click en botón de unload");
      event.preventDefault();
      event.stopPropagation();
      unloadTab(tab);
    });

    const iconStack = tab.querySelector(".tab-icon-stack") || tab;
    iconStack.appendChild(btn);
  }

  function refreshAllPinnedTabs() {
    for (const tab of gBrowser.tabs) {
      addButtonToTab(tab);
    }
  }

  function init() {
    console.log("[PinnedTabUnloadButton] init() ejecutado, pestañas encontradas:", gBrowser.tabs.length);
    injectStyles();
    refreshAllPinnedTabs();
    gBrowser.tabContainer.addEventListener("TabPinned", (e) => addButtonToTab(e.target));
    gBrowser.tabContainer.addEventListener("TabOpen", (e) => addButtonToTab(e.target));
  }

  if (gBrowserInit && gBrowserInit.delayedStartupFinished) {
    init();
  } else {
    const delayedListener = (subject, topic) => {
      if (topic === "browser-delayed-startup-finished" && subject === window) {
        Services.obs.removeObserver(delayedListener, topic);
        init();
      }
    };
    Services.obs.addObserver(delayedListener, "browser-delayed-startup-finished");
  }
})();
