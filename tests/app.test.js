"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { stableSeed, pick, openCount, moodFor, headlineLabel } = require(
  path.join(__dirname, "..", "core.js")
);

test("stableSeed is deterministic for the same text", () => {
  assert.equal(stableSeed("Water the plant"), stableSeed("Water the plant"));
  assert.equal(stableSeed(""), stableSeed(""));
});

test("stableSeed stays within [0, 1)", () => {
  const texts = ["a", "", "Rename final-final-v7 for the last time", "😀 emoji led", "ünïcødé"];
  for (const text of texts) {
    const seed = stableSeed(text);
    assert.ok(seed >= 0 && seed < 1, `${JSON.stringify(text)} produced ${seed}`);
  }
});

test("stableSeed separates astral characters that share a high surrogate", () => {
  // Both emoji have high surrogate 55357; a charCodeAt(0) hash collides them.
  assert.equal("😀".charCodeAt(0), "😁".charCodeAt(0));
  assert.notEqual(stableSeed("😀 write the report"), stableSeed("😁 write the report"));
});

test("stableSeed reacts to the whole text", () => {
  assert.notEqual(stableSeed("buy milk"), stableSeed("buy a milks"));
});

test("pick is stable for a fixed seed and always in range", () => {
  const items = ["one", "two", "three"];
  assert.equal(pick(items, 0.539), pick(items, 0.539));
  for (const seed of [0, 0.159, 0.409, 0.999999]) {
    assert.ok(items.includes(pick(items, seed)), `seed ${seed} left the array`);
  }
});

test("openCount counts only unfinished tasks", () => {
  assert.equal(openCount([]), 0);
  assert.equal(openCount([{ done: true }, { done: true }]), 0);
  assert.equal(openCount([{ done: true }, { done: false }, { done: false }]), 2);
});

test("moodFor reports an identity vacuum for an empty list", () => {
  assert.deepEqual(moodFor([]), {
    face: "•_•",
    text: "The list is experiencing an identity vacuum."
  });
});

test("moodFor celebrates a fully completed list", () => {
  assert.deepEqual(moodFor([{ done: true }, { done: true }]), {
    face: "ᵔᴗᵔ",
    text: "The list has achieved suspicious inner peace."
  });
});

test("moodFor is impressed once completed outnumbers open", () => {
  const tasks = [{ done: true }, { done: true }, { done: false }];
  assert.deepEqual(moodFor(tasks), {
    face: "•ᴗ•",
    text: "The list is impressed and hiding it badly."
  });
});

test("moodFor asks for staffing at six open tasks", () => {
  const tasks = Array.from({ length: 6 }, () => ({ done: false }));
  assert.deepEqual(moodFor(tasks), {
    face: "•﹏•",
    text: "The list would like to discuss staffing."
  });
});

test("moodFor falls back to cautious usefulness", () => {
  const tasks = [{ done: false }, { done: false }, { done: true }];
  assert.deepEqual(moodFor(tasks), {
    face: "•ᴗ•",
    text: "The list feels cautiously useful."
  });
});

test("moodFor does not let five open tasks trip the staffing branch", () => {
  const tasks = Array.from({ length: 5 }, () => ({ done: false }));
  assert.equal(moodFor(tasks).text, "The list feels cautiously useful.");
});

test("headlineLabel switches to the singular at one remaining task", () => {
  assert.equal(headlineLabel(0), "tasks are");
  assert.equal(headlineLabel(1), "task is");
  assert.equal(headlineLabel(2), "tasks are");
});
