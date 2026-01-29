const asciiOutput = document.getElementById("ascii-output");
const textInput = document.getElementById("text-input");
const densityInput = document.getElementById("density");
const glowInput = document.getElementById("glow");
const copyButton = document.getElementById("copy");
const canvas = document.getElementById("ascii-canvas");
const ctx = canvas.getContext("2d");

const densityChars = "@#W$9876543210?!abc;:+=-,._ ";

function renderAscii() {
  const text = textInput.value.trim() || "Cyber signal online";
  const density = Number(densityInput.value);
  const glow = Number(glowInput.value);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0a0f1c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `bold ${density * 4}px Orbitron, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#7bf7ff";
  ctx.shadowColor = "rgba(255, 68, 170, 0.9)";
  ctx.shadowBlur = glow;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width - 24);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;
  const step = Math.max(4, Math.floor(density * 0.6));
  let ascii = "";

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const index = (y * width + x) * 4;
      const [r, g, b] = data.slice(index, index + 3);
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      const charIndex = Math.floor(luminance * (densityChars.length - 1));
      ascii += densityChars[charIndex];
    }
    ascii += "\n";
  }

  asciiOutput.textContent = ascii;
  asciiOutput.style.textShadow = `0 0 ${glow}px rgba(34, 240, 255, 0.65)`;
}

function copyAscii() {
  const text = asciiOutput.textContent;
  navigator.clipboard.writeText(text).then(() => {
    copyButton.textContent = "Copied";
    setTimeout(() => {
      copyButton.textContent = "Copy";
    }, 1400);
  });
}

textInput.addEventListener("input", renderAscii);
densityInput.addEventListener("input", renderAscii);
glowInput.addEventListener("input", renderAscii);
copyButton.addEventListener("click", copyAscii);

renderAscii();
