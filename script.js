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
            updatePaymentButtonState();
        });
    });
    
    // Time slot selection
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
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
                // Redirect directly to confirmation page
                window.location.href = 'confirmation.html';
            }, 1000);
        });
    }
    
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
        
        const bookingData = {
            movie: {
                title: 'Interstellar (2014)',
                poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
                genres: ['Sci-Fi', 'Action']
            },
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
    updatePaymentButtonState();
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

// Notification function for better UX
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : 'success'} notification-popup`;
    notification.innerHTML = `
        <i class="bi bi-${type === 'error' ? 'exclamation-triangle' : 'check-circle'} me-2"></i>
        ${message}
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        min-width: 300px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Main page functionality for movie booking
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    // Animation classes
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            animation: fadeIn 1s ease-out;
        }
        .fade-in-delay {
            animation: fadeIn 1s ease-out 0.3s both;
        }
        .fade-in-delay-2 {
            animation: fadeIn 1s ease-out 0.6s both;
        }
        .fade-in-right {
            animation: fadeInRight 1s ease-out 0.4s both;
        }
        .shadow-hover {
            transition: all 0.3s ease;
        }
        .shadow-hover:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
        .movie-card {
            transition: all 0.3s ease;
            border: none;
        }
        .movie-poster {
            height: 400px;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        .movie-card:hover .movie-poster {
            transform: scale(1.05);
        }
        .movie-overlay {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 2;
        }
        .movie-rating {
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: bold;
        }
        .hero-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
        }
        .hero-title {
            background: linear-gradient(45deg, #ffffff, #f0f0f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .feature-icon {
            font-size: 3rem;
        }
        .feature-card {
            transition: transform 0.3s ease;
        }
        .feature-card:hover {
            transform: translateY(-5px);
        }
        .upcoming-card {
            transition: all 0.3s ease;
        }
        .upcoming-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        .coming-soon-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 2;
        }
        .min-vh-75 {
            min-height: 75vh;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);

    // Book movie button functionality
    const bookMovieButtons = document.querySelectorAll('.book-movie-btn');
    bookMovieButtons.forEach(button => {
        button.addEventListener('click', function() {
            const movieData = this.getAttribute('data-movie');
            
            // Add loading animation
            this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
            this.disabled = true;
            
            // Store selected movie data for booking page
            const movieInfo = {
                'interstellar': {
                    title: 'Interstellar (2014)',
                    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
                    genres: ['Sci-Fi', 'Drama', 'Adventure']
                },
                'oppenheimer': {
                    title: 'Oppenheimer (2023)',
                    poster: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
                    genres: ['Biography', 'Drama', 'History']
                },
                'barbie': {
                    title: 'Barbie (2023)',
                    poster: 'https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg',
                    genres: ['Comedy', 'Fantasy', 'Adventure']
                }
            };
            
            if (movieInfo[movieData]) {
                localStorage.setItem('selectedMovie', JSON.stringify(movieInfo[movieData]));
            }
            
            setTimeout(() => {
                window.location.href = 'booking.html';
            }, 1000);
        });
    });

    // Smooth scrolling for navigation links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe movie cards and feature cards
    const animatedElements = document.querySelectorAll('.movie-card, .upcoming-card, .feature-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Booking page functionality
if (window.location.pathname.includes('booking.html')) {
    // Load selected movie data from localStorage
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
        
        // Update save booking data function to use selected movie
        const originalSaveBookingData = window.saveBookingData;
        window.saveBookingData = function() {
            const activeDateCard = document.querySelector('.date-card.active');
            const activeTimeButton = document.querySelector('.time-btn.active');
            
            const pricePerTicket = 55000;
            const subtotal = selectedSeats.length * pricePerTicket;
            const discount = Math.min(20000, subtotal * 0.1);
            const total = subtotal - discount;
            
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
        };
    }
}

//# sourceMappingURL=app.js.map
