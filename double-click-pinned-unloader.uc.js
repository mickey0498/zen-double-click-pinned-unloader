// Double-Click Pinned Unloader
// Zen Browser 1.21.16b / Cosine (Sine 2.x)
// SPDX-License-Identifier: MIT

"use strict";

(() => {
  const GLOBAL_KEY = "__zenDoubleClickPinnedUnloader";
  const LOG = "[Double-Click Pinned Unloader]";

  if (window[GLOBAL_KEY]) {
    return;
  }

  const isCompactMode = () =>
    document.documentElement.getAttribute("zen-compact-mode") === "true";

  const isPinnedNormalTab = tab =>
    tab &&
    tab.localName === "tab" &&
    tab.pinned &&
    !tab.hasAttribute("zen-essential");

  function onDoubleClick(event) {
    if (!isCompactMode() || event.button !== 0) {
      return;
    }

    const tab = event.target?.closest?.("tab");

    if (!isPinnedNormalTab(tab)) {
      return;
    }

    // Reuse Zen's own pinned-tab close/unload implementation.
    // "unload-switch" calls explicitUnloadTabs() and leaves the tab pinned.
    if (!window.gZenPinnedTabManager?.onCloseTabShortcut) {
      console.error(`${LOG} ZenPinnedTabManager is unavailable.`);
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    void window.gZenPinnedTabManager
      .onCloseTabShortcut(event, tab, {
        behavior: "unload-switch",
        closeIfPending: false,
      })
      .catch(error => {
        console.error(`${LOG} Failed to unload pinned tab:`, error);
      });
  }

  const tabContainer = window.gBrowser?.tabContainer;

  if (!tabContainer) {
    console.error(`${LOG} gBrowser.tabContainer is unavailable.`);
    return;
  }

  tabContainer.addEventListener("dblclick", onDoubleClick, true);

  window[GLOBAL_KEY] = {
    destroy() {
      tabContainer.removeEventListener("dblclick", onDoubleClick, true);
      delete window[GLOBAL_KEY];
    },
  };

  window.addEventListener(
    "unload",
    () => {
      window[GLOBAL_KEY]?.destroy();
    },
    { once: true }
  );

  console.info(`${LOG} Loaded.`);
})();
