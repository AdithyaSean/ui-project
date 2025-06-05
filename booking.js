// Booking page functionality for seat selection, date/time selection, and booking summary
document.addEventListener('DOMContentLoaded', function() {
    const seats = document.querySelectorAll('.seat.available');
    const timeSlots = document.querySelectorAll('.time-btn');
    const dateCards = document.querySelectorAll('.date-card');
    
    let selectedSeats = [];
    const maxSeats = 8; // Maximum seats for larger layout
    
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
            updatePaymentButtonState();
        });
    });
    
    // Continue to Payment button functionality
    const continuePaymentBtn = document.getElementById('continue-payment-btn');
    if (continuePaymentBtn) {
        continuePaymentBtn.addEventListener('click', function() {
            if (selectedSeats.length === 0) {
                showNotification('Please select at least one seat before proceeding to payment.', 'error');
                return;
            }
            
            // Add button animation
            this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing Booking...';
            this.disabled = true;
            this.style.transform = 'scale(0.95)';
            
            // Save booking data before redirecting
            saveBookingData();
            
            setTimeout(() => {
                // Redirect to payment page
                window.location.href = 'payment.html';
            }, 1000);
        });
    }
    
    // Update seat selection info
    function updateSeatInfo() {
        const seatCountDisplay = document.getElementById('selected-seat-count');
        const seatSelectionTitle = document.querySelector('.selected-seats h6');
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
            timeText = activeTimeButton.textContent;
        }
        
        if (bookingDateTimeEl) {
            bookingDateTimeEl.innerHTML = `Date & Time: <span class="fw-semibold">${dateText}, ${timeText}</span>`;
        }
    }

    // Function to update payment button state
    function updatePaymentButtonState() {
        const continueBtn = document.getElementById('continue-payment-btn');
        if (continueBtn) {
            continueBtn.disabled = selectedSeats.length === 0;
        }
    }
    
    // Function to save booking data
    function saveBookingData() {
        const activeDateCard = document.querySelector('.date-card.active');
        const activeTimeButton = document.querySelector('.time-btn.active');
        
        const pricePerTicket = 55000;
        const subtotal = selectedSeats.length * pricePerTicket;
        const discount = Math.min(20000, subtotal * 0.1);
        const total = subtotal - discount;
        
        // Get movie info from localStorage if available
        const selectedMovieData = localStorage.getItem('selectedMovie');
        let movieInfo = {
            title: 'Interstellar (2014)',
            poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
            genres: ['Sci-Fi', 'Action']
        };
        
        if (selectedMovieData) {
            movieInfo = JSON.parse(selectedMovieData);
        }
        
        const bookingData = {
            movie: movieInfo,
            showtime: {
                date: activeDateCard ? activeDateCard.dataset.date : '2025-06-02',
                time: activeTimeButton ? activeTimeButton.dataset.time : '07:30',
                dateDisplay: activeDateCard ? activeDateCard.querySelector('.date-header').textContent + ', ' + activeDateCard.querySelector('.date-day').textContent : 'Jun 02, sunday',
                timeDisplay: activeTimeButton ? activeTimeButton.textContent : '7.30 AM'
            },
            seats: selectedSeats,
            pricing: {
                pricePerTicket: pricePerTicket,
                subtotal: subtotal,
                discount: discount,
                total: total,
                ticketCount: selectedSeats.length
            },
            bookingId: 'BK' + Date.now(),
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('movieBookingData', JSON.stringify(bookingData));
    }

    // Load selected movie data from localStorage and update UI
    const selectedMovieData = localStorage.getItem('selectedMovie');
    if (selectedMovieData) {
        const movieInfo = JSON.parse(selectedMovieData);
        
        // Update movie title
        const movieTitleElement = document.querySelector('.movie-title');
        if (movieTitleElement) {
            movieTitleElement.textContent = movieInfo.title;
        }
        
        // Update movie poster
        const moviePosterElement = document.querySelector('.movie-poster-container img');
        if (moviePosterElement) {
            moviePosterElement.src = movieInfo.poster;
            moviePosterElement.alt = movieInfo.title + ' Movie Poster';
        }
        
        // Update booking summary movie info
        const bookingSummaryTitle = document.querySelector('.movie-info-summary h5');
        if (bookingSummaryTitle) {
            bookingSummaryTitle.textContent = movieInfo.title;
        }
        
        // Update genre badges
        const genreBadgesContainer = document.querySelector('.movie-info-summary .d-flex');
        if (genreBadgesContainer && movieInfo.genres) {
            genreBadgesContainer.innerHTML = '';
            movieInfo.genres.forEach(genre => {
                const badge = document.createElement('span');
                badge.className = 'badge bg-secondary me-1';
                badge.textContent = genre;
                genreBadgesContainer.appendChild(badge);
            });
        }
    }

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
    updatePaymentButtonState();
});
