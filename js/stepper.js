
const steps = document.querySelectorAll(".step");
const lines = document.querySelectorAll(".line");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const pages = ["booking.html", "flights.html", "passenger.html", "summary.html"];

// Detect current step based on URL
let currentStep = pages.findIndex(page => window.location.pathname.includes(page));
if (currentStep === -1) currentStep = 0;

function updateStepper() {
  steps.forEach((step, index) => {
    step.classList.remove("active", "completed");
    if (index < currentStep) step.classList.add("completed");
    if (index === currentStep) step.classList.add("active");
  });

  lines.forEach((line, index) => {
    line.classList.remove("completed");
    if (index < currentStep) line.classList.add("completed");
  });

  prevBtn.disabled = currentStep === 0;
  nextBtn.textContent = currentStep === steps.length - 1 ? "Finish" : "Next";
}

// Navigation buttons
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      window.location.href = pages[currentStep];
    } else {
      alert("Booking completed! ✅");
    }
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      window.location.href = pages[currentStep];
    }
  });
}

// Allow clicking steps to navigate backward
steps.forEach((step, index) => {
  step.addEventListener("click", () => {
    if (index <= currentStep) {
      window.location.href = pages[index];
    }
  });
});

updateStepper();

// ==========================
// 🪜 PROGRESS STEPPER
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");
  const lines = document.querySelectorAll(".line");

  const page = window.location.pathname;
  let currentStep = 0;

  if (page.includes("booking.html")) currentStep = 0;
  else if (page.includes("flights.html")) currentStep = 1;
  else if (page.includes("passenger.html")) currentStep = 2;
  else if (page.includes("summary.html")) currentStep = 3;

  for (let i = 0; i <= currentStep; i++) {
    if (steps[i]) steps[i].classList.add("active");
    if (i > 0 && lines[i - 1]) lines[i - 1].classList.add("active");
  }

  steps.forEach(step => {
    step.addEventListener("click", () => {
      const stepIndex = Array.from(steps).indexOf(step);
      if (stepIndex <= currentStep) {
        const targetStep = step.getAttribute("data-step");
        if (targetStep) {
          window.location.href = `${targetStep}.html`;
        }
      }
    });
  });
});
