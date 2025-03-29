$(document).ready(function() {

    // --- DOM Elements (Estimate Calculator) ---
    const form = document.getElementById('estimateForm');
    const serviceAddressSection = document.getElementById('serviceAddressSection');
    const serviceAddressSame = document.getElementById('serviceAddressSame');
    const windowCleaningSection = document.getElementById('windowCleaningSection');
    const gutterCleaningSection = document.getElementById('gutterCleaningSection');
    const pressureWashingSection = document.getElementById('pressureWashingSection');
    const estimateResultDiv = document.getElementById('estimateResult');
    const estimateAmountP = document.getElementById('estimateAmount');
    const errorMessagesDiv = document.getElementById('errorMessages');

    // --- DOM Elements (Admin Booking Form) ---
    const adminBookingForm = document.getElementById('adminBookingForm');
    const adminBookingResultDiv = document.getElementById('adminBookingResult');
    const adminBookingMessageP = document.getElementById('adminBookingMessage');
    const adminBookingErrorDiv = document.getElementById('adminBookingError');


    // --- Google Apps Script URL ---
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzm4OoYNMYnijmlxImUXzTwATOFi_Yx67skhhtJ80PJB4TiU3-9knSEsf_CLuX2etkO/exec';  // Replace this!
    console.log("Script URL:", scriptURL); // Debugging


    // --- Helper Functions ---
    function displayError(message, errorDiv) {
        console.error("Error:", message);
        errorDiv.style.display = 'block';
        errorDiv.querySelector('p').textContent = message;
    }

    function clearErrors(errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.querySelector('p').textContent = '';
    }

    function validateEstimateForm() { // (unchanged)
        clearErrors(errorMessagesDiv);
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();

        if (!name) {
            displayError('Please enter your name.', errorMessagesDiv);
            return false;
        }
        if (!phone) {
            displayError('Please enter your phone number.', errorMessagesDiv);
            return false;
        }
        if (!email) {
            displayError('Please enter your email address.', errorMessagesDiv);
            return false;
        }
        if (!address) {
            displayError('Please enter your address.', errorMessagesDiv);
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            displayError('Please enter a valid email address.', errorMessagesDiv);
            return false;
        }
        return true;
    }

    function validateAdminBookingForm() {
        clearErrors(adminBookingErrorDiv);
        const adminCustomerName = document.getElementById('adminCustomerName').value.trim();
        const adminCustomerPhone = document.getElementById('adminCustomerPhone').value.trim();
        const adminDate = document.getElementById('adminDate').value;
        const adminTime = document.getElementById('adminTime').value.trim();
        const adminServiceType = document.getElementById('adminServiceType').value;
        const adminServiceAddress = document.getElementById('adminServiceAddress').value.trim();


        if (!adminCustomerName) {
            displayError('Please enter customer name.', adminBookingErrorDiv);
            return false;
        }
        if (!adminCustomerPhone) {
            displayError('Please enter customer phone number.', adminBookingErrorDiv);
            return false;
        }
        if (!adminDate) {
            displayError('Please select appointment date.', adminBookingErrorDiv);
            return false;
        }
        if (!adminTime) {
            displayError('Please enter appointment time slot.', adminBookingErrorDiv);
            return false;
        }
        if (!adminServiceType) {
            displayError('Please select service type.', adminBookingErrorDiv);
            return false;
        }
        if (!adminServiceAddress) {
            displayError('Please enter service address.', adminBookingErrorDiv);
            return false;
        }
        return true;
    }


    // --- Event Listeners (Estimate Calculator Form Submission) ---
    form.addEventListener('submit', async (e) => {
        // ... (Your existing estimate calculator form submission logic - unchanged) ...
        e.preventDefault();

        console.log("Estimate Form submission started.");

        if (!validateEstimateForm()) {
            console.log("Estimate Form validation failed.");
            return;
        }

        // --- **ESTIMATE CALCULATION LOGIC (Moved from Code.gs)** ---
        let estimate = 0;
        const services = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(cb => cb.value);

        if (services.includes('windowCleaning')) {
            const doubleHung = parseInt(document.getElementById('doubleHung').value) || 0;
            const bay = parseInt(document.getElementById('bay').value) || 0;
            const specialty = parseInt(document.getElementById('specialty').value) || 0;
            const sliding = parseInt(document.getElementById('sliding').value) || 0;
            const casement = parseInt(document.getElementById('casement').value) || 0;
            const picture = parseInt(document.getElementById('picture').value) || 0;
            const cutUp = parseInt(document.getElementById('cutUp').value) || 0; // NEW: Get cut-up windows
            estimate += (doubleHung * 5) + (bay * 10) + (specialty * 15) + (sliding * 7) + (casement * 8) + (picture * 12) + (cutUp * 18); // NEW: Add cut-up window cost (example $18)
        }
        if (services.includes('gutterCleaning')) {
            const gutterFootage = parseInt(document.getElementById('gutterFootage').value) || 0;
            estimate += gutterFootage * 2; // Example pricing
        }
        if (services.includes('pressureWashing')) {
            let pwArea = 0;
            const pwSurfaces = Array.from(document.querySelectorAll('input[name="pwSurfaces"]:checked')).map(cb => cb.value);
            if (pwSurfaces.includes('house')) {
                const houseSqFt = parseInt(document.getElementById('houseSqFt').value) || 0;
                const houseMaterial = document.getElementById('houseMaterial').value;
                const materialMultiplier = materialMultipliers[houseMaterial] || 1.0;
                pwArea += houseSqFt * materialMultiplier;
            }
            if (pwSurfaces.includes('patio')) {
                const patioSqFt = parseInt(document.getElementById('patioSqFt').value) || 0;
                const patioMaterial = document.getElementById('patioMaterial').value;
                const materialMultiplier = materialMultipliers[patioMaterial] || 1.0;
                pwArea += patioSqFt * materialMultiplier;
            }
            if (pwSurfaces.includes('deck')) {
                const deckSqFt = parseInt(document.getElementById('deckSqFt').value) || 0;
                const deckMaterial = document.getElementById('deckMaterial').value;
                const materialMultiplier = materialMultipliers[deckMaterial] || 1.0;
                pwArea += deckSqFt * materialMultiplier;
            }
            if (pwSurfaces.includes('driveway')) {
                const drivewaySqFt = parseInt(document.getElementById('drivewaySqFt').value) || 0;
                const drivewayMaterial = document.getElementById('drivewayMaterial').value;
                const materialMultiplier = materialMultipliers[drivewayMaterial] || 1.0;
                pwArea += drivewaySqFt * materialMultiplier;
            }
            if (pwSurfaces.includes('sidewalk')) {
                const sidewalkSqFt = parseInt(document.getElementById('sidewalkSqFt').value) || 0;
                const sidewalkMaterial = document.getElementById('sidewalkMaterial').value;
                const materialMultiplier = materialMultipliers[sidewalkMaterial] || 1.0;
                pwArea += sidewalkSqFt * materialMultiplier;
            }
            if (pwSurfaces.includes('roof')) {
                const roofSqFt = parseInt(document.getElementById('roofSqFt').value) || 0;
                const roofMaterial = document.getElementById('roofMaterial').value;
                const materialMultiplier = materialMultipliers[roofMaterial] || 1.0;
                pwArea += roofSqFt * materialMultiplier;
            }
            estimate += pwArea * 0.5; // Example pricing per adjusted square foot
        }
        // --- **END ESTIMATE CALCULATION** ---

        estimateAmountP.textContent = `Your estimated cost: $${estimate}`;
        estimateResultDiv.style.display = 'block';

        const formData = new FormData(form);
        formData.append('calculatedEstimate', estimate);

        console.log("formData for submission:", formData);

        try {
            const response = await fetch(scriptURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData).toString(),
            });

            console.log("Fetch response:", response);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("HTTP Error Response Status:", response.status);
                console.error("HTTP Error Response Text:", errorText);
                throw new Error(`HTTP error! status: ${response.status},  text: ${errorText}`);
            }

            const data = await response.json();
            console.log("Response data from Apps Script (data storage confirmation):", data);

            if (data.result === 'success') {
                console.log('Estimate data submission successful (data storage confirmed)', data);
                 // **NEW: Update estimateAmountP.textContent with estimate from response**
                if (data.estimate !== undefined) {
                    estimateAmountP.textContent = `Your estimated cost: $${data.estimate}`; // **USE data.estimate!**
                } else {
                    console.warn("Estimate not found in response data."); // Warn if estimate is missing
                }
                form.reset();
            } else {
                displayError(`Estimate data submission failed: ${data.error}`, errorMessagesDiv);
                console.error('Estimate data submission failed', data);
            }
        } catch (error) {
            displayError(`Error submitting estimate data: ${error.message}`, errorMessagesDiv);
            console.error('Error!', error.message);
        }
    });


    // --- Event Listeners (Admin Booking Form Submission) ---
    adminBookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        console.log("Admin Booking Form submission started.");

        if (!validateAdminBookingForm()) {
            console.log("Admin Booking Form validation failed.");
            return;
        }

        const adminFormData = new FormData(adminBookingForm);

        console.log("adminFormData for submission:", adminFormData);

        try {
            const response = await fetch(scriptURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(adminFormData).toString(),
            });

            console.log("Fetch response:", response);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("HTTP Error Response Status:", response.status);
                console.error("HTTP Error Response Text:", errorText);
                throw new Error(`HTTP error! status: ${response.status},  text: ${errorText}`);
            }

            const data = await response.json();
            console.log("Response data from Apps Script (Admin Booking):", data);

            if (data.result === 'success') {
                console.log('Admin Booking submission successful (data storage confirmed)', data);
                adminBookingMessageP.textContent = 'Appointment created successfully! Appointment ID: ' + data.appointmentId;
                adminBookingResultDiv.style.display = 'block';
                adminBookingErrorDiv.style.display = 'none';
                adminBookingForm.reset(); // Clear the form on success

            } else {
                displayError(`Admin Booking submission failed: ${data.error}`, adminBookingErrorDiv);
                adminBookingResultDiv.style.display = 'none';
                console.error('Admin Booking submission failed', data);
            }
        } catch (error) {
            displayError(`Error submitting Admin Booking data: ${error.message}`, adminBookingErrorDiv);
            adminBookingResultDiv.style.display = 'none';
            console.error('Error!', error.message);
        }
    });


    // --- Event Listeners (Service Address, Service Toggles, PW Surface Toggles) --- (unchanged)
    serviceAddressSame.addEventListener('change', function() {
        serviceAddressSection.style.display = this.checked ? 'none' : 'block';
    });

    document.querySelectorAll('input[name="services"]').forEach(service => {
        service.addEventListener('change', function() {
            windowCleaningSection.style.display = document.getElementById('windowCleaning').checked ? 'block' : 'none';
            gutterCleaningSection.style.display = document.getElementById('gutterCleaning').checked ? 'block' : 'none';
            pressureWashingSection.style.display = document.getElementById('pressureWashing').checked ? 'block' : 'none';
        });
    });

    pwHouseCheckbox.addEventListener('change', function() {
        houseDetails.style.display = this.checked ? 'block' : 'none';
    });

    pwPatioCheckbox.addEventListener('change', function() {
        patioDetails.style.display = this.checked ? 'block' : 'none';
    });

    pwDeckCheckbox.addEventListener('change', function() {
        deckDetails.style.display = this.checked ? 'block' : 'none';
    });

    pwDrivewayCheckbox.addEventListener('change', function() {
        drivewayDetails.style.display = this.checked ? 'block' : 'none';
    });

    pwSidewalkCheckbox.addEventListener('change', function() {
        sidewalkDetails.style.display = this.checked ? 'block' : 'none';
    });

    pwRoofCheckbox.addEventListener('change', function() {
        roofDetails.style.display = this.checked ? 'block' : 'none';
    });

    console.log("Script loaded and event listeners attached.");

    // --- Auto-check "Service Address Same as Above?" checkbox on page load --- (unchanged)
    serviceAddressSame.checked = true;
    serviceAddressSection.style.display = 'none';

}); // End of $(document).ready()