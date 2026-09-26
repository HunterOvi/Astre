const hero = document.querySelector(".hero");
const lens = document.querySelector(".lens");
const halo = document.querySelector(".halo-one");

let targetX = 50;
let targetY = 50;
let currentX = 50;
let currentY = 50;

function animateLight() {
  currentX += (targetX - currentX) * 0.055;
  currentY += (targetY - currentY) * 0.055;

  if (lens) {
    lens.style.left = `${currentX}%`;
    lens.style.top = `${currentY}%`;
  }

  if (halo) {
    const offsetX = (currentX - 50) * 0.12;
    const offsetY = (currentY - 50) * 0.12;
    halo.style.transform =
      `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
  }

  requestAnimationFrame(animateLight);
}

if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    targetX = (event.clientX / window.innerWidth) * 100;
    targetY = (event.clientY / window.innerHeight) * 100;

    if (lens) lens.style.opacity = "1";
  });

  hero.addEventListener("pointerleave", () => {
    targetX = 50;
    targetY = 50;
    if (lens) lens.style.opacity = "0";
  });
}

animateLight();
