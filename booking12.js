// Function to handle the button click event
function redirectToHikkaduwaPage() {
  // Redirect to the booking page
  window.location.href = "Hikkaduwa Hatchery.html";
}

// Add a click event listener to the "Book Now" button
document.getElementById("HikkaduwaBtn1").addEventListener("click", redirectToHikkaduwaPage);





/*==============DETAILS PAGE===============*/


function handleDetailsPage() {
  const form = document.getElementById("UserDetailsForm");
  const continueButton = document.getElementById("continueButton");
  const countryCodeSelect = document.getElementById("countryCode");

  function checkEmails() {
    const email = document.getElementById("email").value;
    const confirmEmail = document.getElementById("confirmEmail").value;
    return email === confirmEmail;
  }

  function showError(inputElement, errorMessage) {
    const errorElement = document.getElementById(`${inputElement.id}Error`);
    errorElement.textContent = errorMessage;
  }

  function removeError(inputElement) {
    const errorElement = document.getElementById(`${inputElement.id}Error`);
    errorElement.textContent = "";
  }

  function updateButtonState() {
    continueButton.disabled = !form.checkValidity() || !checkEmails();
  }

  form.addEventListener("input", function (event) {
    const inputElement = event.target;
    if (!inputElement.checkValidity()) {
      showError(inputElement, inputElement.validationMessage);
    } else {
      removeError(inputElement);
    }
    updateButtonState();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const userDetails = {
      fullName: document.getElementById("fullName").value,
      mobileNumber: `${document.getElementById("countryCode").value}${document.getElementById("mobileNumber").value}`,
      email: document.getElementById("email").value,
      gender: document.getElementById("gender").value,
    };
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
    window.location.href = "payments.html";
  });

  function populateCountryCodes() {
    const countries = [
      { code: "+93", name: "Afghanistan" },
      { code: "+355", name: "Albania" },
      { code: "+213", name: "Algeria"},
      { code: "+54", name: "Argentina" },
      { code: "+374", name: "Armenia" },
      { code: "+61", name: "Australia"},
      { code: "+43", name: "Austria" },
      { code: "+973", name: "Baharain" },
      { code: "+880", name: "Bangaladesh"},
      { code: "+375", name: "Belarus" },
      { code: "+32", name: "Belgium" },
      { code: "+55", name: "Brazil"},
      { code: "+86", name: "China" },
      { code: "+56", name: "Chile" },
      { code: "+57", name: "Colombia"},
      { code: "+20", name: "Egypt" },
      { code: "+679", name: "fiji" },
      { code: "+358", name: "Finland"},
      { code: "+33", name: "France" },
      { code: "+49", name: "Germany" },
      { code: "+94", name: "Sri Lanka"},
    ];

    countries.forEach(country => {
      const option = document.createElement("option");
      option.value = country.code;
      option.text = `${country.name} (${country.code})`;
      countryCodeSelect.appendChild(option);
    });
  }

  populateCountryCodes();
}

// JavaScript for payments.html


// Main function to handle page-specific logic
document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname;

  if (currentPage.includes("booking.html")) {
    handleBookingPage();
  } else if (currentPage.includes("details.html")) {
    handleDetailsPage();
  } else if (currentPage.includes("payments.html")) {
    handlePaymentsPage();
  } else if (currentPage.includes("confirmation.html")) {
    handleConfirmationPage();
  }
});




/*==============BOOKING PAGE===============*/


function updatePricingTable() {
  const pricingData = {
      'SL Adult': { normal: 4, peak: 6 },
      'SL Child': { normal: 2, peak: 3 },
      'Foreigner Adult': { normal: 10, peak: 13 },
      'Foreigner Child': { normal: 5, peak: 8 },
      'Infant': { normal: 0, peak: 0 }
  };

  const pricingtbl = document.getElementById('pricingtbl');
  pricingtbl.innerHTML = '';

  const ticketSelection = JSON.parse(localStorage.getItem('ticketSelection'));
  const selectedTimeSlots = Array.from(document.getElementById('timeSlots').selectedOptions, option => option.value);

  const tableHeader = document.createElement('tr');
  const header1 = document.createElement('th');
  header1.textContent = 'Ticket Type';
  const header2 = document.createElement('th');
  header2.textContent = 'Price (USD)';
  pricingtbl.appendChild(tableHeader);
  tableHeader.appendChild(header1);
  tableHeader.appendChild(header2);

  let totalPrice = 0;
  for (const [ticketType, prices] of Object.entries(pricingData)) {
      const row = document.createElement('tr');
      const cell1 = document.createElement('td');
      cell1.textContent = ticketType;
      const cell2 = document.createElement('td');
      const totalHours = selectedTimeSlots.length;
      const pricePerHour = (totalHours <= 2) ? prices.peak : prices.normal;
      const totalTicketPrice = (ticketSelection[ticketType] || 0) * pricePerHour * totalHours;
      cell2.textContent = totalTicketPrice.toFixed(2);
      row.appendChild(cell1);
      row.appendChild(cell2);
      pricingtbl.appendChild(row);
      totalPrice += totalTicketPrice;
  }

  // Add a row for the total price
  const totalRow = document.createElement('tr');
  const totalLabelCell = document.createElement('td');
  totalLabelCell.textContent = 'Total Price (USD)';
  totalLabelCell.setAttribute('colspan', '2');
  const totalValueCell = document.createElement('td');
  totalValueCell.textContent = totalPrice.toFixed(2);
  totalRow.appendChild(totalLabelCell);
  totalRow.appendChild(totalValueCell);
  pricingtbl.appendChild(totalRow);
}

// Function to handle ticket submission
function handleTicketSubmission() {
  const slAdultQty = parseInt(document.getElementById('slAdult').value);
  const slChildQty = parseInt(document.getElementById('slChild').value);
  const foreignerAdultQty = parseInt(document.getElementById('foreignerAdult').value);
  const foreignerChildQty = parseInt(document.getElementById('foreignerChild').value);
  const infantQty = parseInt(document.getElementById('infant').value);

  const ticketSelection = {
      'SL Adult': slAdultQty,
      'SL Child': slChildQty,
      'Foreigner Adult': foreignerAdultQty,
      'Foreigner Child': foreignerChildQty,
      'Infant': infantQty
  };

  localStorage.setItem('ticketSelection', JSON.stringify(ticketSelection));
  alert('Ticket selection has been saved to local storage.');

  // Call function to update the pricing table after ticket submission
  updatePricingTable();
  updateSummaryTable();
}

// Function to update the summary table
function updateSummaryTable() {
  const summaryTable = document.getElementById('summaryTable');
  summaryTable.innerHTML = '';

  const selectedDate = document.getElementById('dateInput').value;
  const selectedTimeSlots = Array.from(document.getElementById('timeSlots').selectedOptions, option => option.text);

  
  const ticketSelection = JSON.parse(localStorage.getItem('ticketSelection'));
  const pricingData = {
      'SL Adult': { normal: 4, peak: 6 },
      'SL Child': { normal: 2, peak: 3 },
      'Foreigner Adult': { normal: 10, peak: 13 },
      'Foreigner Child': { normal: 5, peak: 8 },
      'Infant': { normal: 0, peak: 0 }
  };

  let totalPrice = 0;
  for (const [ticketType, prices] of Object.entries(pricingData)) {
      const totalHours = selectedTimeSlots.length;
      const pricePerHour = (totalHours <= 2) ? prices.peak : prices.normal;
      const totalTicketPrice = (ticketSelection[ticketType] || 0) * pricePerHour * totalHours;
      totalPrice += totalTicketPrice;
  }

  const tableRows = [
      { label: 'Date', value: selectedDate },
      { label: 'Time Slot', value: selectedTimeSlots.join(', ') },
      { label: 'Duration', value: selectedTimeSlots.length + ' hour(s)' },
      { label: 'Tickets', value: 'Charges (USD)' }
  ];

  for (const [ticketType, quantity] of Object.entries(ticketSelection)) {
      const ticketPrice = pricingData[ticketType];
      const totalHours = selectedTimeSlots.length;
      const pricePerHour = (totalHours <= 2) ? ticketPrice.peak : ticketPrice.normal;
      const totalTicketPrice = quantity * pricePerHour * totalHours;

      tableRows.push({ label: ticketType, value: `${quantity} (x ${pricePerHour} USD)`, total: totalTicketPrice });
  }

  tableRows.push({ label: 'Total Payable', value: '', total: totalPrice });

  for (const row of tableRows) {
      const tableRow = document.createElement('tr');
      const labelCell = document.createElement('td');
      labelCell.textContent = row.label;
      const valueCell = document.createElement('td');
      valueCell.textContent = row.value;
      const totalCell = document.createElement('td');
      totalCell.textContent = (row.total !== undefined) ? row.total.toFixed(2) : '';

      tableRow.appendChild(labelCell);
      tableRow.appendChild(valueCell);
      tableRow.appendChild(totalCell);

      summaryTable.appendChild(tableRow);
  }

  // Save the summary details in local storage using JSON
  const summaryDetails = {
      selectedDate,
      selectedTimeSlots,
      ticketSelection,
      totalPrice
  };
  localStorage.setItem('summaryDetails', JSON.stringify(summaryDetails));
}

// Event listener for ticket submission button
document.getElementById('ticketSubmitBtn').addEventListener('click', handleTicketSubmission);

// Event listener for date submission button
document.getElementById('dateSubmitBtn').addEventListener('click', () => {
  updatePricingTable();
  updateSummaryTable();
});

// Event listener for time slot changes
document.getElementById('timeSlots').addEventListener('change', () => {
  updatePricingTable();
  updateSummaryTable();
});

// Call function to update the pricing table on page load
updatePricingTable();

// Call function to update the summary table on page load
updateSummaryTable();








/*==============PAYMENTS PAGE===============*/

// Function to validate the payment form
function validatePaymentForm() {
const cardNumber = document.getElementById("cardNumber").value;
const expiryDate = document.getElementById("expiryDate").value;
const cvc = document.getElementById("cvc").value;
const nameOnCard = document.getElementById("nameOnCard").value;
const cardNumberRegex = /^\d{16}$/;
const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
const cvcRegex = /^\d{3,4}$/;
let isValid = true;

// Validate Card Number
if (!cardNumber.match(/^\d+$/)) {
  document.getElementById("cardNumberError").textContent =
    "Invalid Card Number. Please enter only numbers.";
  isValid = false;
} else if (!cardNumberRegex.test(cardNumber)) {
  document.getElementById("cardNumberError").textContent =
    "Invalid Card Number. Must be 16 digits.";
  isValid = false;
} else {
  document.getElementById("cardNumberError").textContent = "";
}

// Validate Expiry Date
const [month, year] = expiryDate.split("/").map((item) => parseInt(item, 10));
const currentDate = new Date();
const currentYear = currentDate.getFullYear() % 100;
const currentMonth = currentDate.getMonth() + 1;

if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
  document.getElementById("expiryDateError").textContent =
    "Invalid Expiry Date. Please enter a valid date in MM/YY format.";
  isValid = false;
} else if (isNaN(month) || isNaN(year) || month < 1 || month > 12 || year < currentYear) {
  document.getElementById("expiryDateError").textContent =
    "Invalid Expiry Date. Please enter a valid date in MM/YY format.";
  isValid = false;
} else if (year === currentYear && month < currentMonth) {
  document.getElementById("expiryDateError").textContent =
    "Card has already expired. Please enter a valid date in the future.";
  isValid = false;
} else {
  document.getElementById("expiryDateError").textContent = "";
}

// Validate CVC/CVV
if (!cvc.match(/^\d+$/)) {
  document.getElementById("cvcError").textContent =
    "Invalid CVC/CVV. Please enter only numbers.";
  isValid = false;
} else if (!cvcRegex.test(cvc)) {
  document.getElementById("cvcError").textContent =
    "Invalid CVC/CVV. Must be 3 or 4 digits.";
  isValid = false;
} else {
  document.getElementById("cvcError").textContent = "";
}

// Validate Name on Card
if (nameOnCard.trim() === "") {
  document.getElementById("nameOnCardError").textContent =
    "Name on Card cannot be empty";
  isValid = false;
} else {
  document.getElementById("nameOnCardError").textContent = "";
}

return isValid;
}

// Function to handle the payments.html page
function handlePaymentsPage() {
const form = document.getElementById("paymentForm");
const cardNumberInput = document.getElementById("cardNumber");
const expiryDateInput = document.getElementById("expiryDate");
const cvcInput = document.getElementById("cvc");
const nameOnCardInput = document.getElementById("nameOnCard");
const submitButton = document.getElementById("submitButton");
const cardNumberRegex = /^\d{16}$/;
const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
const cvcRegex = /^\d{3,4}$/;

function updateSubmitButtonState() {
  if (
    cardNumberRegex.test(cardNumberInput.value) &&
    expiryDateRegex.test(expiryDateInput.value) &&
    cvcRegex.test(cvcInput.value) &&
    nameOnCardInput.value.trim() !== ""
  ) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

form.addEventListener("input", function (event) {
  const target = event.target;
  if (target === cardNumberInput) {
    if (!target.value.match(/^\d+$/)) {
      document.getElementById("cardNumberError").textContent =
        "Invalid Card Number. Please enter only numbers.";
    } else if (!cardNumberRegex.test(target.value)) {
      document.getElementById("cardNumberError").textContent =
        "Invalid Card Number. Must be 16 digits.";
    } else {
      document.getElementById("cardNumberError").textContent = "";
    }
  } else if (target === cvcInput) {
    if (!target.value.match(/^\d+$/)) {
      document.getElementById("cvcError").textContent =
        "Invalid CVC/CVV. Please enter only numbers.";
    } else if (!cvcRegex.test(target.value)) {
      document.getElementById("cvcError").textContent =
        "Invalid CVC/CVV. Must be 3 or 4 digits.";
    } else {
      document.getElementById("cvcError").textContent = "";
    }
  } else if (target === nameOnCardInput) {
    if (target.value.trim() === "") {
      document.getElementById("nameOnCardError").textContent =
        "Name on Card cannot be empty";
    } else {
      document.getElementById("nameOnCardError").textContent = "";
    }
  }

  updateSubmitButtonState();
});

expiryDateInput.addEventListener("input", function () {
  const expiryDate = expiryDateInput.value;
  const [month, year] = expiryDate.split("/").map((item) => parseInt(item, 10));
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (isNaN(month) || isNaN(year) || month < 1 || month > 12 || year < currentYear) {
    document.getElementById("expiryDateError").textContent =
      "Invalid Expiry Date. Please enter a valid date in MM/YY format.";
  } else if (year === currentYear && month < currentMonth) {
    document.getElementById("expiryDateError").textContent =
      "Card has already expired. Please enter a valid date in the future.";
  } else {
    document.getElementById("expiryDateError").textContent = "";
  }

  updateSubmitButtonState();
});

// Function to save payment details in local storage
function savePaymentDetails() {
  const cardNumber = document.getElementById("cardNumber").value;
  const expiryDate = document.getElementById("expiryDate").value;
  const cvc = document.getElementById("cvc").value;
  const nameOnCard = document.getElementById("nameOnCard").value;

  const paymentDetails = {
    cardNumber: cardNumber,
    expiryDate: expiryDate,
    cvc: cvc,
    nameOnCard: nameOnCard,
  };

  // Convert the payment details object to a JSON string
  const paymentDetailsJSON = JSON.stringify(paymentDetails);

  // Save the JSON string in local storage
  localStorage.setItem("paymentDetails", paymentDetailsJSON);
}

// Event listener for form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  if (validatePaymentForm()) {
    // If the form is valid, save payment details in local storage
    savePaymentDetails();
    // Redirect to the confirmation.html page
    window.location.href = "confirmation.html";
  } else {
    // Form is not valid, handle any other actions (if needed)
  }
});

updateSubmitButtonState();
}

// Main function to handle page-specific logic
document.addEventListener("DOMContentLoaded", function () {
handlePaymentsPage();
});




















/*==============CONFIRMATION PAGE===============*/

document.addEventListener("DOMContentLoaded", function () {
  // Retrieve user details from local storage
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  // Display the summary of the order
  if (userDetails) {
    const confirmationContainer = document.querySelector(".confirmation-container");

    // Create elements to display the summary
    const summaryHeading = document.createElement("h3");
    summaryHeading.textContent = "Order Summary";

    const summaryList = document.createElement("ul");
    for (const [key, value] of Object.entries(userDetails)) {
      const listItem = document.createElement("li");
      listItem.textContent = `${key}: ${value}`;
      summaryList.appendChild(listItem);
    }

    // Append summary elements to the confirmation container
    confirmationContainer.appendChild(summaryHeading);
    confirmationContainer.appendChild(summaryList);
  }
});
