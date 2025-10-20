// ✅ Generate dynamic passenger forms based on booking data
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("passengerFormsContainer");
  const nextBtn = document.getElementById("nextBtn");

  // Fetch passenger counts from booking data
  const storedBooking = JSON.parse(localStorage.getItem("bookingData")) || {};
  const passengers = storedBooking.passengers || { adult: 1, child: 0, infant: 0 };
  console.log("Booking data fetched:", storedBooking);

  // Create forms for each passenger
  const passengerForms = [];
  let passengerIndex = 0;

  // Adults
  for (let i = 0; i < passengers.adult; i++) {
    passengerForms.push(createPassengerForm(passengerIndex++, "Adult"));
  }
  // Children
  for (let i = 0; i < passengers.child; i++) {
    passengerForms.push(createPassengerForm(passengerIndex++, "Child"));
  }
  // Infants
  for (let i = 0; i < passengers.infant; i++) {
    passengerForms.push(createPassengerForm(passengerIndex++, "Infant"));
  }

  // Append forms to container
  passengerForms.forEach(form => container.appendChild(form));

  // Load saved passenger data
  loadPassengerData(passengerForms);

  // Add event listeners for saving data on input change
  passengerForms.forEach((form, index) => {
    const inputs = form.querySelectorAll("input, select");
    inputs.forEach(input => {
      input.addEventListener("input", () => savePassengerData(passengerForms));
      input.addEventListener("change", () => savePassengerData(passengerForms));
    });
  });

  // Handle next button click
  nextBtn.addEventListener("click", () => {
    const allData = [];
    let firstError = null;

    for (let index = 0; index < passengerForms.length; index++) {
      const form = passengerForms[index];
      const result = collectFormData(form, index);
      if (result.error) {
        firstError = result.error;
        break;
      }
      allData.push(result.data);
    }

    if (firstError) {
      if (firstError === 'phone_length') {
        showPhoneValidationModal();
      } else if (firstError.type === 'future_dob') {
        showValidationModal(`Date of birth for Passenger ${firstError.index + 1} cannot be in the future.`);
      } else if (firstError === 'missing_fields') {
        showValidationModal("Please fill in all required fields for all passengers.");
      }
      return;
    }

    // Save to localStorage
    localStorage.setItem("passengerData", JSON.stringify(allData));
    console.log("Passenger Data Saved:", allData);

    // Redirect to next step
    window.location.href = "summary.html";
  });

  // Modal close handlers
  document.getElementById("closeValidationModal").addEventListener("click", () => {
    document.getElementById("validationModal").style.display = "none";
  });

  document.getElementById("closePhoneValidationModal").addEventListener("click", () => {
    document.getElementById("phoneValidationModal").style.display = "none";
  });
});

// Function to create a passenger form
function createPassengerForm(index, type) {
  const form = document.createElement("form");
  form.classList.add("passenger-form");

  // Set max date to today for date of birth input
  const today = new Date().toISOString().split('T')[0];

  form.innerHTML = `
    <div class="form-section">
      <h2>Passenger ${index + 1} (${type})</h2>

      <!-- Personal Information -->
      <div class="form-section">
        <h3>Personal Information</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="firstName${index}">First Name</label>
            <input type="text" id="firstName${index}" placeholder="Enter first name" required>
          </div>
          <div class="form-group">
            <label for="lastName${index}">Last Name</label>
            <input type="text" id="lastName${index}" placeholder="Enter last name" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Gender</label>
            <div class="radio-group">
              <label><input type="radio" name="gender${index}" value="Male" required> Male</label>
              <label><input type="radio" name="gender${index}" value="Female"> Female</label>
              <label><input type="radio" name="gender${index}" value="Other"> Other</label>
            </div>
          </div>

          <div class="form-group">
            <label for="dob${index}">Date of Birth</label>
            <input type="date" id="dob${index}" max="${today}" required>
          </div>
        </div>
      </div>

      <!-- Contact Information (only for adults) -->
      ${type === "Adult" ? `
      <div class="form-section contactInfo">
        <h3>Contact Information</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="email${index}">Email Address</label>
            <input type="email" id="email${index}" placeholder="Enter email address" required>
          </div>
          <div class="form-group">
            <label for="phone${index}">Phone Number</label>
            <input type="tel" id="phone${index}" placeholder="Enter phone number" required>
          </div>
        </div>
      </div>
      ` : ""}
    </div>
  `;
  return form;
}

// Function to collect data from a form
function collectFormData(form, index) {
  const firstName = form.querySelector(`#firstName${index}`).value.trim();
  const lastName = form.querySelector(`#lastName${index}`).value.trim();
  const gender = form.querySelector(`input[name='gender${index}']:checked`)?.value;
  const dob = form.querySelector(`#dob${index}`).value;

  if (!firstName || !lastName || !gender || !dob) {
    return { error: 'missing_fields' };
  }

  // Validate date of birth is not in the future
  const today = new Date();
  const birthDate = new Date(dob);
  if (birthDate > today) {
    return { error: { type: 'future_dob', index } };
  }

  const data = {
    type: form.querySelector("h2").textContent.match(/\(([^)]+)\)/)[1], // Extract type from h2
    firstName,
    lastName,
    gender,
    dob,
  };

  // Add contact info if adult
  if (data.type === "Adult") {
    data.email = form.querySelector(`#email${index}`).value.trim();
    data.phone = form.querySelector(`#phone${index}`).value.trim();
    if (!data.email || !data.phone) {
      return { error: 'missing_fields' };
    }
    // Validate phone number length
    if (data.phone.length !== 11) {
      return { error: 'phone_length' };
    }
  }

  return { data };
}

// Function to show validation modal
function showValidationModal(message) {
  const modal = document.getElementById("validationModal");
  const messageEl = document.getElementById("validationMessage");
  messageEl.textContent = message;
  modal.style.display = "flex";
}

// Function to show phone validation modal
function showPhoneValidationModal() {
  const modal = document.getElementById("phoneValidationModal");
  modal.style.display = "flex";
}

// Function to save passenger data to localStorage
function savePassengerData(passengerForms) {
  const allData = [];
  passengerForms.forEach((form, index) => {
    const firstName = form.querySelector(`#firstName${index}`).value.trim();
    const lastName = form.querySelector(`#lastName${index}`).value.trim();
    const gender = form.querySelector(`input[name='gender${index}']:checked`)?.value;
    const dob = form.querySelector(`#dob${index}`).value;
    const type = form.querySelector("h2").textContent.match(/\(([^)]+)\)/)[1];

    const data = {
      type,
      firstName,
      lastName,
      gender,
      dob,
    };

    if (type === "Adult") {
      data.email = form.querySelector(`#email${index}`).value.trim();
      data.phone = form.querySelector(`#phone${index}`).value.trim();
    }

    allData.push(data);
  });

  localStorage.setItem("passengerDataTemp", JSON.stringify(allData));
}

// Function to load passenger data from localStorage
function loadPassengerData(passengerForms) {
  const savedData = JSON.parse(localStorage.getItem("passengerDataTemp")) || [];
  passengerForms.forEach((form, index) => {
    if (savedData[index]) {
      const data = savedData[index];
      form.querySelector(`#firstName${index}`).value = data.firstName || "";
      form.querySelector(`#lastName${index}`).value = data.lastName || "";
      if (data.gender) {
        form.querySelector(`input[name='gender${index}'][value='${data.gender}']`).checked = true;
      }
      form.querySelector(`#dob${index}`).value = data.dob || "";
      if (data.type === "Adult") {
        form.querySelector(`#email${index}`).value = data.email || "";
        form.querySelector(`#phone${index}`).value = data.phone || "";
      }
    }
  });
}
