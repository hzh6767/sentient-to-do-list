(() => {
  "use strict";

  const { stableSeed, pick, openCount, moodFor, headlineLabel } = globalThis.SentientCore;

  const samples = [
    { title: "Reply to the message from Tuesday", energy: "normal", done: false },
    { title: "Water the suspiciously dramatic plant", energy: "crumb", done: false },
    { title: "Rename final-final-v7 for the last time", energy: "turbo", done: false }
  ];
  const personalities = {
    crumb: [
      "I promise to be smaller than the dread surrounding me.",
      "We could do one percent of me and call it narrative progress.",
      "I have lowered my expectations and prepared a tiny parade."
    ],
    normal: [
      "I have reviewed the calendar and would like a respectful conclusion.",
      "Completing me may unlock a completely average amount of peace.",
      "I am ready when you are, which is becoming slightly awkward."
    ],
    turbo: [
      "Point me at the horizon. I have already packed snacks.",
      "I contain at least three dramatic montage opportunities.",
      "Let us finish before common sense catches up."
    ]
  };
  const completionLines = [
    "I saw the checkbox. It was beautiful.",
    "At last, I can retire to the completed dimension.",
    "Character arc complete. Please tell the other tasks I was brave.",
    "I am finished, yet somehow more emotionally complex."
  ];
  const listThoughts = [
    "I believe in you with the unsettling confidence of a loading spinner.",
    "We are not behind. We are building suspense.",
    "One checkbox could change the emotional weather in here.",
    "Productivity is just chaos wearing a very small tie.",
    "I sorted your obligations by how loudly they sigh."
  ];

  const form = document.querySelector("#task-form");
  const input = document.querySelector("#task-input");
  const energy = document.querySelector("#energy");
  const list = document.querySelector("#task-list");
  const remaining = document.querySelector("#remaining");
  const remainingLabel = document.querySelector("#remaining-label");
  const face = document.querySelector("#face");
  const moodText = document.querySelector("#mood-text");
  const thought = document.querySelector("#thought");
  let tasks = [];
  let nextId = 1;
  const rows = new Map();

  function speak(message) {
    thought.textContent = `“${message}”`;
  }

  function updateMood() {
    const open = openCount(tasks);
    const mood = moodFor(tasks);
    remaining.textContent = String(open);
    remainingLabel.textContent = headlineLabel(open);
    face.textContent = mood.face;
    moodText.textContent = mood.text;
  }

  // Buttons resolve their task by id when clicked, so a row can outlive the
  // task object it was originally built from (ids restart on "restore samples").
  function findTask(id) {
    return tasks.find((task) => task.id === id) || null;
  }

  function createTaskRow(id) {
    const item = document.createElement("li");
    const toggle = document.createElement("button");
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    const opinion = document.createElement("p");
    const meta = document.createElement("div");
    const badge = document.createElement("span");
    const remove = document.createElement("button");

    toggle.type = "button";
    toggle.className = "task-toggle";
    toggle.textContent = "✓";
    copy.className = "task-copy";
    copy.append(title, opinion);
    badge.className = "badge";
    remove.type = "button";
    remove.className = "task-remove";
    remove.textContent = "dismiss";
    meta.append(badge, remove);

    toggle.addEventListener("click", () => {
      const task = findTask(id);
      if (!task) return;
      task.done = !task.done;
      speak(task.done ? task.completion : `Fine. ${task.opinion}`);
      render();
    });
    remove.addEventListener("click", () => {
      const index = tasks.findIndex((candidate) => candidate.id === id);
      if (index === -1) return;
      const neighbour = tasks[index + 1] || tasks[index - 1] || null;
      const [leaving] = tasks.splice(index, 1);
      speak(`${leaving.title} has left the list to pursue other opportunities.`);
      render();
      // The focused button left with its row, so hand focus to the next task's
      // dismiss control instead of letting it fall back to the document body.
      const nextRow = neighbour ? rows.get(neighbour.id) : null;
      (nextRow ? nextRow.remove : input).focus();
    });

    item.append(toggle, copy, meta);
    return { item, toggle, title, opinion, badge, remove };
  }

  function updateTaskRow(row, task) {
    row.item.className = `task${task.done ? " done" : ""}`;
    row.toggle.setAttribute("aria-label", task.done ? `Mark ${task.title} incomplete` : `Complete ${task.title}`);
    row.toggle.setAttribute("aria-pressed", String(task.done));
    row.title.textContent = task.title;
    row.opinion.textContent = task.done ? task.completion : task.opinion;
    row.badge.textContent = `${task.energy.toUpperCase()} ENERGY`;
    row.remove.setAttribute("aria-label", `Dismiss ${task.title}`);
  }

  // Reconciles the existing rows in place rather than rebuilding the list, so a
  // focused control survives every action that does not remove its own row.
  function render() {
    const present = new Set(tasks.map((task) => task.id));
    for (const [id, row] of rows) {
      if (!present.has(id)) {
        row.item.remove();
        rows.delete(id);
      }
    }
    tasks.forEach((task, index) => {
      let row = rows.get(task.id);
      if (!row) {
        row = createTaskRow(task.id);
        rows.set(task.id, row);
      }
      updateTaskRow(row, task);
      const occupant = list.children[index];
      if (occupant !== row.item) list.insertBefore(row.item, occupant || null);
    });
    updateMood();
  }

  function createTask(title, taskEnergy, done = false) {
    const seed = stableSeed(title);
    return {
      id: nextId++,
      title,
      energy: taskEnergy,
      done,
      opinion: pick(personalities[taskEnergy], seed),
      completion: pick(completionLines, seed)
    };
  }

  function restoreSamples() {
    nextId = 1;
    tasks = samples.map((sample) => createTask(sample.title, sample.energy, sample.done));
    speak("I have organized three responsibilities and developed one concern.");
    render();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = input.value.trim();
    if (!title) return;
    const task = createTask(title, energy.value);
    tasks.unshift(task);
    speak(`New arrival: ${task.opinion}`);
    form.reset();
    energy.value = "normal";
    input.focus();
    render();
  });

  document.querySelector("#pep-talk").addEventListener("click", () => {
    speak(pick(listThoughts));
    face.textContent = "ᵔᴗᵔ";
    moodText.textContent = "The list has received one unit of morale.";
  });

  document.querySelector("#clear-done").addEventListener("click", () => {
    const completed = tasks.filter((task) => task.done).length;
    tasks = tasks.filter((task) => !task.done);
    speak(completed ? `${completed} completed ${completed === 1 ? "task has" : "tasks have"} ascended into archive mythology.` : "No completed tasks volunteered for release.");
    render();
  });

  document.querySelector("#reset").addEventListener("click", restoreSamples);

  restoreSamples();
})();
