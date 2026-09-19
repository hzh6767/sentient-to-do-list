(() => {
  "use strict";

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
  const face = document.querySelector("#face");
  const moodText = document.querySelector("#mood-text");
  const thought = document.querySelector("#thought");
  let tasks = [];
  let nextId = 1;

  function pick(items, seed = Math.random()) {
    return items[Math.floor(seed * items.length) % items.length];
  }

  function stableSeed(text) {
    let value = 19;
    for (const character of text) value = (value * 33 + character.charCodeAt(0)) >>> 0;
    return (value % 1000) / 1000;
  }

  function speak(message) {
    thought.textContent = `“${message}”`;
  }

  function updateMood() {
    const open = tasks.filter((task) => !task.done).length;
    const completed = tasks.length - open;
    remaining.textContent = String(open);
    if (tasks.length === 0) {
      face.textContent = "•_•";
      moodText.textContent = "The list is experiencing an identity vacuum.";
    } else if (open === 0) {
      face.textContent = "ᵔᴗᵔ";
      moodText.textContent = "The list has achieved suspicious inner peace.";
    } else if (completed > open) {
      face.textContent = "•ᴗ•";
      moodText.textContent = "The list is impressed and hiding it badly.";
    } else if (open >= 6) {
      face.textContent = "•﹏•";
      moodText.textContent = "The list would like to discuss staffing.";
    } else {
      face.textContent = "•ᴗ•";
      moodText.textContent = "The list feels cautiously useful.";
    }
  }

  function makeTaskElement(task) {
    const item = document.createElement("li");
    const toggle = document.createElement("button");
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    const opinion = document.createElement("p");
    const meta = document.createElement("div");
    const badge = document.createElement("span");
    const remove = document.createElement("button");

    item.className = `task${task.done ? " done" : ""}`;
    toggle.type = "button";
    toggle.className = "task-toggle";
    toggle.textContent = "✓";
    toggle.setAttribute("aria-label", task.done ? `Mark ${task.title} incomplete` : `Complete ${task.title}`);
    toggle.setAttribute("aria-pressed", String(task.done));
    copy.className = "task-copy";
    title.textContent = task.title;
    opinion.textContent = task.done ? task.completion : task.opinion;
    copy.append(title, opinion);
    badge.className = "badge";
    badge.textContent = `${task.energy.toUpperCase()} ENERGY`;
    remove.type = "button";
    remove.className = "task-remove";
    remove.textContent = "dismiss";
    remove.setAttribute("aria-label", `Dismiss ${task.title}`);
    meta.append(badge, remove);

    toggle.addEventListener("click", () => {
      task.done = !task.done;
      speak(task.done ? task.completion : `Fine. ${task.opinion}`);
      render();
    });
    remove.addEventListener("click", () => {
      tasks = tasks.filter((candidate) => candidate.id !== task.id);
      speak(`${task.title} has left the list to pursue other opportunities.`);
      render();
    });
    item.append(toggle, copy, meta);
    return item;
  }

  function render() {
    list.replaceChildren(...tasks.map(makeTaskElement));
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
