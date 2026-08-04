# Testing — AI Language Translation Tool

## 1. Manual Test Cases

| # | Test Case | Steps | Expected Output |
|---|---|---|---|
| 1 | Basic translation | Enter "Hello", source=English, target=Hindi, click Translate | Hindi translation is displayed in the output panel |
| 2 | Empty input validation | Leave input blank, click Translate | Red error banner: "Please enter some text to translate." No API call made |
| 3 | Auto-detect source | Enter Spanish text, source="Detect Language", target=English | Correct English translation is returned |
| 4 | Swap languages | Translate EN→HI, then click Swap | Source/target dropdowns swap, input/output text swap |
| 5 | Swap while source = Detect | Set source to "Detect Language", click Swap | Toast: "Can't swap from Detect Language"; no swap occurs |
| 6 | Copy button | Translate text, click Copy | Translated text is on the clipboard; "Copied!" toast appears |
| 7 | Copy with no translation yet | Click Copy before translating anything | Toast: "Nothing to copy yet" |
| 8 | Clear button | Enter text, translate, click Clear | Input and output both reset to empty/placeholder state |
| 9 | Text-to-Speech (output) | Translate text, click speaker icon on output panel | Browser reads the translated text aloud |
| 10 | Text-to-Speech with no output | Click speaker icon on output before translating | Toast: "Nothing to read aloud" |
| 11 | Character counter | Type text into input | Counter updates live, e.g. "42 / 2000" |
| 12 | Character limit | Try typing beyond 2000 characters | Input stops accepting further characters (maxlength enforced) |
| 13 | Download translation | Translate text, click Download | Browser downloads `translation.txt` containing the translated text |
| 14 | Dark mode toggle | Click moon/sun icon | Theme switches between light and dark; icon updates accordingly |
| 15 | History updates | Perform 2–3 translations | "Recent Translations" list shows them, most recent first, capped at 5 |
| 16 | Clear history | Click "Clear" in history card | History list resets to "No translations yet." |
| 17 | Loading state | Click Translate on a slow connection | Spinner shows over output panel; Translate button is disabled until response arrives |
| 18 | API failure handling | Simulate API downtime (e.g. wrong `.env` URL) | Red error banner shows a descriptive error instead of the app crashing |
| 19 | Keyboard shortcut | Focus input, type text, press `Ctrl+Enter` | Translation triggers without clicking the button |
| 20 | Responsive layout | Resize browser to mobile width / use dev tools device toolbar | Panels stack vertically, layout remains usable and readable |

## 2. Backend Automated Checks (already verified during development)

```python
# Using Flask's test client:
client = app.test_client()

# 1. Home page loads
response = client.get('/')
assert response.status_code == 200

# 2. Empty text is rejected with 400
response = client.post('/translate', json={'text': '', 'source': 'en', 'target': 'hi'})
assert response.status_code == 400
assert 'error' in response.get_json()
```

## 3. Edge Cases Considered

| Edge Case | Handling |
|---|---|
| Text containing only whitespace | Backend uses `.strip()` before validating, so whitespace-only input is treated as empty |
| Missing `target` field entirely | Backend explicitly checks for it and returns `400` with a clear message |
| Translation API times out | Backend sets a 15-second `requests` timeout and returns `504` |
| Translation API is unreachable/down | Caught by `requests.exceptions.RequestException`, returns `502` with the underlying error message |
| Very long input (near 2000 chars) | `maxlength` attribute on the textarea prevents exceeding the limit client-side |
| User clicks Translate twice quickly | Button is `disabled` while a request is in-flight, preventing duplicate calls |
| Browser without Speech Synthesis support | `speak()` checks `"speechSynthesis" in window` and shows a toast instead of throwing |
| Browser without Clipboard API support | Copy handler is wrapped in try/catch and shows a "Copy failed" toast on failure |

## 4. Suggested Screenshot-Backed Evidence for Report

Pair each test case above with a screenshot (see `docs/` and the README's Screenshots section) to include in the internship submission as visual proof of testing.
