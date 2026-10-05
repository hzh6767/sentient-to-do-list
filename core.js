(() => {
  "use strict";

  // Pure, DOM-free logic shared by the page and the tests.
  // Loaded as a classic script so index.html still works straight from file://.

  function stableSeed(text) {
    let value = 19;
    for (const character of text) value = (value * 33 + character.codePointAt(0)) >>> 0;
    return (value % 1000) / 1000;
  }

  function pick(items, seed = Math.random()) {
    return items[Math.floor(seed * items.length) % items.length];
  }

  function openCount(tasks) {
    return tasks.filter((task) => !task.done).length;
  }

  function moodFor(tasks) {
    const open = openCount(tasks);
    const completed = tasks.length - open;
    if (tasks.length === 0) {
      return { face: "•_•", text: "The list is experiencing an identity vacuum." };
    }
    if (open === 0) {
      return { face: "ᵔᴗᵔ", text: "The list has achieved suspicious inner peace." };
    }
    if (completed > open) {
      return { face: "•ᴗ•", text: "The list is impressed and hiding it badly." };
    }
    if (open >= 6) {
      return { face: "•﹏•", text: "The list would like to discuss staffing." };
    }
    return { face: "•ᴗ•", text: "The list feels cautiously useful." };
  }

  function headlineLabel(open) {
    return open === 1 ? "task is" : "tasks are";
  }

  const core = { stableSeed, pick, openCount, moodFor, headlineLabel };
  globalThis.SentientCore = core;
  if (typeof module !== "undefined" && module.exports) module.exports = core;
})();
