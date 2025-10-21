// ==========================
// 🛫 RANDOM UTILITIES
// ==========================

// Airport map for display
const airportMap = {
  "MNL": "Manila",
  "CEB": "Cebu",
  "DVO": "Davao",
  "MPH": "Caticlan (Boracay)",
  "TAG": "Tagbilaran (Bohol)",
  "ILO": "Iloilo"
};

// Extract code from full string like "Manila (MNL)"
function getCode(full) {
  const match = full.match(/\(([^)]+)\)/);
  return match ? match[1] : full;
}

// Generate random seat assignments
function getRandomSeats(numPassengers) {
  const seats = [];
  const seatLetters = ["A", "B", "C", "D", "E", "F"];
  while (seats.length < numPassengers) {
    const seat = `${Math.floor(Math.random() * 30 + 1)}${seatLetters[Math.floor(Math.random() * 6)]}`;
    if (!seats.includes(seat)) seats.push(seat);
  }
  return seats;
}

// Generate random flight number
function generateFlightNo() {
  const airlines = ["5J", "PR", "DG"];
  const airline = airlines[Math.floor(Math.random() * airlines.length)];
  const number = Math.floor(Math.random() * 900) + 100;
  return `${airline} ${number}`;
}

// Calculate arrival time
function getArrivalTime(depart, duration) {
  const [depHour, depMin] = depart.split(":").map(Number);

  let durHrs = 0;
  let durMins = 0;

  if (duration.includes("h") && duration.includes(" ")) {
    // "1h 25m"
    durHrs = parseInt(duration.split("h")[0]);
    durMins = parseInt(duration.split(" ")[1].replace("m", ""));
  } else if (duration.includes("h")) {
    // "1h"
    durHrs = parseInt(duration.split("h")[0]);
  } else if (duration.includes("m")) {
    // "45m"
    durMins = parseInt(duration.replace("m", ""));
  }

  let totalMin = depMin + durMins;
  let hour = depHour + durHrs + Math.floor(totalMin / 60);
  let min = totalMin % 60;
  hour = hour % 24;
  return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// ==========================
// 🛩️ FLIGHT GENERATION
// ==========================
function generateFlights(from, to, date, cabin, totalPassengers, numFlights = 3) {
  const flights = [];
  const times = ["06:00", "08:30", "11:45", "14:20", "17:10", "19:50"];
  const flightDurations = {
    //From Manila (MNL)
    'MNL-CEB': '1h 25m',
    'MNL-DVO': '2h 10m',
    'MNL-MPH': '1h',
    'MNL-TAG': '1h 25m',
    'MNL-ILO': '1h',

    //From Cebu (CEB)
    'CEB-MNL': '1h 25m',
    'CEB-DVO': '1h',
    'CEB-MPH': '45m',
    'CEB-TAG': '30m',
    'CEB-ILO': '35m',

    //From Davao (DVO)
    'DVO-MNL': '2h 10m',
    'DVO-CEB': '1h',
    'DVO-MPH': '1h 20m',
    'DVO-TAG': '1h 15m',
    'DVO-ILO': '1h 20m',

    //From Caticlan/Boracay (MPH)
    'MPH-MNL': '1h',
    'MPH-CEB': '45m',
    'MPH-DVO': '1h 15m',
    'MPH-TAG': '50m',
    'MPH-ILO': '30m',

    //From Tagbilaran/Bohol (TAG)
    'TAG-MNL': '1h 25m',
    'TAG-CEB': '25m',
    'TAG-DVO': '1h 15m',
    'TAG-MPH': '50m',
    'TAG-ILO': '45m',

    //From Iloilo (ILO)
    'ILO-MNL': '1h',
    'ILO-CEB': '35m',
    'ILO-DVO': '1h 20m',
    'ILO-MPH': '30m',
    'ILO-TAG': '45m'
  };
  const basePrice = { Economy: 3000, Business: 5000, First: 8000, "First Class": 8000 };
  const usedTimes = [];

  for (let i = 0; i < numFlights; i++) {
    let departTime;
    do { departTime = times[Math.floor(Math.random() * times.length)]; }
    while (usedTimes.includes(departTime));
    usedTimes.push(departTime);

    const duration = flightDurations[`${from}-${to}`] || "1h 30m";
    const price = basePrice[cabin] + Math.floor(Math.random() * 500);

    flights.push({
      flightNo: generateFlightNo(),
      depart: departTime,
      arrival: getArrivalTime(departTime, duration),
      duration,
      from,
      to,
      date,
      seat: getRandomSeats(totalPassengers),
      cabin,
      price
    });
  }

  // Sort by departure time
  flights.sort((a, b) => {
    const [ah, am] = a.depart.split(":").map(Number);
    const [bh, bm] = b.depart.split(":").map(Number);
    return ah * 60 + am - (bh * 60 + bm);
  });

  return flights;
}
// ==========================
// ✈️ POPULATE FLIGHTS with PROMO DISCOUNT (Non-Module Version)
// ==========================

let selectedFlights = { depart: null, return: null };

function populateFlights() {
  const data = JSON.parse(localStorage.getItem("bookingData")) || {};
  const from = getCode(data.from) || "MNL";
  const to = getCode(data.to) || "CEB";
  const depart = data.depart || "2025-10-20";
  const ret = data.ret || "";
  const cabin = data.cabin || "Economy";
  const tripType = data.tripType || "oneway";

  let passengers = data.passengers || { adult: 1, child: 0, infant: 0 };
  passengers = {
    adult: Number(passengers.adult || 0),
    child: Number(passengers.child || 0),
    infant: Number(passengers.infant || 0)
  };
  const totalPassengers =
    passengers.adult + passengers.child + passengers.infant;

  const flightList = document.querySelector(".flight-list");
  if (!flightList) return;
  flightList.innerHTML = "";

  // --- Outbound Flights ---
  const departContainer = document.createElement("div");
  departContainer.classList.add("flight-section");
  departContainer.innerHTML = `<h3>Outbound Flights</h3>`;

  const departFlights = generateFlights(
    from,
    to,
    depart,
    cabin,
    totalPassengers,
    3
  );
  departFlights.forEach((f, i) =>
    departContainer.appendChild(
      createFlightCard(f, "depart", passengers, i)
    )
  );
  flightList.appendChild(departContainer);

  // --- Return Flights ---
  if (
    (tripType === "round" ||
      tripType === "roundtrip" ||
      tripType === "roundTrip") &&
    ret
  ) {
    const returnContainer = document.createElement("div");
    returnContainer.classList.add("flight-section");
    returnContainer.innerHTML = `<h3>Return Flights</h3>`;

    const returnFlights = generateFlights(
      to,
      from,
      ret,
      cabin,
      totalPassengers,
      3
    );
    returnFlights.forEach((f, i) =>
      returnContainer.appendChild(
        createFlightCard(f, "return", passengers, i)
      )
    );
    flightList.appendChild(returnContainer);
  }

  populateBookingSummary({ ...data, passengers });
  checkNextButton();
}

// ==========================
// 🪧 CREATE FLIGHT CARD (with PROMO BADGE)
// ==========================
function createFlightCard(flight, type, passengers, index) {
  const activePromo = getActivePromo();

  // 💰 Calculate Base Price
  const basePrice =
    flight.price * passengers.adult +
    flight.price * passengers.child +
    flight.price * passengers.infant * 0.5;

  let displayPrice = basePrice;

  if (activePromo) {
    const discountData = calculateDiscountedFare(
      basePrice,
      activePromo.code
    );
    displayPrice = discountData.total;
  }

  const card = document.createElement("div");
  card.classList.add("flight-card");
  card.innerHTML = `
    <div class="flight-info-left">
      <div class="time-location">
        <div class="departure">
          <strong>${flight.depart}</strong>
          <p>${airportMap[flight.from] || flight.from}</p>
          <span>${formatDate(flight.date)}</span>
        </div>
        <div class="flight-route">
          <span>${flight.duration}</span>
          <div class="route-line"><i class="fas fa-plane"></i></div>
        </div>
        <div class="arrival">
          <strong>${flight.arrival}</strong>
          <p>${airportMap[flight.to] || flight.to}</p>
          <span>${formatDate(flight.date)}</span>
        </div>
      </div>
    </div>

    <div class="flight-info-right">
      <div class="flight-number"><span>${flight.flightNo}</span></div>
      <div class="seat-class">
        <span>${passengers.adult + passengers.child + passengers.infant} Seats | ${flight.cabin}</span>
      </div>
      <div class="price">
        <strong>₱ ${displayPrice.toLocaleString()}</strong>
        ${
          activePromo
            ? `<span class="original-price">₱ ${basePrice.toLocaleString()}</span>`
            : ""
        }
        <button class="select-btn" data-type="${type}" data-index="${index}">Select</button>
      </div>
    </div>
  `;

  card
    .querySelector(".select-btn")
    .addEventListener("click", () => selectFlight(flight, type, card));
  return card;
}

// ==========================
// 🪧 Optional: Promo Badge Styling (CSS Suggestion)
// ==========================
// Add this to your CSS:
/*
.promo-badge {
  display: inline-block;
  background: #ff4d4f;
  color: #fff;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 4px;
}

.original-price {
  display: block;
  font-size: 0.8rem;
  color: #888;
  text-decoration: line-through;
}
*/



// ==========================
// ✍️ SELECT FLIGHT LOGIC
// ==========================
function selectFlight(flight, type, card) {
  if (selectedFlights[type]) selectedFlights[type].card.classList.remove("selected");
  selectedFlights[type] = { flight, card };
  card.classList.add("selected");

  const bookingData = JSON.parse(localStorage.getItem("bookingData")) || {};
  bookingData.selectedFlights = {
    depart: selectedFlights.depart?.flight || null,
    return: selectedFlights.return?.flight || null
  };
  localStorage.setItem("bookingData", JSON.stringify(bookingData));

  updateSummaryPrice();
  checkNextButton();
}

// ==========================
// 📝 BOOKING SUMMARY PANEL
// ==========================
function populateBookingSummary(data) {
  const summary = document.querySelector(".summary-panel");
  if (!summary) return;

  const passengers = data.passengers || { adult: 1, child: 0, infant: 0 };
  const totalPassengers = passengers.adult + passengers.child + passengers.infant;

  const storedPromoCode = localStorage.getItem("promoCode");
  const baseFare = calculateTotalPrice(data); 

  let finalTotal = baseFare;
  let fareType = "None";

  if (storedPromoCode) {
    const promo = validatePromoCode(storedPromoCode);
    if (promo) {
      const discountResult = calculateDiscountedFare(baseFare, storedPromoCode);
      finalTotal = discountResult.total;
      fareType = `${promo.label} (${promo.code})`;
    }
  }

  summary.innerHTML = `
    <h2>Booking Summary</h2>
    <hr>
    <p><strong>From:</strong> ${airportMap[getCode(data.from)] || data.from || "-"}</p>
    <p><strong>To:</strong> ${airportMap[getCode(data.to)] || data.to || "-"}</p>
    <p><strong>Departure:</strong> ${formatDate(data.depart)}</p>
    <p><strong>Return:</strong> ${data.ret ? formatDate(data.ret) : "-"}</p>
    <p><strong>Passengers:</strong> ${totalPassengers} Passenger${totalPassengers > 1 ? "s" : ""}</p>
    <p><strong>Cabin:</strong> ${data.cabin || "Economy"}</p>
    <p><strong>Fare Type:</strong> ${fareType}</p>
    <hr>
    <p><strong>Total:</strong> ₱ ${finalTotal.toLocaleString()}</p>
  `;
}

// ==========================
// 💰 CALCULATE TOTAL PRICE
// ==========================
function calculateTotalPrice(data) {
  const sel = data.selectedFlights || {};
  const passengers = data.passengers || { adult: 1, child: 0, infant: 0 };

  if (!sel.depart) return 0;

  const departPrice = sel.depart?.price || 0;
  const returnPrice = sel.return?.price || 0;

  const total =
    (departPrice + returnPrice) * passengers.adult +
    (departPrice + returnPrice) * passengers.child +
    (departPrice + returnPrice) * passengers.infant * 0.5;

  return total;
}

function updateSummaryPrice() {
  const bookingData = JSON.parse(localStorage.getItem("bookingData")) || {};
  populateBookingSummary(bookingData);
}

// ==========================
// ✅ NEXT BUTTON ENABLE LOGIC
// ==========================
function checkNextButton() {
  const nextBtn = document.querySelector(".next-btn");
  if (!nextBtn) return;
  const data = JSON.parse(localStorage.getItem("bookingData")) || {};
  const tripType = data.tripType || "oneway";
  const hasReturnDate = data.ret && data.ret !== "";
  if (tripType === "oneway" || !hasReturnDate) nextBtn.disabled = !selectedFlights.depart;
  else nextBtn.disabled = !(selectedFlights.depart && selectedFlights.return);
}

// ==========================
// 🔄 INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  populateFlights();

  const nextBtn = document.querySelector(".next-btn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const bookingData = JSON.parse(localStorage.getItem("bookingData")) || {};
      bookingData.selectedFlights = {
        depart: selectedFlights.depart?.flight || null,
        return: selectedFlights.return?.flight || null
      };
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      window.location.href = "passenger.html";
    });
  }
});
