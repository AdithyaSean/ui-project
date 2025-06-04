document.addEventListener('DOMContentLoaded', function() {
    const seats = document.querySelectorAll('.seat.available');
    const timeSlots = document.querySelectorAll('.time-btn');
    const dateCards = document.querySelectorAll('.date-card');
    const paymentBtns = document.querySelectorAll('.btn');
    
    let selectedSeats = [];
    const maxSeats = 8; // Increased max seats for larger layout
    
    // Date selection functionality
    dateCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all date cards
            dateCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            this.classList.add('active');
            
            // Update booking summary with selected date
            updateBookingSummary();
        });
    });
    
    // Time slot selection functionality
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Remove active class from all time slots
            timeSlots.forEach(s => s.classList.remove('active'));
            // Add active class to clicked slot
            this.classList.add('active');
            
            // Update booking summary with selected time
            updateBookingSummary();
        });
    });
    
    // Seat selection functionality
    seats.forEach(seat => {
        seat.addEventListener('click', function() {
            const seatId = this.dataset.seat;
            
            if (this.classList.contains('selected')) {
                // Deselect seat
                this.classList.remove('selected');
                this.classList.add('available');
                selectedSeats = selectedSeats.filter(id => id !== seatId);
            } else if (selectedSeats.length < maxSeats) {
                // Select seat
                this.classList.remove('available');
                this.classList.add('selected');
                selectedSeats.push(seatId);
            }
            
            updateSeatInfo();
            updateSelectedSeatsDisplay();
            updateTicketInfo();
        });
    });
    
    // Time slot selection
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Payment button interactions
    paymentBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (selectedSeats.length === 0) {
                alert('Please select at least one seat');
                return;
            }
            
            const paymentMethod = this.classList.contains('qris') ? 'QRIS' : 'Cash';
            alert(`Processing payment via ${paymentMethod} for ${selectedSeats.length} seat(s): ${selectedSeats.join(', ')}`);
        });
    });
    
    // Update seat selection info
    function updateSeatInfo() {
        // const seatInfo = document.querySelector('.alert strong'); // Old selector
        const seatCountDisplay = document.getElementById('selected-seat-count');
        const seatSelectionTitle = document.querySelector('.selected-seats h6'); // Target the h6 tag
        const remaining = maxSeats - selectedSeats.length;

        if (seatCountDisplay) {
            seatCountDisplay.textContent = selectedSeats.length;
        }

        if (seatSelectionTitle) {
            if (selectedSeats.length === 0) {
                seatSelectionTitle.innerHTML = `Selected Seats (<span id="selected-seat-count">${selectedSeats.length}</span>) - Select up to ${maxSeats} Seats`;
            } else if (remaining > 0) {
                seatSelectionTitle.innerHTML = `Selected Seats (<span id="selected-seat-count">${selectedSeats.length}</span>) - Select ${remaining} more seat${remaining > 1 ? 's' : ''}`;
            } else {
                seatSelectionTitle.innerHTML = `Selected Seats (<span id="selected-seat-count">${selectedSeats.length}</span>) - Maximum seats selected`;
            }
        }
    }

    // Update selected seats display
    function updateSelectedSeatsDisplay() {
        const seatPills = document.querySelector('.seat-pills');
        seatPills.innerHTML = '';
        
        selectedSeats.forEach(seatId => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-success me-1 mb-1';
            badge.textContent = seatId;
            seatPills.appendChild(badge);
        });
        
        if (selectedSeats.length === 0) {
            seatPills.innerHTML = '<span class="text-muted">No seats selected</span>';
        }
    }
    
    // Update ticket information in price breakdown
    function updateTicketInfo() {
        // Update pricing (basic calculation)
        const pricePerTicket = 55000; // IDR 55,000 per ticket
        const subtotal = selectedSeats.length * pricePerTicket;
        const discount = Math.min(20000, subtotal * 0.1); // 10% discount, max 20k
        const total = subtotal - discount;

        // Update price breakdown
        // document.querySelector('.price-item:first-child span:last-child').textContent = `IDR ${subtotal.toLocaleString()}`; // Old selector
        // document.querySelector('.price-item:nth-child(2) span:last-child').textContent = `- IDR ${discount.toLocaleString()}`; // Old selector
        // document.querySelector('.price-total span:last-child').textContent = `IDR ${total.toLocaleString()}`; // Old selector
        // document.querySelector('.price-item:first-child span:first-child').textContent = `${selectedSeats.length} Ticket${selectedSeats.length !== 1 ? 's' : ''}`; // Old selector

        const numTicketsEl = document.getElementById('num-tickets');
        const subtotalPriceEl = document.getElementById('subtotal-price');
        const discountPriceEl = document.getElementById('discount-price');
        const totalPriceEl = document.getElementById('total-price');

        if (numTicketsEl) numTicketsEl.textContent = `${selectedSeats.length} Ticket${selectedSeats.length !== 1 ? 's' : ''}`;
        if (subtotalPriceEl) subtotalPriceEl.textContent = `IDR ${subtotal.toLocaleString()}`;
        if (discountPriceEl) discountPriceEl.textContent = `- IDR ${discount.toLocaleString()}`;
        if (totalPriceEl) totalPriceEl.textContent = `IDR ${total.toLocaleString()}`;
    }

    // Function to update booking summary
    function updateBookingSummary() {
        const activeDateCard = document.querySelector('.date-card.active');
        const activeTimeButton = document.querySelector('.time-btn.active');
        // const selectedCinema = document.querySelector('select').value; // Cinema select was removed from HTML
        const bookingDateTimeEl = document.getElementById('booking-date-time');


        let dateText = "N/A";
        let timeText = "N/A";

        if (activeDateCard) {
            const dateHeader = activeDateCard.querySelector('.date-header strong').textContent;
            const dateDay = activeDateCard.querySelector('.date-day').textContent;
            const month = activeDateCard.querySelector('.date-header').firstChild.textContent.trim();
            dateText = `${month} ${dateHeader}, ${dateDay}`;
        }

        if (activeTimeButton) {
            timeText = activeTimeButton.textContent; // Directly get text content of the button
        }
        
        if (bookingDateTimeEl) {
            bookingDateTimeEl.innerHTML = `Date & Time: <span class="fw-semibold">${dateText}, ${timeText}</span>`;
        }

        // Old logic for updating booking summary - to be removed or adapted if cinema selection is re-added
        // if (activeDate && activeTime) {
        //     const dateText = activeDate.querySelector('.date-header').textContent + ', ' + 
        //                    activeDate.querySelector('.date-day').textContent;
        //     const timeText = activeTime.querySelector('.fw-bold').textContent;
            
        //     // Update the booking summary
        //     document.querySelector('.movie-details p:nth-child(1) strong').nextSibling.textContent = ' ' + dateText;
        //     document.querySelector('.movie-details p:nth-child(2) strong').nextSibling.textContent = ' ' + timeText;
        //     // document.querySelector('.movie-details p:nth-child(3) strong').nextSibling.textContent = ' ' + selectedCinema; // Cinema select removed
        // }
    }

    // Cinema selection change - This event listener will cause an error as the select element was removed.
    // document.querySelector('select').addEventListener('change', updateBookingSummary);

    // Initialize with some pre-selected seats to match the design
    const preSelectedSeats = ['D6', 'D7', 'D8', 'D9']; // Center seats in row D
    preSelectedSeats.forEach(seatId => {
        const seat = document.querySelector(`[data-seat="${seatId}"]`);
        if (seat && seat.classList.contains('available')) {
            seat.classList.remove('available');
            seat.classList.add('selected');
            selectedSeats.push(seatId);
        }
    });
    
    updateSeatInfo();
    updateSelectedSeatsDisplay();
    updateTicketInfo();
    updateBookingSummary();
});

// Add some hover effects and animations
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.payment-btn, .time-slot');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
