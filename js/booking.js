const airports = [
  { code: "MNL", city: "Manila", name: "Ninoy Aquino International Airport" },
  { code: "CEB", city: "Cebu", name: "Mactan–Cebu International Airport" },
  { code: "DVO", city: "Davao", name: "Francisco Bangoy International Airport" },
  { code: "MPH", city: "Caticlan (Boracay)", name: "Godofredo P. Ramos Airport" },
  { code: "TAG", city: "Tagbilaran (Bohol)", name: "Bohol–Panglao International Airport" },
  { code: "ILO", city: "Iloilo", name: "Iloilo International Airport" }
];

const fromInput = document.getElementById('from-input');
const toInput = document.getElementById('to-input');
const fromDropdown = document.getElementById('from-dropdown');
const toDropdown = document.getElementById('to-dropdown');

let selectedFrom = null;
let selectedTo = null;

// Render dropdown items
function renderDropdown(listElement, inputValue, excludeCode = null) {
  listElement.innerHTML = '';
  const filtered = airports.filter(a => 
    (!excludeCode || a.code !== excludeCode) &&
    (a.city.toLowerCase().includes(inputValue.toLowerCase()) ||
     a.code.toLowerCase().includes(inputValue.toLowerCase()) ||
     a.name.toLowerCase().includes(inputValue.toLowerCase()))
  );

  filtered.forEach(airport => {
    const item = document.createElement('div');
    item.classList.add('dropdown-item');
    item.innerHTML = `
      <div class="airport-top">
        <span class="airport-code">${airport.code}</span> ${airport.city}
      </div>
      <div class="airport-bottom">${airport.name}</div>
    `;

    item.addEventListener('click', () => {
      if (listElement === fromDropdown) {
        fromInput.value = `${airport.city} (${airport.code})`;
        selectedFrom = airport.code;
        fromDropdown.innerHTML = '';
        fromDropdown.style.display = 'none';

        // Clear TO if it’s the same airport
        if (selectedTo === selectedFrom) {
          toInput.value = '';
          selectedTo = null;
        }
      } else {
        toInput.value = `${airport.city} (${airport.code})`;
        selectedTo = airport.code;
        toDropdown.innerHTML = '';
        toDropdown.style.display = 'none';

        // Clear FROM if it’s the same airport
        if (selectedTo === selectedFrom) {
          fromInput.value = '';
          selectedFrom = null;
        }
      }
    });

    listElement.appendChild(item);
  });

  listElement.style.display = filtered.length ? 'block' : 'none';
}

// Event listeners for typing
fromInput.addEventListener('input', () => {
  renderDropdown(fromDropdown, fromInput.value);
});

toInput.addEventListener('input', () => {
  renderDropdown(toDropdown, toInput.value, selectedFrom);
});

// Hide dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!fromInput.contains(e.target) && !fromDropdown.contains(e.target)) {
    fromDropdown.style.display = 'none';
  }
  if (!toInput.contains(e.target) && !toDropdown.contains(e.target)) {
    toDropdown.style.display = 'none';
  }
});

// Focus to open all airports
fromInput.addEventListener('focus', () => renderDropdown(fromDropdown, ''));
toInput.addEventListener('focus', () => renderDropdown(toDropdown, '', selectedFrom));

// Validate airports (cannot pick the same)
function validateAirports() {
  let valid = true;
  if (!fromInput.value.trim()) {
    showError(fromInput, "Please select a departure airport.");
    valid = false;
  }
  if (!toInput.value.trim()) {
    showError(toInput, "Please select a destination airport.");
    valid = false;
  }
  if (selectedFrom && selectedTo && selectedFrom === selectedTo) {
    showError(toInput, "Destination cannot be the same as departure.");
    valid = false;
  }
  return valid;
}

// Show error helper
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
  const clear = () => { error.textContent = ""; };
  input.addEventListener("input", clear, { once: true });
  input.addEventListener("change", clear, { once: true });
}

// Hook search buttons
document.querySelectorAll(".search-btn, .cont-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (validateAirports() && validateForm()) {
      saveBookingDataAndGoNext();
    }
  });
});


// ==========================
// 📥 LOAD BOOKING DATA
// ==========================
window.addEventListener("DOMContentLoaded", () => {
  const savedData = localStorage.getItem("bookingData");
  if (savedData) {
    const data = JSON.parse(savedData);

    if (data.from) document.getElementById("from-input").value = data.from;
    if (data.to) document.getElementById("to-input").value = data.to;

    // ✅ Convert and apply correct date format (YYYY-MM-DD)
    if (data.depart) {
      const departDate = new Date(data.depart);
      const formattedDepart = departDate.toISOString().split("T")[0];
      document.getElementById("depart-date").value = formattedDepart;
    }

    if (data.ret) {
      const returnDate = new Date(data.ret);
      const formattedReturn = returnDate.toISOString().split("T")[0];
      document.getElementById("return-date").value = formattedReturn;
    }

    if (data.cabin) document.getElementById("cabin").value = data.cabin;

    if (data.passengers) {
      document.getElementById("adultCount").innerText = data.passengers.adult || 1;
      document.getElementById("childCount").innerText = data.passengers.child || 0;
      document.getElementById("infantCount").innerText = data.passengers.infant || 0;
    }

    // 📝 Restore trip type
    if (data.tripType) {
      const selectedRadio = document.querySelector(`input[name="trip"][value="${data.tripType}"]`);
      if (selectedRadio) {
        selectedRadio.checked = true;
        const returnWrapper = document.getElementById("return-wrapper"); // make sure this exists
        if (returnWrapper) {
          returnWrapper.style.display = data.tripType === 'oneway' ? 'none' : 'flex';
        }
      }
    }
  }
});
