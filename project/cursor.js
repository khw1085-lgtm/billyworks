(() => {
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
    <div class="user-cursor__label">Robert</div>
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

