# Double-Click Pinned Unloader

A JavaScript mod for Zen Browser, designed for Zen 1.21.16b and Cosine/Sine 2.x.

## What it does

In Compact Mode, double-clicking a normal pinned tab unloads the page while keeping the pinned tab in the current Space.

It does **not** affect:
- normal (unpinned) tabs;
- Zen Essential tabs;
- clicks outside tabs;
- pinned tabs while Compact Mode is disabled.

## Install with Cosine

In Cosine Mods, use the "add your own locally from a GitHub repo" field and enter:

`mickey0498/zen-double-click-pinned-unloader`

Then click Install and restart Zen if requested.

## Source

The mod reuses Zen 1.21.16b's own `gZenPinnedTabManager.onCloseTabShortcut()` with the `unload-switch` behavior.

## License

MIT
