# UI Wireframe — AI Language Translation Tool

## Desktop Layout

```
+--------------------------------------------------------------+
|  [Logo] LinguaBridge                              ( Dark )   |
+--------------------------------------------------------------+
|
|                 AI Language Translation Tool
|         Translate text instantly across 14+ languages
|
|   +----------------------------------------------------+
|   |  [ Source Language ▼ ]   ( ⇄ )   [ Target Language ▼]|
|   |                                                      |
|   |  +----------------------+   +----------------------+ |
|   |  | Enter text to        |   | Translation appears  | |
|   |  | translate...          |   | here...              | |
|   |  |                       |   |                       | |
|   |  |                       |   |                       | |
|   |  +----------------------+   +----------------------+ |
|   |  0 / 2000    [Clear][🔊]    [Copy][🔊][⬇]           |
|   |                                                      |
|   |            [   Translate   ]                        |
|   |                                                      |
|   |  (error banner shown here if validation fails)       |
|   +----------------------------------------------------+
|
|   +----------------------------------------------------+
|   |  🕘 Recent Translations                    [Clear]  |
|   |  ---------------------------------------------------|
|   |  EN → HI · 10:32 AM                                  |
|   |  Hello                                                |
|   |  नमस्ते                                                |
|   +----------------------------------------------------+
|
|              Built with Flask & LibreTranslate
+--------------------------------------------------------------+
```

## Mobile Layout (stacked)

```
+--------------------------+
| [Logo] LinguaBridge  🌙  |
+--------------------------+
|   AI Language Translator |
|   Translate text...      |
|                           |
| [ Source ▼ ]              |
|         (⇄)               |
| [ Target ▼ ]              |
|                           |
| +-----------------------+ |
| | Enter text...          | |
| +-----------------------+ |
| 0/2000   [Clear] [🔊]     |
|                           |
| +-----------------------+ |
| | Translation appears    | |
| +-----------------------+ |
|          [Copy][🔊][⬇]    |
|                           |
|   [     Translate     ]  |
|                           |
| 🕘 Recent Translations    |
| ...                        |
+--------------------------+
```

## Notes
- Input and output panels sit side by side on desktop (2-column grid) and stack vertically on mobile (≤720px).
- The swap button sits between the two language dropdowns and re-orders below them on narrow screens.
- The Translate button spans the full card width for a clear primary call-to-action.
- Error messages appear as a dismissible red banner directly below the Translate button.
