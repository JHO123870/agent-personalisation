/* Personalise Your Agents — prototype flow logic */

const state = {
  name: "",
  avatar: "🐼",
  avatarImage: null, // data-URL when the user uploads their own
  tone: "polished",
  personalised: false,
  // Avatar upload: "upload" (Figma 03 Avatar default) | "change" | "crop"
  uploadStep: "upload",
};

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const CROP_VIEW_W = 320;
const CROP_VIEW_H = 200;
const CROP_CIRCLE = 140;
const CROP_EXPORT = 256;

/* ---------- Elements ---------- */
const scrim = document.getElementById("scrim");
const chatLayer = document.getElementById("chatLayer");
const protoNav = document.getElementById("protoNav");
const modals = {
  welcome: document.getElementById("modal-welcome"),
  name: document.getElementById("modal-name"),
  avatar: document.getElementById("modal-avatar"),
  tone: document.getElementById("modal-tone"),
  confirm: document.getElementById("modal-confirm"),
  crop: document.getElementById("modal-crop"),
};

let countdownTimer = null;

/* ---------- Screen switching ---------- */
function showScreen(screen) {
  clearInterval(countdownTimer);
  Object.values(modals).forEach((m) => (m.hidden = true));

  const isChat = screen === "chat" || screen === "chat-unset";
  chatLayer.hidden = !isChat;
  scrim.classList.toggle("visible", !isChat);

  if (isChat) {
    renderChatAvatar(screen === "chat-unset");
  } else if (screen === "crop") {
    modals.crop.hidden = false;
  } else {
    modals[screen].hidden = false;
    if (screen === "confirm") startConfirmation();
    if (screen === "tone") syncSliderFills();
    if (screen === "avatar") syncUploadPanels();
  }

  // The screen switcher only appears once personalisation is set up
  // (the final personalised chat frame).
  protoNav.hidden = !(screen === "chat" && state.personalised);

  document.querySelectorAll(".proto-nav button").forEach((b) => {
    b.classList.toggle("current", b.dataset.screen === screen);
  });
}

function renderChatAvatar(unset) {
  // 08 shows the generic silhouette; 06 shows the chosen avatar
  // (falls back to the panda when navigating directly).
  document.getElementById("chatAvatar").hidden = unset;
  document.getElementById("chatAvatarGeneric").hidden = !unset;
  applyAvatar(
    document.getElementById("chatAvatar"),
    document.getElementById("chatAvatarEmoji")
  );
}

function applyAvatar(itemEl, emojiEl) {
  if (state.avatarImage) {
    itemEl.style.backgroundImage = `url(${state.avatarImage})`;
    emojiEl.style.visibility = "hidden";
  } else {
    itemEl.style.backgroundImage = "";
    emojiEl.style.visibility = "visible";
    emojiEl.textContent = state.avatar;
  }
}

/* ---------- 01 Welcome ---------- */
document.getElementById("getStartedBtn").addEventListener("click", () => showScreen("name"));

/* ---------- 02 Name ---------- */
const nameInput = document.getElementById("nameInput");
const charCount = document.getElementById("charCount");
const nameError = document.getElementById("nameError");
const nameContinueBtn = document.querySelector('[data-continue="name"]');

// Valid: 2-20 chars, alphanumeric + spaces only.
function isValidName(value) {
  const trimmed = value.trim();
  return trimmed.length >= 2 && trimmed.length <= 20 && /^[A-Za-z0-9 ]+$/.test(trimmed);
}

nameInput.addEventListener("input", () => {
  const length = nameInput.value.length;
  charCount.textContent = `${length}/20`;
  charCount.classList.toggle("at-max", length >= 20);

  const valid = isValidName(nameInput.value);
  nameContinueBtn.disabled = !valid;
  nameError.hidden = valid || length === 0;
});

/* ---------- 03 Avatar + upload sub-flow ---------- */
const avatarList = document.getElementById("avatarList");
const uploadInput = document.getElementById("uploadInput");
const uploadError = document.getElementById("uploadError");
const uploadPanelOwn = document.getElementById("uploadPanelOwn");
const uploadPanelChange = document.getElementById("uploadPanelChange");
const customAvatarItem = document.getElementById("customAvatarItem");

const cropImage = document.getElementById("cropImage");
const cropViewport = document.getElementById("cropViewport");
const cropZoom = document.getElementById("cropZoom");

const cropState = {
  src: null,
  naturalW: 0,
  naturalH: 0,
  baseScale: 1,
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  dragging: false,
  lastX: 0,
  lastY: 0,
};

function clearAvatarSelection() {
  avatarList.querySelectorAll(".avatar-item").forEach((a) => a.classList.remove("selected"));
}

function selectPreset(emoji) {
  clearAvatarSelection();
  const item = avatarList.querySelector(`[data-emoji="${emoji}"]`);
  if (item) item.classList.add("selected");
  state.avatar = emoji;
  state.avatarImage = null;
  state.uploadStep = "upload";
  syncUploadPanels();
}

function selectCustomAvatar() {
  if (!state.avatarImage) return;
  clearAvatarSelection();
  customAvatarItem.classList.add("selected");
  state.uploadStep = "change";
  syncUploadPanels();
}

function syncUploadPanels() {
  // Default = Figma 03 Avatar (upload panel with helper text).
  // After a successful crop, show 03 Change.
  state.uploadStep = state.avatarImage ? "change" : "upload";

  const active = state.uploadStep;
  modals.avatar.dataset.uploadStep = active;

  uploadPanelOwn.hidden = active !== "upload";
  uploadPanelChange.hidden = active !== "change";

  if (active === "change" && state.avatarImage) {
    customAvatarItem.hidden = false;
    customAvatarItem.style.backgroundImage = `url(${state.avatarImage})`;
    clearAvatarSelection();
    customAvatarItem.classList.add("selected");
    // Keep the custom slot visible at the start of the scrollable row.
    requestAnimationFrame(() => {
      avatarList.scrollLeft = 0;
    });
  } else {
    customAvatarItem.hidden = true;
    customAvatarItem.style.backgroundImage = "";
    customAvatarItem.classList.remove("selected");
  }

  uploadError.hidden = true;
  uploadError.textContent = "";
}

function openFilePicker() {
  uploadError.hidden = true;
  uploadError.textContent = "";
  uploadInput.value = "";
  uploadInput.click();
}

function showUploadError(message) {
  state.uploadStep = "upload";
  syncUploadPanels();
  uploadError.textContent = message;
  uploadError.hidden = false;
  modals.avatar.hidden = false;
  modals.crop.hidden = true;
}

avatarList.addEventListener("click", (e) => {
  const item = e.target.closest(".avatar-item");
  if (!item) return;
  if (item.dataset.custom !== undefined) {
    selectCustomAvatar();
    return;
  }
  selectPreset(item.dataset.emoji);
});

document.getElementById("uploadPickBtn").addEventListener("click", openFilePicker);
document.getElementById("uploadChangeBtn").addEventListener("click", openFilePicker);

uploadInput.addEventListener("change", () => {
  const file = uploadInput.files[0];
  if (!file) return;

  const type = (file.type || "").toLowerCase();
  if (type !== "image/png" && type !== "image/jpeg") {
    showUploadError("Please choose a PNG or JPG image.");
    return;
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    showUploadError("Image must be 5 MB or smaller.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => openCropModal(reader.result);
  reader.readAsDataURL(file);
});

/* ---------- Crop modal ---------- */
function openCropModal(src) {
  const img = new Image();
  img.onload = () => {
    cropState.src = src;
    cropState.naturalW = img.naturalWidth;
    cropState.naturalH = img.naturalHeight;
    // Cover the circular crop area at minimum zoom.
    cropState.baseScale = Math.max(
      CROP_CIRCLE / cropState.naturalW,
      CROP_CIRCLE / cropState.naturalH
    );
    cropState.zoom = 1;
    cropState.offsetX = 0;
    cropState.offsetY = 0;
    cropZoom.value = "1";
    syncSliderFill(cropZoom);
    cropImage.src = src;
    applyCropTransform();
    state.uploadStep = "crop";
    showScreen("crop");
  };
  img.src = src;
}

function currentScale() {
  return cropState.baseScale * cropState.zoom;
}

function clampCropOffsets() {
  const scale = currentScale();
  const displayW = cropState.naturalW * scale;
  const displayH = cropState.naturalH * scale;
  const maxX = Math.max(0, (displayW - CROP_CIRCLE) / 2);
  const maxY = Math.max(0, (displayH - CROP_CIRCLE) / 2);
  cropState.offsetX = Math.min(maxX, Math.max(-maxX, cropState.offsetX));
  cropState.offsetY = Math.min(maxY, Math.max(-maxY, cropState.offsetY));
}

function applyCropTransform() {
  clampCropOffsets();
  const scale = currentScale();
  const displayW = cropState.naturalW * scale;
  const displayH = cropState.naturalH * scale;
  cropImage.style.width = `${displayW}px`;
  cropImage.style.height = `${displayH}px`;
  cropImage.style.transform = `translate(calc(-50% + ${cropState.offsetX}px), calc(-50% + ${cropState.offsetY}px))`;
}

function exportCroppedAvatar() {
  const scale = currentScale();
  const canvas = document.createElement("canvas");
  canvas.width = CROP_EXPORT;
  canvas.height = CROP_EXPORT;
  const ctx = canvas.getContext("2d");

  // Map the circular viewport region back into source image pixels.
  const srcSize = CROP_CIRCLE / scale;
  const srcCenterX = cropState.naturalW / 2 - cropState.offsetX / scale;
  const srcCenterY = cropState.naturalH / 2 - cropState.offsetY / scale;
  const sx = srcCenterX - srcSize / 2;
  const sy = srcCenterY - srcSize / 2;

  ctx.beginPath();
  ctx.arc(CROP_EXPORT / 2, CROP_EXPORT / 2, CROP_EXPORT / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(cropImage, sx, sy, srcSize, srcSize, 0, 0, CROP_EXPORT, CROP_EXPORT);
  return canvas.toDataURL("image/png");
}

function closeCropToUpload() {
  cropState.src = null;
  cropImage.removeAttribute("src");
  state.uploadStep = state.avatarImage ? "change" : "upload";
  showScreen("avatar");
}

document.getElementById("cropCancelBtn").addEventListener("click", closeCropToUpload);

document.getElementById("cropUseBtn").addEventListener("click", () => {
  if (!cropState.src) return;
  state.avatarImage = exportCroppedAvatar();
  state.uploadStep = "change";
  cropState.src = null;
  cropImage.removeAttribute("src");
  showScreen("avatar");
});

cropZoom.addEventListener("input", () => {
  cropState.zoom = Number(cropZoom.value);
  syncSliderFill(cropZoom);
  applyCropTransform();
});

document.getElementById("cropZoomOut").addEventListener("click", () => {
  cropZoom.value = String(Math.max(1, Number(cropZoom.value) - 0.1));
  cropZoom.dispatchEvent(new Event("input"));
});

document.getElementById("cropZoomIn").addEventListener("click", () => {
  cropZoom.value = String(Math.min(3, Number(cropZoom.value) + 0.1));
  cropZoom.dispatchEvent(new Event("input"));
});

cropViewport.addEventListener("pointerdown", (e) => {
  if (!cropState.src) return;
  cropState.dragging = true;
  cropState.lastX = e.clientX;
  cropState.lastY = e.clientY;
  cropViewport.classList.add("dragging");
  cropViewport.setPointerCapture(e.pointerId);
});

cropViewport.addEventListener("pointermove", (e) => {
  if (!cropState.dragging) return;
  cropState.offsetX += e.clientX - cropState.lastX;
  cropState.offsetY += e.clientY - cropState.lastY;
  cropState.lastX = e.clientX;
  cropState.lastY = e.clientY;
  applyCropTransform();
});

function endCropDrag(e) {
  if (!cropState.dragging) return;
  cropState.dragging = false;
  cropViewport.classList.remove("dragging");
  try {
    cropViewport.releasePointerCapture(e.pointerId);
  } catch {
    /* already released */
  }
}

cropViewport.addEventListener("pointerup", endCropDrag);
cropViewport.addEventListener("pointercancel", endCropDrag);

// Pinch-to-zoom on trackpads / touch (optional enhancement from Figma copy).
cropViewport.addEventListener(
  "wheel",
  (e) => {
    if (!cropState.src) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    cropZoom.value = String(Math.min(3, Math.max(1, Number(cropZoom.value) + delta)));
    cropZoom.dispatchEvent(new Event("input"));
  },
  { passive: false }
);

/* ---------- 04 Tone ---------- */
const tonePresets = document.getElementById("tonePresets");
const TONE_SLIDERS = {
  polished: { formal: 45, upbeat: 30, empathetic: 10 },
  polite: { formal: 65, upbeat: 65, empathetic: 60 },
  bold: { formal: 90, upbeat: 5, empathetic: 90 },
};

tonePresets.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  tonePresets.querySelectorAll(".chip").forEach((c) => c.classList.remove("selected"));
  chip.classList.add("selected");
  state.tone = chip.dataset.tone;
  const values = TONE_SLIDERS[state.tone];
  document.getElementById("sliderFormal").value = values.formal;
  document.getElementById("sliderUpbeat").value = values.upbeat;
  document.getElementById("sliderEmpathetic").value = values.empathetic;
  syncSliderFills();
});

/* ---------- Slider fill (Figma: accent-subtle left of thumb) ---------- */
function syncSliderFill(slider) {
  const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.setProperty("--fill", `${pct}%`);
}

function syncSliderFills() {
  document.querySelectorAll(".tone-slider").forEach(syncSliderFill);
}

syncSliderFills();

/* ---------- 05 Confirmation ---------- */
function startConfirmation() {
  state.personalised = true;
  // Omit the name when it is still the "Assistant" default (or unset).
  const hasCustomName = state.name && state.name !== "Assistant";
  document.getElementById("confirmLine").textContent = hasCustomName
    ? `Say hi to your ${state.tone} assistant ${state.name}!`
    : `Say hi to your ${state.tone} assistant!`;
  applyAvatar(
    document.getElementById("confirmAvatar"),
    document.getElementById("confirmAvatarEmoji")
  );

  let remaining = 5;
  const countdownEl = document.getElementById("countdown");
  countdownEl.textContent = remaining;
  countdownTimer = setInterval(() => {
    remaining -= 1;
    countdownEl.textContent = remaining;
    if (remaining <= 0) showScreen("chat");
  }, 1000);
}

/* ---------- Shared modal wiring ---------- */
const FLOW_NEXT = { name: "avatar", avatar: "tone", tone: "confirm" };

document.querySelectorAll("[data-continue]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const step = btn.dataset.continue;
    if (step === "name") {
      if (!isValidName(nameInput.value)) {
        nameError.hidden = false;
        return;
      }
      state.name = nameInput.value.trim();
    }
    showScreen(FLOW_NEXT[step]);
  });
});

// Skipping (or closing) at any step lands on frame 08 — the
// not-set-up chat. Clicking its avatar resumes the setup.
document.querySelectorAll("[data-skip]").forEach((btn) => {
  btn.addEventListener("click", () => showScreen("chat-unset"));
});

document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => {
    showScreen(state.personalised ? "chat" : "chat-unset");
  });
});

/* ---------- 08 → resume setup via the avatar ---------- */
document.getElementById("chatAvatarGeneric").addEventListener("click", () => {
  showScreen("name");
});

/* ---------- Draggable window (fun extra) ---------- */
const windowEl = document.getElementById("window");
const desktopEl = document.querySelector(".desktop");
const navbarEl = windowEl.querySelector(".navbar");

navbarEl.addEventListener("pointerdown", (e) => {
  // Don't start a drag from the traffic lights or sidebar button.
  if (e.target.closest("button")) return;

  const rect = windowEl.getBoundingClientRect();
  const desktopRect = desktopEl.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;

  // Pin the current position (desktop-relative) before dropping the
  // centering translate, otherwise the window would jump.
  windowEl.style.left = `${rect.left - desktopRect.left}px`;
  windowEl.style.top = `${rect.top - desktopRect.top}px`;
  windowEl.classList.add("dragged");
  navbarEl.classList.add("dragging");
  try {
    navbarEl.setPointerCapture(e.pointerId);
  } catch {
    /* pointer capture unavailable (e.g. synthetic events) — drag still works */
  }

  const onMove = (ev) => {
    const bounds = desktopEl.getBoundingClientRect();
    const x = Math.min(
      Math.max(ev.clientX - offsetX - bounds.left, -rect.width + 80),
      bounds.width - 80
    );
    const y = Math.min(
      Math.max(ev.clientY - offsetY - bounds.top, 0),
      bounds.height - 40
    );
    windowEl.style.left = `${x}px`;
    windowEl.style.top = `${y}px`;
  };

  const onUp = () => {
    navbarEl.classList.remove("dragging");
    navbarEl.removeEventListener("pointermove", onMove);
    navbarEl.removeEventListener("pointerup", onUp);
  };

  navbarEl.addEventListener("pointermove", onMove);
  navbarEl.addEventListener("pointerup", onUp);
});

/* ---------- Prototype nav ---------- */
protoNav.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-screen]");
  if (btn) showScreen(btn.dataset.screen);
});

/* ---------- Start ---------- */
const SCREENS = ["welcome", "name", "avatar", "tone", "confirm", "chat"];
const initial = location.hash.replace("#", "");
showScreen(SCREENS.includes(initial) ? initial : "welcome");
