# Sentient To-Do List

An offline to-do list with a tiny pretend personality engine. Every task develops an opinion, reacts when completed, and contributes to the list's overall mood.

## Run

Open `index.html` directly in a modern browser. No build step, server, account, dependency, network request, or API key is required.

## Features

- Add, complete, dismiss, and clear tasks
- Deterministic task personalities based on the task text
- Three energy settings with different dialogue styles
- Dynamic list mood and local monologue
- Keyboard-friendly controls: the task list is reconciled in place, so focus survives adding, completing, and dismissing tasks
- No persistence by design—the list forgets everything on refresh

## Layout

- `index.html` — markup and the two classic scripts
- `core.js` — DOM-free logic (seed, picker, mood rules, headline grammar), usable from the page and from `node`
- `app.js` — DOM wiring, task state, and rendering
- `style.css` — styling

## Check

```powershell
npm test
```

The tests need no install and no dependencies: they run on Node's built-in test runner against the pure logic in `core.js` (seed determinism, mood transitions, headline grammar).

## License

MIT. See `LICENSE`.
