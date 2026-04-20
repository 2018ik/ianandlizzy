(function () {
  function initCustomCursor() {
    const body = document.body;
    if (!body) return;

    const hoverSrc = body.dataset.cursorHover;
    const clickedSrc = body.dataset.cursorClicked;

    if (!hoverSrc || !clickedSrc) return;

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    let cursorEl = null;
    let imageEl = null;
    let isClicked = false;

    function renderState() {
      if (!cursorEl || !imageEl) return;
      cursorEl.classList.toggle("visible", Boolean(cursorEl.dataset.visible === "true"));
      cursorEl.classList.toggle("is-clicked", isClicked);
      imageEl.src = isClicked ? clickedSrc : hoverSrc;
    }

    function ensureCursor() {
      if (cursorEl) return;

      cursorEl = document.createElement("div");
      cursorEl.className = "site-cursor";
      cursorEl.setAttribute("aria-hidden", "true");
      cursorEl.dataset.visible = "false";

      imageEl = document.createElement("img");
      imageEl.alt = "";
      imageEl.draggable = false;
      imageEl.src = hoverSrc;

      cursorEl.appendChild(imageEl);
      document.body.appendChild(cursorEl);
    }

    function destroyCursor() {
      if (!cursorEl) return;
      cursorEl.remove();
      cursorEl = null;
      imageEl = null;
      isClicked = false;
    }

    function handleMove(event) {
      if (!cursorEl) return;
      cursorEl.style.left = `${event.clientX}px`;
      cursorEl.style.top = `${event.clientY}px`;
      cursorEl.dataset.visible = "true";
      renderState();
    }

    function handleLeave() {
      if (!cursorEl) return;
      cursorEl.dataset.visible = "false";
      isClicked = false;
      renderState();
    }

    function handleDown() {
      if (!cursorEl) return;
      isClicked = true;
      renderState();
    }

    function handleUp() {
      if (!cursorEl) return;
      isClicked = false;
      renderState();
    }

    function syncEnabledState() {
      if (mediaQuery.matches) {
        ensureCursor();
        return;
      }

      destroyCursor();
    }

    syncEnabledState();

    mediaQuery.addEventListener("change", syncEnabledState);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseenter", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("blur", handleLeave);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCustomCursor, { once: true });
  } else {
    initCustomCursor();
  }
})();
