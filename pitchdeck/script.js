const slides = [...document.querySelectorAll(".slide")];
const currentLabel = document.querySelector(".rail-current");
const progress = document.querySelector(".rail-progress");
const totalLabel = document.querySelector(".rail-total");

totalLabel.textContent = String(slides.length - 1).padStart(2, "0");

const setActiveSlide = (slide) => {
  const index = slides.indexOf(slide);
  const number = String(index).padStart(2, "0");
  currentLabel.textContent = number;
  document.querySelector(".brand span:last-child").textContent = `FOLLOW / ${number}`;
  progress.style.height = `${(index / (slides.length - 1)) * 100}%`;
  history.replaceState(null, "", `#${slide.id}`);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      if (entry.intersectionRatio >= 0.45) setActiveSlide(entry.target);
    });
  },
  { threshold: [0.18, 0.45, 0.7] }
);

slides.forEach((slide) => observer.observe(slide));

document.addEventListener("keydown", (event) => {
  if (!["ArrowDown", "ArrowRight", "PageDown", "ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) return;
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

  const current = Number(currentLabel.textContent);
  const direction = ["ArrowDown", "ArrowRight", "PageDown"].includes(event.key) ? 1 : -1;
  const next = Math.min(slides.length - 1, Math.max(0, current + direction));

  if (next !== current) {
    event.preventDefault();
    slides[next].scrollIntoView({ behavior: "smooth" });
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    document.querySelectorAll("video").forEach((video) => video.pause());
  }
});
