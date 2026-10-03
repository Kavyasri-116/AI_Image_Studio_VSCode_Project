const promptInput = document.getElementById("prompt");
const styleInput = document.getElementById("style");
const ratioInput = document.getElementById("ratio");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const resultImage = document.getElementById("resultImage");
const emptyState = document.getElementById("emptyState");
const canvasWrap = document.getElementById("canvasWrap");

let currentUrl = "";

function escapeXml(text) {
  return text.replace(/[<>&'"]/g, c => ({
    "<":"&lt;", ">":"&gt;", "&":"&amp;", "'":"&apos;", '"':"&quot;"
  }[c]));
}

function createSvg(prompt, style) {
  const palettes = {
    "Digital Art":["#7c3aed","#06b6d4","#ec4899"],
    "Realistic":["#0f766e","#f59e0b","#1e293b"],
    "Anime":["#ec4899","#8b5cf6","#22d3ee"],
    "Watercolor":["#38bdf8","#a78bfa","#fb7185"],
    "Cyberpunk":["#ff0080","#00e5ff","#1d1147"]
  };
  const p = palettes[style];
  const safe = escapeXml(prompt.slice(0,90));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p[0]}"/><stop offset=".55" stop-color="${p[1]}"/><stop offset="1" stop-color="${p[2]}"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="45"/></filter>
  </defs>
  <rect width="1024" height="1024" fill="#070914"/>
  <circle cx="180" cy="190" r="210" fill="${p[0]}" opacity=".65" filter="url(#blur)"/>
  <circle cx="820" cy="270" r="250" fill="${p[1]}" opacity=".5" filter="url(#blur)"/>
  <circle cx="540" cy="820" r="310" fill="${p[2]}" opacity=".45" filter="url(#blur)"/>
  <path d="M0 700 Q250 480 500 690 T1024 610 V1024 H0Z" fill="url(#g)" opacity=".72"/>
  <path d="M0 820 Q260 650 530 820 T1024 760 V1024 H0Z" fill="#080b17" opacity=".72"/>
  <circle cx="780" cy="170" r="55" fill="#fff" opacity=".88"/>
  <circle cx="780" cy="170" r="95" fill="none" stroke="#fff" opacity=".16" stroke-width="3"/>
  <text x="55" y="110" fill="#ffffff" font-size="26" font-family="Arial" font-weight="700">AI IMAGE STUDIO</text>
  <text x="55" y="930" fill="#ffffff" font-size="30" font-family="Arial" font-weight="700">${safe}</text>
  <text x="55" y="970" fill="#e5e7eb" font-size="18" font-family="Arial">${escapeXml(style)} • Browser Demo</text>
</svg>`;
}

generateBtn.addEventListener("click", () => {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    promptInput.focus();
    promptInput.placeholder = "Please describe the image first...";
    return;
  }

  generateBtn.textContent = "Generating...";
  generateBtn.disabled = true;

  setTimeout(() => {
    const svg = createSvg(prompt, styleInput.value);
    const blob = new Blob([svg], {type:"image/svg+xml"});
    currentUrl = URL.createObjectURL(blob);
    resultImage.src = currentUrl;
    resultImage.style.display = "block";
    emptyState.style.display = "none";
    downloadBtn.disabled = false;

    canvasWrap.className = "canvas-wrap " + ratioInput.value;
    generateBtn.textContent = "✦ Generate Image";
    generateBtn.disabled = false;
  }, 700);
});

downloadBtn.addEventListener("click", () => {
  if (!currentUrl) return;
  const a = document.createElement("a");
  a.href = currentUrl;
  a.download = "ai-generated-image.svg";
  a.click();
});