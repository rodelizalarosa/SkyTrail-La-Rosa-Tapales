// ==========================
// 🧍 PASSENGER SELECTOR (with auto-correct + localStorage)
// ==========================
const btn = document.getElementById('passengerBtn'); 
const menu = document.getElementById('passengerMenu');
const counts = { adult: 1, child: 0, infant: 0 };

if (btn && menu) {
  // 🧭 Load saved passenger data from localStorage (if any)
  const savedPassengers = localStorage.getItem('passengerCounts');
  if (savedPassengers) {
    const data = JSON.parse(savedPassengers);
    counts.adult = data.adult || 1; // adult must not be 0
    counts.child = data.child || 0;
    counts.infant = data.infant || 0;
    updateAllPassengerDisplay();
    updateButtonText();
  }

  // 🟢 Toggle dropdown
  btn.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  });

  // ➕ PLUS BUTTON
  document.querySelectorAll('.plus').forEach(button => {
    button.addEventListener('click', () => {
      const type = button.getAttribute('data-type');
      counts[type]++;
      updatePassengerDisplay(type);
      updateButtonText();
      savePassengerData();
    });
  });

  // ➖ MINUS BUTTON (with adult auto-correct)
  document.querySelectorAll('.minus').forEach(button => {
    button.addEventListener('click', () => {
      const type = button.getAttribute('data-type');

      if (type === 'adult') {
        if (counts.adult > 1) counts.adult--;
      } else {
        if (counts[type] > 0) counts[type]--;
      }

      updatePassengerDisplay(type);
      updateButtonText();
      savePassengerData();
    });
  });

  // 🛑 Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.style.display = 'none';
    }
  });

  // 📝 Update passenger count display
  function updatePassengerDisplay(type) {
    document.getElementById(`${type}Count`).textContent = counts[type];
  }

  // ✍️ Update all passenger display (used on load)
  function updateAllPassengerDisplay() {
    document.getElementById('adultCount').textContent = counts.adult;
    document.getElementById('childCount').textContent = counts.child;
    document.getElementById('infantCount').textContent = counts.infant;
  }

  // 📊 Update button text
  function updateButtonText() {
    const total = counts.adult + counts.child + counts.infant;
    btn.textContent = `${total} Passenger${total > 1 ? 's' : ''}`;
  }

  // 💾 Save passenger data to localStorage
  function savePassengerData() {
    localStorage.setItem('passengerCounts', JSON.stringify(counts));
  }
}

// ==========================
// ✈️ TRIP TYPE HANDLER
// ==========================
const tripRadios = document.querySelectorAll('input[name="trip"]');
const returnWrapper = document.getElementById('return-wrapper');

if (tripRadios && returnWrapper) {
  tripRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'oneway') {
        returnWrapper.style.display = 'none';
        document.getElementById('return-date').value = '';
      } else {
        returnWrapper.style.display = 'flex';
      }

      // 📝 Save trip type to localStorage
      const bookingData = JSON.parse(localStorage.getItem("bookingData")) || {};
      bookingData.tripType = radio.value;
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
    });
  });
}

// ==========================
// 📅 DATE HANDLER
// ==========================
const today = new Date().toISOString().split('T')[0];
const departInput = document.getElementById('depart-date');
const returnInput = document.getElementById('return-date');

if (departInput && returnInput) {
  departInput.min = today;
  returnInput.min = today;

  departInput.addEventListener('change', () => {
    const selectedDepart = departInput.value;
    returnInput.min = selectedDepart;

    if (returnInput.value && returnInput.value < selectedDepart) {
      returnInput.value = '';
    }
  });
}

// ==========================
// ✅ VALIDATION FUNCTION
// ==========================
function validateForm() {
  let isValid = true;

  const from = document.getElementById("from-input");
  const to = document.getElementById("to-input");
  const depart = document.getElementById("depart-date");
  const ret = document.getElementById("return-date");

  const tripTypeRaw = document.querySelector('input[name="trip"]:checked')?.value;
  const tripType = (tripTypeRaw === 'round' || tripTypeRaw === 'roundtrip') ? 'round' : 'oneway';

  // Clear old error messages
  document.querySelectorAll(".error-message").forEach(msg => msg.textContent = "");

  // -------------------
  // FROM / TO VALIDATION
  // -------------------
  if (!from.value.trim()) {
    showError(from, "Please select a departure airport.");
    isValid = false;
  }

  if (!to.value.trim()) {
    showError(to, "Please select a destination airport.");
    isValid = false;
  }

  // Check if user picked the same airport
  if (selectedFrom && selectedTo && selectedFrom === selectedTo) {
    showError(to, "Destination cannot be the same as departure.");
    isValid = false;
  }

  // -------------------
  // DEPART DATE
  // -------------------
  if (!depart.value) {
    showError(depart, "Please choose or enter a valid date.");
    isValid = false;
  }

  // -------------------
  // RETURN DATE
  // -------------------
  const returnWrapper = document.getElementById('return-wrapper');
  const returnVisible = returnWrapper ? (returnWrapper.style.display !== 'none') : true;

  if (tripType === 'round' && returnVisible) {
    if (!ret.value) {
      showError(ret, "Please select a return date.");
      isValid = false;
    } else if (depart.value && ret.value <= depart.value) {
      showError(ret, "Return date must be after depart date.");
      isValid = false;
    }
  }

  return isValid;
}


// ---------- SHOW ERROR ----------
function showError(input, message) {
  const group = input.closest(".input-group");
  if (!group) return;

  let error = group.querySelector(".error-message");
  if (!error) {
    error = document.createElement("small");
    error.classList.add("error-message");
    group.appendChild(error);
  }

  error.textContent = message;

  // Remove error on input/change
  const clear = () => { error.textContent = ""; };
  input.addEventListener("input", clear, { once: true });
  input.addEventListener("change", clear, { once: true });
}

// ---------- ATTACH BUTTONS ----------
function attachSearchButtons() {
  document.querySelectorAll(".search-btn, .cont-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (validateForm()) {
        saveBookingDataAndGoNext();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', attachSearchButtons);

// Promo code validation is handled in js/promo.js

// ==========================
// 💾 SAVE BOOKING DATA (Index & Booking Page)
// ==========================
function saveBookingDataAndGoNext() {
  // ✅ validate promo before proceeding
  if (!validatePromoBeforeNext()) return; 

  const from = document.getElementById("from-input").value;
  const to = document.getElementById("to-input").value;
  const depart = document.getElementById("depart-date").value;
  const ret = document.getElementById("return-date").value;
  const cabin = document.getElementById("cabin").value;
  const passengers = {
    adult: parseInt(document.getElementById("adultCount").innerText) || 1,
    child: parseInt(document.getElementById("childCount").innerText) || 0,
    infant: parseInt(document.getElementById("infantCount").innerText) || 0
  };
  const tripType = document.querySelector('input[name="trip"]:checked')?.value || 'oneway';

  const bookingData = { from, to, depart, ret, cabin, passengers, tripType };
  localStorage.setItem("bookingData", JSON.stringify(bookingData));

  window.location.href = "flights.html";
}

// Attach to index page button
const searchBtn = document.querySelector(".search-btn");
if (searchBtn) {
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (validateForm()) {
      saveBookingDataAndGoNext();
    }
  });
}

// Attach to booking page button
const contBtn = document.querySelector(".cont-btn");
if (contBtn) {
  contBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (validateForm()) {
      saveBookingDataAndGoNext();
    }
  });

}
