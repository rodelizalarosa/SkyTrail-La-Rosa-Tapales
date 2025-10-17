//PASSENGER SELECTOR
const btn = document.getElementById('passengerBtn'); 
const menu = document.getElementById('passengerMenu');
const counts = {
  adult: 1,
  child: 0,
  infant: 0
};

btn.addEventListener('click', () => {
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

document.querySelectorAll('.plus').forEach(button => {
  button.addEventListener('click', () => {
    const type = button.getAttribute('data-type');
    counts[type]++;
    document.getElementById(`${type}Count`).textContent = counts[type];
    updateButtonText();
  });
});

document.querySelectorAll('.minus').forEach(button => {
  button.addEventListener('click', () => {
    const type = button.getAttribute('data-type');
    if (counts[type] > 0) counts[type]--;
    document.getElementById(`${type}Count`).textContent = counts[type];
    updateButtonText();
  });
});

function updateButtonText() {
  const total = counts.adult + counts.child + counts.infant;
  btn.textContent = `${total} Passenger${total > 1 ? 's' : ''}`;
}

//TRIP TYPE HANDLER
const tripRadios = document.querySelectorAll('input[name="trip"]');
const returnWrapper = document.getElementById('return-wrapper');

tripRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'oneway') {
      returnWrapper.style.display = 'none';
    } else {
      returnWrapper.style.display = 'flex';
    }
  });
});

document.addEventListener('click', (e) => {
  if (!btn.contains(e.target) && !menu.contains(e.target)) {
    menu.style.display = 'none';
  }
});

//DATE
const today = new Date().toISOString().split('T')[0];

const departInput = document.getElementById('depart-date');
const returnInput = document.getElementById('return-date');

departInput.min = today;
returnInput.min = today;

departInput.addEventListener('change', () => {
  const selectedDepart = departInput.value;
  returnInput.min = selectedDepart;

  if (returnInput.value && returnInput.value < selectedDepart) {
    returnInput.value = '';
  }
});

// main.js
document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");
  const lines = document.querySelectorAll(".line");

  const page = window.location.pathname;
  let currentStep = 0;

  if (page.includes("booking.html")) currentStep = 0;
  else if (page.includes("flights.html")) currentStep = 1;
  else if (page.includes("passenger.html")) currentStep = 2;
  else if (page.includes("summary.html")) currentStep = 3;

  // Highlight the steps
  for (let i = 0; i <= currentStep; i++) {
    steps[i].classList.add("active");
    if (i > 0) lines[i - 1].classList.add("active");
  }

  // Add click event for step navigation
  steps.forEach(step => {
    step.addEventListener("click", () => {
      const targetStep = step.getAttribute("data-step");

      if (targetStep === "booking") window.location.href = "booking.html";
      if (targetStep === "flights") window.location.href = "flights.html";
      if (targetStep === "passenger") window.location.href = "passenger.html";
      if (targetStep === "summary") window.location.href = "summary.html";
    });
  });
});

//NO ADVANCE STEP

step.addEventListener("click", () => {
  const stepIndex = Array.from(steps).indexOf(step);
  if (stepIndex <= currentStep) {
    const targetStep = step.getAttribute("data-step");
    if (targetStep === "booking") window.location.href = "booking.html";
    if (targetStep === "flights") window.location.href = "flights.html";
    if (targetStep === "passenger") window.location.href = "passenger.html";
    if (targetStep === "summary") window.location.href = "summary.html";
  }
});


// 🛫 Save booking data when user clicks Search
document.querySelector(".search-btn").addEventListener("click", (e) => {
  e.preventDefault();

  const from = document.getElementById("from-input").value;
  const to = document.getElementById("to-input").value;
  const depart = document.getElementById("depart-date").value;
  const ret = document.getElementById("return-date").value;
  const cabin = document.getElementById("cabin").value;

  // You can also store passenger count if you want
  const passengers = document.getElementById("adultCount").innerText;

  // Store all data in localStorage
  const bookingData = { from, to, depart, ret, cabin, passengers };
  localStorage.setItem("bookingData", JSON.stringify(bookingData));

  // Redirect to booking.html or flights.html (your flow)
  window.location.href = "booking.html";
});

// 🧭 Load saved data when user returns to index.html
window.addEventListener("DOMContentLoaded", () => {
  const savedData = localStorage.getItem("bookingData");
  if (savedData) {
    const data = JSON.parse(savedData);

    if (data.from) document.getElementById("from-input").value = data.from;
    if (data.to) document.getElementById("to-input").value = data.to;
    if (data.depart) document.getElementById("depart-date").value = data.depart;
    if (data.ret) document.getElementById("return-date").value = data.ret;
    if (data.cabin) document.getElementById("cabin").value = data.cabin;
    if (data.passengers) document.getElementById("adultCount").innerText = data.passengers;
  }
});


