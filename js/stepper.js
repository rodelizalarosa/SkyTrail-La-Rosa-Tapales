
const steps = document.querySelectorAll(".step");
const lines = document.querySelectorAll(".line");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

// Array of pages in the correct order
const pages = ["booking.html", "flights.html", "passenger.html", "summary.html"];

// Detect current step based on the URL
let currentStep = pages.findIndex(page => window.location.pathname.includes(page));
if (currentStep === -1) currentStep = 0; // default to first step if URL not found

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

nextBtn.addEventListener("click", () => {
  if (currentStep < steps.length - 1) {
    currentStep++;
    window.location.href = pages[currentStep]; // redirect to next page
  } else {
    alert("Booking completed! ✅");
    // You can also redirect to a confirmation page here
  }
});

prevBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    window.location.href = pages[currentStep]; // redirect to previous page
  }
});

updateStepper();
