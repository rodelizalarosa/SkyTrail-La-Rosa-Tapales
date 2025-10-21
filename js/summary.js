// Summary page logic
document.addEventListener("DOMContentLoaded", () => {
  const bookingData = JSON.parse(localStorage.getItem("bookingData")) || {};
  const passengerData = JSON.parse(localStorage.getItem("passengerData")) || [];
  const selectedFlights = bookingData.selectedFlights || {};

  // Populate flight details
  populateFlightDetails(bookingData, selectedFlights);

  // Populate passenger details
  populatePassengerDetails(passengerData);

  // Populate booking summary
  populateBookingSummary(bookingData, passengerData);

  // Handle confirm button
  const confirmBtn = document.getElementById("confirmBtn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      showConfirmationModal();
    });
  }

  // Handle modal close
  const closeModalBtn = document.getElementById("closeConfirmationModal");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      // Clear localStorage
      localStorage.clear();
      // Redirect to index.html
      window.location.href = "index.html";
    });
  }
});

// Function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Function to populate flight details
function populateFlightDetails(bookingData, selectedFlights) {
  const flightDetailsEl = document.getElementById("flightDetails");
  if (!flightDetailsEl) return;

  const departFlight = selectedFlights.depart;
  const returnFlight = selectedFlights.return;

  let html = "<h3>Flight Details</h3>";

  if (departFlight) {
    html += `
      <div class="flight-summary">
        <h4>Departure Flight</h4>
        <p><strong>Flight No:</strong> ${departFlight.flightNo}</p>
        <p><strong>From:</strong> ${departFlight.from} to ${departFlight.to}</p>
        <p><strong>Date:</strong> ${formatDate(departFlight.date)}</p>
        <p><strong>Departure:</strong> ${departFlight.depart}</p>
        <p><strong>Arrival:</strong> ${departFlight.arrival}</p>
        <p><strong>Duration:</strong> ${departFlight.duration}</p>
        <p><strong>Price:</strong> ₱${departFlight.price}</p>
      </div>
    `;
  }

  if (returnFlight) {
    html += `
      <div class="flight-summary">
        <h4>Return Flight</h4>
        <p><strong>Flight No:</strong> ${returnFlight.flightNo}</p>
        <p><strong>From:</strong> ${returnFlight.from} to ${returnFlight.to}</p>
        <p><strong>Date:</strong> ${formatDate(returnFlight.date)}</p>
        <p><strong>Departure:</strong> ${returnFlight.depart}</p>
        <p><strong>Arrival:</strong> ${returnFlight.arrival}</p>
        <p><strong>Duration:</strong> ${returnFlight.duration}</p>
        <p><strong>Price:</strong> ₱${returnFlight.price}</p>
      </div>
    `;
  }

  flightDetailsEl.innerHTML = html;
}

// Function to populate passenger details
function populatePassengerDetails(passengerData) {
  const passengerDetailsEl = document.getElementById("passengerDetails");
  if (!passengerDetailsEl) return;

  let html = "<h3>Passenger Details</h3>";

  passengerData.forEach((passenger, index) => {
    html += `
      <div class="passenger-summary">
        <h4>Passenger ${index + 1} (${passenger.type})</h4>
        <p><strong>Name:</strong> ${passenger.firstName} ${passenger.lastName}</p>
        <p><strong>Gender:</strong> ${passenger.gender}</p>
        <p><strong>Date of Birth:</strong> ${formatDate(passenger.dob)}</p>
        ${passenger.email ? `<p><strong>Email:</strong> ${passenger.email}</p>` : ""}
        ${passenger.phone ? `<p><strong>Phone:</strong> ${passenger.phone}</p>` : ""}
      </div>
    `;
  });

  passengerDetailsEl.innerHTML = html;
}

// Function to populate booking summary
function populateBookingSummary(bookingData, passengerData) {
  const bookingSummaryEl = document.getElementById("bookingSummary");
  if (!bookingSummaryEl) return;

  const passengers = bookingData.passengers || { adult: 1, child: 0, infant: 0 };
  const totalPassengers = passengers.adult + passengers.child + passengers.infant;
  const selectedFlights = bookingData.selectedFlights || {};
  const departPrice = selectedFlights.depart?.price || 0;
  const returnPrice = selectedFlights.return?.price || 0;

  const totalPrice = (departPrice + returnPrice) * passengers.adult +
                     (departPrice + returnPrice) * passengers.child +
                     (departPrice + returnPrice) * passengers.infant * 0.5;

  let html = "<h3>Booking Summary</h3>";
  html += `<p><strong>Total Passengers:</strong> ${totalPassengers}</p>`;
  html += `<p style="margin-top: 10px;"><strong>Total Price:</strong> ₱${totalPrice.toLocaleString()}</p>`;

  bookingSummaryEl.innerHTML = html;
}

// Function to show confirmation modal
function showConfirmationModal() {
  const modal = document.getElementById("confirmationModal");
  const messageEl = document.getElementById("confirmationMessage");
  messageEl.textContent = "A confirmation message will be sent to your email address.";
  modal.style.display = "flex";
}
