/* ============================================================
   app.js — La Première (Marcel & Ines Wedding Invitation)
   La portada es el estreno privado de su pelicula: creditos de
   apertura bajo el haz del proyector, boton medallon, cuenta
   regresiva de leader 3-2-1 con barrido de reloj, e iris dorado
   que abre el trailer con sonido (el toque es el gesto que
   desbloquea el audio del iframe, mismo origen).
   ============================================================ */

const landingScene = document.getElementById('landing');
const invitationOverlay = document.getElementById('invitation-overlay');
const invitationFrame = document.getElementById('invitation-frame');
const audio = document.getElementById('bg-audio');
const playButton = document.getElementById('premiere-play');
const monoPanel = document.getElementById('premiere-mono');
const iris = document.getElementById('premiere-iris');

let playing = false;
let premiereStarted = false;

/* ── Cancion de fondo (City of Stars) ──
   Ya no arranca sola: la invitacion (iframe) la pide en fade
   cuando el trailer se acopla, y la retira al volver al video. */

function playSong() {
  if (!audio) return;
  const playPromise = audio.play();
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(() => {
      playing = false;
    });
  }
}

function startSong() {
  playing = true;
  if (audio) audio.volume = 1;
  playSong();
}

function stopSong() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  playing = false;
}

function fadeInSong() {
  if (playing || !audio) return;
  playing = true;
  audio.volume = 0;
  playSong();

  const start = performance.now();
  const FADE_MS = 2600;
  function step(now) {
    const k = Math.min(1, (now - start) / FADE_MS);
    audio.volume = k * k;
    if (k < 1 && playing) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
window.fadeInSong = fadeInSong;

function fadeOutSong() {
  if (!playing || !audio) return;
  playing = false;

  const startVolume = audio.volume;
  const start = performance.now();
  const FADE_MS = 1600;
  function step(now) {
    if (playing) return; // alguien reinicio la cancion: abortar
    const k = Math.min(1, (now - start) / FADE_MS);
    audio.volume = startVolume * (1 - k);
    if (k < 1) {
      requestAnimationFrame(step);
    } else {
      audio.pause();
    }
  }
  requestAnimationFrame(step);
}
window.fadeOutSong = fadeOutSong;

/* ── Mostrar la invitacion (iframe) ── */
function showInvitationOverlay() {
  if (!landingScene || !invitationOverlay) return;
  invitationOverlay.classList.add('visible');
  invitationOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('invitation-open');
  document.documentElement.classList.add('invitation-open');

  // iOS Safari NO reproduce video dentro de un elemento invisible, asi
  // que el play del gesto se rechazo mientras el iframe estaba oculto.
  // Ahora que ya se ve, se reintenta (sin reiniciar el trailer).
  asegurarVideo();
  setTimeout(asegurarVideo, 350);
  setTimeout(asegurarVideo, 1200);
}

function asegurarVideo() {
  try {
    if (
      invitationFrame &&
      invitationFrame.contentWindow &&
      typeof invitationFrame.contentWindow.__asegurarVideo === 'function'
    ) {
      invitationFrame.contentWindow.__asegurarVideo();
    }
  } catch (error) {
    /* sin acceso al iframe */
  }
}

/* ── El gesto del toque desbloquea el sonido del trailer ── */
// Bandera que el propio iframe consulta al terminar de cargar: si la
// premiere ya arranco, se pone en marcha solo. Sin esto, un toque dado
// antes de que invite.js estuviera listo NO hacia nada --el sintoma que
// en el telefono se veia como "el video no se reproduce": con datos
// moviles el iframe casi nunca esta listo a tiempo.
window.__premiereStarted = false;
let cobroPendiente = 0;

function startTrailerFromGesture() {
  window.__premiereStarted = true;
  if (intentarArranque()) return;

  // Todavia no hay invite.js: se reintenta hasta que aparezca.
  if (invitationFrame) {
    invitationFrame.addEventListener('load', intentarArranque, { once: true });
  }
  const desde = Date.now();
  clearInterval(cobroPendiente);
  cobroPendiente = setInterval(() => {
    if (intentarArranque() || Date.now() - desde > 15000) {
      clearInterval(cobroPendiente);
    }
  }, 150);
}

function intentarArranque() {
  try {
    if (
      invitationFrame &&
      invitationFrame.contentWindow &&
      typeof invitationFrame.contentWindow.__startTrailerSound === 'function'
    ) {
      invitationFrame.contentWindow.__startTrailerSound();
      return true;
    }
  } catch (error) {
    /* sin acceso al iframe: el video hara su propio intento */
  }
  return false;
}

/* ── La premiere: 3, 2, 1... y la pelicula ── */
async function startPremiere() {
  if (premiereStarted) return;
  premiereStarted = true;

  landingScene.classList.add('is-counting');

  // iOS solo reproduce si el video esta VISIBLE: se descubre el iframe
  // en este mismo gesto y el monograma lo tapa mientras se dibuja.
  showInvitationOverlay();
  startTrailerFromGesture();

  // El monograma se dibuja en oro sobre la luz (1.8s) y se rellena.
  if (monoPanel) {
    monoPanel.hidden = false;
    requestAnimationFrame(() => monoPanel.classList.add('is-drawing'));
  }

  setTimeout(() => {
    if (monoPanel) monoPanel.classList.add('is-leaving');
    if (iris) iris.classList.add('is-open');
  }, 2950);

  setTimeout(() => {
    if (monoPanel) monoPanel.hidden = true;
    if (iris) iris.classList.add('is-fading');
  }, 4000);

  setTimeout(() => {
    if (iris) iris.remove();
    landingScene.classList.add('scene--collapsed');
    if (invitationOverlay) invitationOverlay.style.pointerEvents = 'auto';
  }, 4900);
}

if (playButton) {
  playButton.addEventListener('click', startPremiere);
}
