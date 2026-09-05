// Pinned Tab Unload Button
// Agrega un botón sobre el ícono de pestañas pineadas por espacio para
// descargarlas (unload) sin quitarlas del espacio. Solo visible en modo
// compacto (ver pinned-tab-unload-button.uc.css).

(function () {
  console.log("[PinnedTabUnloadButton] script cargado");
  const BUTTON_CLASS = "zen-pinned-unload-button";

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
