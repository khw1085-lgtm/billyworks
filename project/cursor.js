(() => {
  const progress = document.createElement("div");
  progress.className = "page-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);

  let progressValue = 0;
  let progressTimer = 0;
  let progressResetTimer = 0;

  const renderProgress = () => {
    progress.style.setProperty("--page-progress", progressValue.toFixed(3));
  };

  const startProgress = () => {
    window.clearInterval(progressTimer);
    window.clearTimeout(progressResetTimer);
    progressValue = Math.max(progressValue, 0.08);
    progress.classList.add("is-active");
    renderProgress();

    requestAnimationFrame(() => {
      progressValue = Math.max(progressValue, 0.2);
      renderProgress();
    });

    progressTimer = window.setInterval(() => {
      progressValue = Math.min(0.9, progressValue + (0.92 - progressValue) * 0.12);
      renderProgress();
    }, 180);
  };

  const finishProgress = () => {
    window.clearInterval(progressTimer);
    progressValue = 1;
    renderProgress();
    progressResetTimer = window.setTimeout(() => {
      progress.classList.remove("is-active");
      progressValue = 0;
      renderProgress();
    }, 220);
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (
      !link ||
      (event.defaultPrevented && !document.body.classList.contains("is-closing")) ||
      event.button > 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.target === "_blank" ||
      link.hasAttribute("download")
    ) {
      return;
    }

    const target = new URL(link.href, window.location.href);
    const isSameDocumentHash =
      target.origin === window.location.origin &&
      target.pathname === window.location.pathname &&
      target.search === window.location.search &&
      target.hash;

    if (target.origin === window.location.origin && !isSameDocumentHash) {
      startProgress();
    }
  });

  document.addEventListener("submit", startProgress);
  window.addEventListener("beforeunload", startProgress);
  window.addEventListener("pageshow", finishProgress);

  if (document.readyState === "complete") {
    finishProgress();
  } else {
    window.addEventListener("load", finishProgress, { once: true });
  }

  if (!window.matchMedia("(pointer: fine)").matches) return;

  const size = 31;
  const labelOffset = {
    x: size * 0.9,
    y: size * 0.2 + 6,
  };
  const pressScale = 0.92;
  const labelTiltStrength = 25;

  const cursor = document.createElement("div");
  cursor.className = "user-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = `
    <div class="user-cursor__label">billy</div>
    <div class="user-cursor__arrow">
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5 3 L23 14 L14 16 L11 24 Z"
          fill="#fff"
          stroke="rgba(0,0,0,0.36)"
          stroke-width="0.8"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  `;
  document.body.append(cursor);

  const arrow = cursor.querySelector(".user-cursor__arrow");
  const label = cursor.querySelector(".user-cursor__label");
  const pointer = { x: -9999, y: -9999 };
  const arrowPosition = { x: -9999, y: -9999 };
  const labelPosition = { x: -9999, y: -9999 };
  let scale = 1;
  let scaleTarget = 1;
  let rotation = 0;
  let rotationTarget = 0;
  let lastSample = null;

  const follow = (current, target, strength) =>
    current + (target - current) * strength;

  const render = () => {
    arrowPosition.x = follow(arrowPosition.x, pointer.x, 0.34);
    arrowPosition.y = follow(arrowPosition.y, pointer.y, 0.34);
    labelPosition.x = follow(labelPosition.x, pointer.x, 0.2);
    labelPosition.y = follow(labelPosition.y, pointer.y, 0.2);
    scale = follow(scale, scaleTarget, 0.28);
    rotation = follow(rotation, rotationTarget, 0.2);

    arrow.style.transform = `translate3d(${arrowPosition.x}px, ${arrowPosition.y}px, 0) scale(${scale})`;
    label.style.transform = `translate3d(${labelPosition.x + labelOffset.x}px, ${
      labelPosition.y + labelOffset.y
    }px, 0) rotate(${rotation}deg) scale(${scale})`;

    window.requestAnimationFrame(render);
  };

  window.addEventListener("mousemove", (event) => {
    const now = performance.now();
    let velocityX = 0;
    let velocityY = 0;

    if (lastSample) {
      const elapsed = Math.max(1, now - lastSample.time);
      velocityX = ((event.clientX - lastSample.x) / elapsed) * 1000;
      velocityY = ((event.clientY - lastSample.y) / elapsed) * 1000;
    } else {
      arrowPosition.x = event.clientX;
      arrowPosition.y = event.clientY;
      labelPosition.x = event.clientX;
      labelPosition.y = event.clientY;
    }

    pointer.x = event.clientX;
    pointer.y = event.clientY;
    lastSample = { x: event.clientX, y: event.clientY, time: now };

    const speed = Math.hypot(velocityX, velocityY);
    const direction = velocityX === 0 ? 0 : Math.sign(velocityX);
    rotationTarget =
      direction * Math.min(1, speed / 1500) * labelTiltStrength;
    cursor.classList.add("is-visible");
  });

  window.addEventListener("mousedown", () => {
    scaleTarget = pressScale;
  });

  window.addEventListener("mouseup", () => {
    scaleTarget = 1;
  });

  document.documentElement.addEventListener("mouseleave", () => {
    cursor.classList.remove("is-visible");
    rotationTarget = 0;
    lastSample = null;
  });

  window.addEventListener("blur", () => {
    cursor.classList.remove("is-visible");
    scaleTarget = 1;
  });

  render();
})();
