(() => {
  const words = [
    "design.",
    "prototype.",
    "solve.",
    "build.",
    "develop.",
    "refine.",
    "launch.",
  ];

  const section = document.querySelector("[data-scroll-word-section]");
  const stage = document.querySelector("[data-scroll-word-stage]");
  if (!section || !stage) return;

  section.style.setProperty("--word-count", String(words.length));
  stage.innerHTML = `
    <div class="scroll-word-stage__inner">
      <p class="scroll-word-stage__lead" aria-hidden="true">we can&nbsp;</p>
      <ul class="scroll-word-stage__list" aria-hidden="true">
        ${words.map((word) => `<li class="scroll-word-stage__item">${word}</li>`).join("")}
      </ul>
    </div>
  `;
})();
