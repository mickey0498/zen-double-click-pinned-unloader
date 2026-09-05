# Double-Click Pinned Unloader

A CSS+JS mod for Zen Browser, designed for Cosine/Sine 2.x.

## What it does

In Compact Mode, hovering a pinned tab (within a Space, not an Essential)
reveals a small button on top of its icon. Clicking it unloads the tab
from memory while keeping it pinned in the current Space.

It does **not** affect:

- normal (unpinned) tabs;
- Zen Essential tabs;
- pinned tabs while Compact Mode is disabled.

## Install with Cosine

In Cosine Mods, use the "add your own locally from a GitHub repo" field
and enter:

`mickey0498/zen-double-click-pinned-unloader`

Then click Install and restart Zen if requested.

## Source

Uses `gBrowser.explicitUnloadTabs()` (falls back to `gBrowser.discardBrowser()`
on older builds) instead of `gBrowser.removeTab()`, since the latter would
remove the tab from the Space entirely.

## License

MIT
