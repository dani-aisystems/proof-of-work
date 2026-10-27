import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

async function loadCurriculum() {
  const source = await readFile(new URL("../src/content.js", import.meta.url), "utf8");
  const expose = `
    globalThis.__curriculum = {
      SKILLS, DIAGNOSTIC_QUESTIONS, DOCS, VIDEOS, MODULES, LESSONS, QUIZZES
    };
  `;
  const context = { globalThis: {} };
  vm.runInNewContext(source + expose, context, { filename: "src/content.js" });
  return context.globalThis.__curriculum;
}

function unique(values, label) {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
}

test("curriculum references resolve and live modules contain real lessons", async () => {
  const { SKILLS, DIAGNOSTIC_QUESTIONS, DOCS, VIDEOS, MODULES, LESSONS, QUIZZES } = await loadCurriculum();

  unique(MODULES.map((module) => module.id), "module ids");
  unique(Object.keys(LESSONS), "lesson ids");

  const moduleIds = new Set(MODULES.map((module) => module.id));
  const lessonIds = new Set(Object.keys(LESSONS));

  for (const module of MODULES) {
    if (module.status === "live") {
      assert.ok(module.lessons?.length, `${module.id} must list at least one lesson`);
    }
    for (const lessonId of module.lessons ?? []) {
      assert.ok(lessonIds.has(lessonId), `${module.id} references missing lesson ${lessonId}`);
      assert.equal(LESSONS[lessonId].module, module.id, `${lessonId} belongs to the wrong module`);
    }
    if (module.quiz) {
      assert.ok(QUIZZES[module.quiz], `${module.id} references missing quiz ${module.quiz}`);
      assert.equal(QUIZZES[module.quiz].module, module.id, `${module.quiz} belongs to the wrong module`);
    }
  }

  for (const [lessonId, lesson] of Object.entries(LESSONS)) {
    assert.ok(moduleIds.has(lesson.module), `${lessonId} references missing module ${lesson.module}`);
    for (const skill of lesson.skills ?? []) {
      assert.ok(SKILLS[skill], `${lessonId} references missing skill ${skill}`);
    }
    for (const resource of lesson.resources ?? []) {
      assert.ok(DOCS[resource], `${lessonId} references missing resource ${resource}`);
    }
    for (const videoKey of lesson.videoKeys ?? []) {
      assert.ok(VIDEOS[videoKey], `${lessonId} references missing video group ${videoKey}`);
    }
  }

  for (const question of DIAGNOSTIC_QUESTIONS) {
    assert.ok(SKILLS[question.skill], `${question.id} references missing skill ${question.skill}`);
  }
  for (const [quizId, quiz] of Object.entries(QUIZZES)) {
    for (const question of quiz.questions ?? []) {
      assert.ok(SKILLS[question.skill], `${quizId} references missing skill ${question.skill}`);
    }
  }
});
