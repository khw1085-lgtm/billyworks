(() => {
  const stage = document.querySelector(".dot-scatter");
  if (!stage) return;

  const canvas = stage.querySelector("canvas");
  const context = canvas.getContext("2d");
  const text = stage.dataset.text || "BILLYWORKS";
  const cursorRadius = Number(stage.dataset.cursorRadius) || 115;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: -9999, y: -9999, active: false };
  let particles = [];
  let width = 0;
  let height = 0;
  let ratio = 1;
  let frame = 0;

  const makeParticles = () => {
    const sample = document.createElement("canvas");
    const sampleContext = sample.getContext("2d", { willReadFrequently: true });
    const fontSize = Math.min(270, width * 0.15);
    const font = `800 ${fontSize}px Inter, Arial, sans-serif`;

    sample.width = Math.max(1, Math.round(width));
    sample.height = Math.max(1, Math.round(height));
    sampleContext.font = font;
    sampleContext.textAlign = "center";
    sampleContext.textBaseline = "middle";
    sampleContext.fillStyle = "#fff";
    sampleContext.fillText(text, width / 2, height / 2 + fontSize * 0.03);

    const pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data;
    const step = Math.max(5, Math.round(fontSize / 34));
    const dotSize = Math.max(3, step * 0.7);
    const next = [];

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        if (pixels[(Math.floor(y) * sample.width + Math.floor(x)) * 4 + 3] < 90) continue;
        next.push({
          homeX: x,
          homeY: y,
          x,
          y,
          vx: 0,
          vy: 0,
          size: dotSize,
        });
      }
    }
    particles = next;
  };

  const resize = () => {
    const bounds = stage.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    makeParticles();
  };

  const render = () => {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "rgba(255, 255, 255, 0.2)";

    particles.forEach((particle) => {
      if (!reducedMotion) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;

        if (pointer.active && distance < cursorRadius) {
          const force = (1 - distance / cursorRadius) * 1.8;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }

        particle.vx += (particle.homeX - particle.x) * 0.035;
        particle.vy += (particle.homeY - particle.y) * 0.035;
        particle.vx *= 0.84;
        particle.vy *= 0.84;
        particle.x += particle.vx;
        particle.y += particle.vy;
      }

      const radius = particle.size / 2;
      context.beginPath();
      context.roundRect(
        particle.x - radius,
        particle.y - radius,
        particle.size,
        particle.size,
        radius,
      );
      context.fill();
    });

    frame = requestAnimationFrame(render);
  };

  const updatePointer = (event) => {
    const bounds = stage.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
  };

  stage.addEventListener("pointerenter", updatePointer);
  stage.addEventListener("pointermove", updatePointer);
  stage.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  resize();
  cancelAnimationFrame(frame);
  render();
})();
