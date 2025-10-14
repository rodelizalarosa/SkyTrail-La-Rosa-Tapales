
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