// Copy to src/profile.local.js (gitignored) to pre-fill your own build.
// `npm run build` then also writes private/artifact.html with this profile baked in.
// Indexes refer to the option order in INTAKE and DIAGNOSTIC_QUESTIONS (src/content.js).
window.PRESET_PROFILE = {
  name: "Your name",
  intake: { review: 0, background: [0, 1], goal: [0] },
  diagnostic: { d1: 1, d2: 2, d3: 1, d4: 2, d5: 1, d6: 1, d7: 2, d8: 0 }
};
