const channels = [
  { title: "08/07/90", src: "videos/ireland1990.mp4" },
  { title: "06/07/96", src: "videos/shearer.mp4" },
  { title: "26/05/99", src: "videos/unitedbayern.mp4" },
  { title: "08/06/98", src: "videos/scotlandbrazil.mp4" },
  { title: "01/09/97", src: "videos/MOTD.mp4" }
];

const muteIndicator = document.querySelector(".mute-indicator");
const pauseIndicator = document.querySelector(".pause-indicator");

const tvWrapper = document.querySelector(".tv-wrapper");
const overlay = document.querySelector(".overlay");

const powerBtn = document.getElementById("powerBtn");
const channelUpBtn = document.getElementById("channelUpBtn");
const channelDownBtn = document.getElementById("channelDownBtn");
const muteBtn = document.getElementById("muteBtn");
const pauseBtn = document.getElementById("pauseBtn");
const remoteTop = document.querySelector(".remote-top");


let videoEl = null;
let tvOn = false;
let currentChannel = 0;
let isMuted = false;

/* ===== helpers ===== */

function createVideo() {
  videoEl = document.createElement("video");
  videoEl.className = "tv-video";
  videoEl.src = channels[currentChannel].src;
  videoEl.autoplay = true;
  videoEl.loop = true;
  videoEl.playsInline = true;
  videoEl.muted = isMuted;

  tvWrapper.prepend(videoEl);
}

function destroyVideo() {
  if (!videoEl) return;
  videoEl.pause();
  videoEl.remove();
  videoEl = null;
  overlay.innerHTML = "";
}

function loadChannel(index) {
  if (!videoEl) return;

  const ch = channels[index];
  videoEl.src = ch.src;
  videoEl.play();

  overlay.innerHTML = `
    <div class="channel-number">CH ${String(index + 1).padStart(2, "0")}</div>
    <div>${ch.title}</div>
  `;
}

/* ===== init ===== */

channelUpBtn.disabled = true;
channelDownBtn.disabled = true;
muteBtn.disabled = true;
pauseBtn.disabled = true;

powerBtn.addEventListener("click", () => {
  tvOn = !tvOn;

  if (tvOn) {
    // ===== TV ON =====
    createVideo();
    loadChannel(currentChannel);

    muteIndicator.style.display = "none";
    pauseIndicator.style.display = "none";

    channelUpBtn.disabled = false;
    channelDownBtn.disabled = false;
    muteBtn.disabled = false;
    pauseBtn.disabled = false;

    remoteTop.classList.add("on");

  } else {
    // ===== TV OFF =====
    destroyVideo();

    muteIndicator.style.display = "none";
    pauseIndicator.style.display = "none";

    channelUpBtn.disabled = true;
    channelDownBtn.disabled = true;
    muteBtn.disabled = true;
    pauseBtn.disabled = true;

    remoteTop.classList.remove("on");
  }
});

/* ===== channels ===== */

channelUpBtn.addEventListener("click", () => {
  if (!tvOn) return;
  currentChannel = (currentChannel + 1) % channels.length;
  loadChannel(currentChannel);
});

channelDownBtn.addEventListener("click", () => {
  if (!tvOn) return;
  currentChannel =
    (currentChannel - 1 + channels.length) % channels.length;
  loadChannel(currentChannel);
});

muteBtn.addEventListener("click", () => {
  if (!tvOn || !videoEl) return;

  isMuted = !isMuted;
  videoEl.muted = isMuted;

  muteIndicator.style.display = isMuted ? "block" : "none";
});


/* ===== pause ===== */
pauseBtn.addEventListener("click", () => {
  if (!tvOn || !videoEl) return;

  if (videoEl.paused) {
    videoEl.play();
    pauseIndicator.style.display = "none";
    pauseBtn.textContent = "⏸";
  } else {
    videoEl.pause();
    pauseIndicator.style.display = "flex";
    pauseBtn.textContent = "⏸";
  }
});
