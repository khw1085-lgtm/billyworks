(() => {
  const canvas = document.querySelector(".works-globe");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dots = [];
  const latitudeLines = [];
  const longitudeLines = [];
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let rotation = -0.55;
  let animationFrame = 0;
  let lastTime = performance.now();

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const createPoints = () => {
    dots.length = 0;
    latitudeLines.length = 0;
    longitudeLines.length = 0;

    for (let latitude = -78; latitude <= 78; latitude += 7.5) {
      const line = [];
      const longitudeStep = 7.5 / Math.max(0.34, Math.cos(toRadians(latitude)));

      for (let longitude = -180; longitude < 180; longitude += longitudeStep) {
        dots.push({ latitude, longitude });
      }

      for (let longitude = -180; longitude <= 180; longitude += 4) {
        line.push({ latitude, longitude });
      }
      latitudeLines.push(line);
    }

    for (let longitude = -180; longitude < 180; longitude += 20) {
      const line = [];
      for (let latitude = -90; latitude <= 90; latitude += 3) {
        line.push({ latitude, longitude });
      }
      longitudeLines.push(line);
    }
  };

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const project = ({ latitude, longitude }, radius, centerX, centerY) => {
    const latitudeRadians = toRadians(latitude);
    const longitudeRadians = toRadians(longitude) + rotation;
    const cosine = Math.cos(latitudeRadians);
    const x = cosine * Math.sin(longitudeRadians);
    const y = Math.sin(latitudeRadians);
    const z = cosine * Math.cos(longitudeRadians);

    return {
      x: centerX + x * radius,
      y: centerY - y * radius,
      z,
    };
  };

  const drawGridLine = (points, radius, centerX, centerY) => {
    let drawing = false;
    context.beginPath();

    points.forEach((point) => {
      const projected = project(point, radius, centerX, centerY);
      if (projected.z <= 0) {
        drawing = false;
        return;
      }

      if (drawing) context.lineTo(projected.x, projected.y);
      else context.moveTo(projected.x, projected.y);
      drawing = true;
    });
    context.stroke();
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);

    const radius = Math.min(width * 0.34, height * 0.82);
    const centerX = width * 0.5;
    const centerY = height * 0.56;

    context.save();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 255, 255, 0.72)";
    context.fill();
    context.clip();

    context.lineWidth = 0.7;
    context.strokeStyle = "rgba(15, 91, 255, 0.18)";
    latitudeLines.forEach((line) => drawGridLine(line, radius, centerX, centerY));
    longitudeLines.forEach((line) => drawGridLine(line, radius, centerX, centerY));

    dots.forEach((dot) => {
      const projected = project(dot, radius, centerX, centerY);
      if (projected.z <= 0) return;

      const depth = 0.35 + projected.z * 0.65;
      context.beginPath();
      context.arc(projected.x, projected.y, 0.75 + depth * 0.7, 0, Math.PI * 2);
      context.fillStyle = `rgba(0, 36, 110, ${0.28 + depth * 0.52})`;
      context.fill();
    });
    context.restore();

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.lineWidth = 1.2;
    context.strokeStyle = "rgba(0, 0, 0, 0.7)";
    context.stroke();
  };

  const animate = (time) => {
    const elapsed = Math.min(32, time - lastTime);
    lastTime = time;
    rotation -= elapsed * 0.00012;
    draw();
    animationFrame = requestAnimationFrame(animate);
  };

  createPoints();
  resize();
  draw();

  const resizeObserver = new ResizeObserver(() => {
    resize();
    draw();
  });
  resizeObserver.observe(canvas);

  if (!reducedMotion) animationFrame = requestAnimationFrame(animate);

  window.addEventListener(
    "pagehide",
    () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    },
    { once: true },
  );
})();
