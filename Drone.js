const canvas = document.getElementById('droneCanvas');
const ctx = canvas.getContext('2d');

// Physics params
let z = 0, v = 0;
let g = 9.81, drag = 0.1;
let m = 1;
let dt = 0.016;
let integral = 0;
let prevError = 0;

// UI elements
let KpSlider = document.getElementById('kp');
let KiSlider = document.getElementById('ki');
let KdSlider = document.getElementById('kd');
let setSlider = document.getElementById('set');

function updateLabels() {
  document.getElementById('kpVal').textContent = KpSlider.value;
  document.getElementById('kiVal').textContent = KiSlider.value;
  document.getElementById('kdVal').textContent = KdSlider.value;
  document.getElementById('setVal').textContent = setSlider.value;
}

function loop() {
  updateLabels();

  let Kp = parseFloat(KpSlider.value);
  let Ki = parseFloat(KiSlider.value);
  let Kd = parseFloat(KdSlider.value);
  let setpoint = parseFloat(setSlider.value);

  let error = setpoint - z;
  integral += error * dt;
  let derivative = (error - prevError) / dt;

  let u = Kp * error + Ki * integral + Kd * derivative;
  let a = (-m * g + u - drag * v) / m;

  v += a * dt;
  z += v * dt;

  if (z < 0) { z = 0; v = 0; }
  prevError = error;

  drawDrone(z, setpoint);
  requestAnimationFrame(loop);
}

function drawDrone(zMeters, setpoint) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let y = canvas.height - (zMeters * 100) - 50;
  let ySet = canvas.height - (setpoint * 100) - 50;

  ctx.strokeStyle = 'red';
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(0, ySet);
  ctx.lineTo(canvas.width, ySet);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = 'blue';
  ctx.fillRect(canvas.width / 2 - 25, y, 50, 20);
}

loop();
