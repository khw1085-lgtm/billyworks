(() => {
  const processSteps = [
    {
      number: "1",
      title: "onboarding",
      description:
        "We gather requirements, align on goals, and quickly prepare a clear proposal with scope, timeline, and deliverables.",
      icon: "onboarding",
    },
    {
      number: "2",
      title: "model",
      description:
        "We work in a flexible monthly or project-based model, depending on what best fits the engagement.",
      icon: "model",
    },
    {
      number: "3",
      title: "sprints",
      description:
        "We iterate in focused sprints, review frequently, and share progress so everyone stays aligned.",
      icon: "sprints",
    },
    {
      number: "4",
      title: "handoff",
      description:
        "We document the work clearly and support the transition so the team can move forward with confidence.",
      icon: "handoff",
    },
  ];

  const lineIcons = {
    onboarding: `
      <svg class="process-step__icon" viewBox="0 0 360 300" aria-hidden="true">
        <path pathLength="1" d="M18 274V166c0-70 42-124 101-124s101 54 101 124v108" />
        <path pathLength="1" d="M72 274V173c0-45 26-79 63-79s63 34 63 79v101" />
        <path pathLength="1" d="M142 274V154c0-61 37-108 89-108s89 47 89 108v120" />
      </svg>`,
    model: `
      <svg class="process-step__icon" viewBox="0 0 360 300" aria-hidden="true">
        <circle pathLength="1" cx="116" cy="178" r="92" />
        <circle pathLength="1" cx="180" cy="124" r="92" />
        <circle pathLength="1" cx="244" cy="178" r="92" />
        <circle pathLength="1" cx="180" cy="215" r="68" />
      </svg>`,
    sprints: `
      <svg class="process-step__icon" viewBox="0 0 360 300" aria-hidden="true">
        <path pathLength="1" d="M18 252C70 252 77 57 134 57s45 195 102 195 52-195 106-195" />
        <path pathLength="1" d="M18 216c45 0 59-122 102-122s53 122 98 122 57-122 124-122" />
        <path pathLength="1" d="M18 278h324" />
      </svg>`,
    handoff: `
      <svg class="process-step__icon" viewBox="0 0 360 300" aria-hidden="true">
        <path pathLength="1" d="M180 278C42 231 41 91 63 28c83 20 130 87 117 250Z" />
        <path pathLength="1" d="M180 278C318 231 319 91 297 28c-83 20-130 87-117 250Z" />
        <path pathLength="1" d="M180 278V78" />
        <path pathLength="1" d="M180 207c-36-49-71-83-106-102" />
        <path pathLength="1" d="M180 207c36-49 71-83 106-102" />
      </svg>`,
  };

  const section = document.querySelector("[data-process-section]");
  const grid = document.querySelector("[data-process-grid]");
  if (!section || !grid) return;

  grid.innerHTML = processSteps
    .map(
      (step, index) => `
        <article class="process-step" style="--step-index: ${index}">
          <div class="process-step__content">
            <span class="process-step__number" aria-hidden="true">${step.number}</span>
            <h3 class="process-step__title">${step.title}</h3>
            <p class="process-step__description">${step.description}</p>
          </div>
          <div class="process-step__art">${lineIcons[step.icon]}</div>
        </article>
      `,
    )
    .join("");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) {
    section.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting) return;
      section.classList.add("is-visible");
      observer.disconnect();
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  observer.observe(section);
})();
