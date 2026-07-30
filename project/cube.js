(() => {
  const container = document.querySelector(".request-cube");
  if (!container) return;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return;

  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.cursor = "grab";
  canvas.style.touchAction = "none";
  container.append(canvas);

  const grid = 3;
  const dotsPerFace = 4;
  const totalPoints = (grid - 1) * dotsPerFace + 1;
  const points = [];
  const projected = [];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 1;
  let height = 1;
  let pixelRatio = 1;
  let rotationX = 0.5;
  let rotationY = 0.6;
  let rotationZ = 0;
  let activeTurn = null;
  let turnStartedAt = 0;
  let dragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let animationFrame = 0;
  let lastFrameAt = performance.now();

  const lattice = (index) => -1 + (2 * index) / (totalPoints - 1);
  const snap = (coordinate) => {
    const index = Math.round(((coordinate + 1) / 2) * (totalPoints - 1));
    return lattice(Math.max(0, Math.min(totalPoints - 1, index)));
  };
  const band = (coordinate) =>
    Math.max(0, Math.min(grid - 1, Math.floor(((coordinate + 1) / 2) * grid)));

  for (let x = 0; x < totalPoints; x += 1) {
    for (let y = 0; y < totalPoints; y += 1) {
      for (let z = 0; z < totalPoints; z += 1) {
        const onShell =
          x === 0 ||
          x === totalPoints - 1 ||
          y === 0 ||
          y === totalPoints - 1 ||
          z === 0 ||
          z === totalPoints - 1;
        if (onShell) points.push({ x: lattice(x), y: lattice(y), z: lattice(z) });
      }
    }
  }

  const rotateAxis = (point, axis, angle) => {
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const { x, y, z } = point;

    if (axis === 0) {
      return { x, y: y * cosine - z * sine, z: y * sine + z * cosine };
    }
    if (axis === 1) {
      return { x: x * cosine + z * sine, y, z: -x * sine + z * cosine };
    }
    return { x: x * cosine - y * sine, y: x * sine + y * cosine, z };
  };

  const startTurn = () => {
    activeTurn = {
      axis: Math.floor(Math.random() * 3),
      layer: Math.floor(Math.random() * grid),
      direction: Math.random() < 0.5 ? -1 : 1,
    };
    turnStartedAt = performance.now();
  };

  const finishTurn = () => {
    if (!activeTurn) return;
    const angle = activeTurn.direction * (Math.PI / 2);

    points.forEach((point) => {
      const coordinate =
        activeTurn.axis === 0 ? point.x : activeTurn.axis === 1 ? point.y : point.z;
      if (band(coordinate) !== activeTurn.layer) return;
      const rotated = rotateAxis(point, activeTurn.axis, angle);
      point.x = snap(rotated.x);
      point.y = snap(rotated.y);
      point.z = snap(rotated.z);
    });
    activeTurn = null;
  };

  const resize = () => {
    const bounds = container.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
  };

  const render = (time) => {
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);

    const elapsed = Math.min(0.05, Math.max(0, (time - lastFrameAt) / 1000));
    lastFrameAt = time;
    if (!dragging && !reducedMotion) {
      rotationX += 2 * 0.06 * elapsed;
      rotationY += 5 * 0.06 * elapsed;
    }

    if (!activeTurn && !reducedMotion) startTurn();
    const rawProgress = activeTurn ? Math.min(1, (time - turnStartedAt) / 1150) : 0;
    const turnProgress = 1 - Math.pow(1 - rawProgress, 3);
    const turnAngle = activeTurn
      ? activeTurn.direction * (Math.PI / 2) * turnProgress
      : 0;

    const cosineX = Math.cos(rotationX);
    const sineX = Math.sin(rotationX);
    const cosineY = Math.cos(rotationY);
    const sineY = Math.sin(rotationY);
    const cosineZ = Math.cos(rotationZ);
    const sineZ = Math.sin(rotationZ);
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) * 0.26;

    projected.length = 0;
    points.forEach((sourcePoint) => {
      let point = sourcePoint;
      if (activeTurn) {
        const coordinate =
          activeTurn.axis === 0
            ? sourcePoint.x
            : activeTurn.axis === 1
              ? sourcePoint.y
              : sourcePoint.z;
        if (band(coordinate) === activeTurn.layer) {
          point = rotateAxis(sourcePoint, activeTurn.axis, turnAngle);
        }
      }

      const y1 = point.y * cosineX - point.z * sineX;
      const z1 = point.y * sineX + point.z * cosineX;
      const x2 = point.x * cosineY + z1 * sineY;
      const z2 = -point.x * sineY + z1 * cosineY;
      const x3 = x2 * cosineZ - y1 * sineZ;
      const y3 = x2 * sineZ + y1 * cosineZ;
      const perspective = 1 + z2 * 0.16;

      projected.push({
        x: centerX + x3 * scale * perspective,
        y: centerY - y3 * scale * perspective,
        depth: z2,
      });
    });

    projected.sort((a, b) => a.depth - b.depth);
    context.fillStyle = "#fff";
    projected.forEach((point) => {
      const depth = Math.max(0, Math.min(1, (point.depth + Math.sqrt(3)) / (2 * Math.sqrt(3))));
      context.globalAlpha = 0.22 + 0.78 * depth;
      context.beginPath();
      context.arc(point.x, point.y, 1 + depth * 1.4, 0, Math.PI * 2);
      context.fill();
    });
    context.globalAlpha = 1;

    if (activeTurn && rawProgress >= 1) finishTurn();
  };

  const animate = (time) => {
    render(time);
    animationFrame = requestAnimationFrame(animate);
  };

  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    canvas.style.cursor = "grabbing";
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    rotationY += (event.clientX - lastPointerX) * 0.008;
    rotationX += (event.clientY - lastPointerY) * 0.008;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
  });

  const stopDragging = () => {
    dragging = false;
    canvas.style.cursor = "grab";
  };
  canvas.addEventListener("pointerup", stopDragging);
  canvas.addEventListener("pointercancel", stopDragging);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();
  if (reducedMotion) render(performance.now());
  else animationFrame = requestAnimationFrame(animate);

  window.addEventListener(
    "pagehide",
    () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    },
    { once: true },
  );
})();
