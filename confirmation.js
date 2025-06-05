// Confirmation page functionality for displaying booking details and success animations
document.addEventListener('DOMContentLoaded', function() {
    // Load booking data from localStorage
    const bookingData = localStorage.getItem('movieBookingData');
    
    if (bookingData) {
        const booking = JSON.parse(bookingData);
        updateConfirmationPage(booking);
    } else {
        // If no booking data found, show error or redirect
        console.warn('No booking data found');
        // Optional: redirect to homepage or show error message
    }
    
    // Add success animation to confirmation elements
    setTimeout(() => {
        const successElements = document.querySelectorAll('.fade-in-success');
        successElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 500);
    
    // Download ticket functionality
    const downloadBtn = document.getElementById('download-ticket-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Generating Ticket...';
            this.disabled = true;
            
            // Simulate ticket generation
            setTimeout(() => {
                this.innerHTML = '<i class="bi bi-check-circle me-2"></i>Download Complete!';
                this.classList.remove('btn-primary');
                this.classList.add('btn-success');
                
                // Reset after 2 seconds
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.classList.remove('btn-success');
                    this.classList.add('btn-primary');
                    this.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
    
    // Email ticket functionality
    const emailBtn = document.getElementById('email-ticket-btn');
    if (emailBtn) {
        emailBtn.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending Email...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="bi bi-check-circle me-2"></i>Email Sent!';
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-success');
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.classList.remove('btn-success');
                    this.classList.add('btn-outline-primary');
                    this.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
    
    // Book another movie functionality
    const bookAnotherBtn = document.getElementById('book-another-btn');
    if (bookAnotherBtn) {
        bookAnotherBtn.addEventListener('click', function() {
            // Clear booking data and redirect to homepage
            localStorage.removeItem('movieBookingData');
            localStorage.removeItem('selectedMovie');
            window.location.href = 'index.html';
        });
    }
    
    function updateConfirmationPage(booking) {
        // Update booking ID
        const bookingIdElement = document.getElementById('booking-id');
        if (bookingIdElement) {
            bookingIdElement.textContent = booking.bookingId;
        }
        
        // Update movie information
        const movieTitleElement = document.getElementById('movie-title');
        if (movieTitleElement) {
            movieTitleElement.textContent = booking.movie.title;
        }
        
        const moviePosterElement = document.getElementById('movie-poster');
        if (moviePosterElement) {
            moviePosterElement.src = booking.movie.poster;
            moviePosterElement.alt = booking.movie.title + ' Poster';
        }
        
        // Update showtime information
        const showtimeDateElement = document.getElementById('showtime-date');
        if (showtimeDateElement) {
            showtimeDateElement.textContent = booking.showtime.dateDisplay;
        }
        
        const showtimeTimeElement = document.getElementById('showtime-time');
        if (showtimeTimeElement) {
            showtimeTimeElement.textContent = booking.showtime.timeDisplay;
        }
        
        // Update seat information
        const seatsElement = document.getElementById('selected-seats');
        if (seatsElement && booking.seats) {
            seatsElement.textContent = booking.seats.join(', ');
        }
        
        const seatCountElement = document.getElementById('seat-count');
        if (seatCountElement) {
            seatCountElement.textContent = `${booking.seats.length} seat${booking.seats.length > 1 ? 's' : ''}`;
        }
        
        // Update pricing information
        const totalAmountElement = document.getElementById('total-amount');
        if (totalAmountElement) {
            totalAmountElement.textContent = `IDR ${booking.pricing.total.toLocaleString()}`;
        }
        
        const ticketCountElement = document.getElementById('ticket-count');
        if (ticketCountElement) {
            ticketCountElement.textContent = `${booking.pricing.ticketCount} ticket${booking.pricing.ticketCount > 1 ? 's' : ''}`;
        }
        
        // Update booking date
        const bookingDateElement = document.getElementById('booking-date');
        if (bookingDateElement) {
            const bookingDate = new Date(booking.timestamp);
            bookingDateElement.textContent = bookingDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        // Generate QR code data (simplified for demo)
        const qrData = `Booking: ${booking.bookingId}, Movie: ${booking.movie.title}, Seats: ${booking.seats.join(', ')}, Date: ${booking.showtime.dateDisplay}, Time: ${booking.showtime.timeDisplay}`;
        
        // Update QR code (this would normally generate an actual QR code)
        const qrCodeElement = document.getElementById('qr-code');
        if (qrCodeElement) {
            // For demo purposes, we'll just show the data as text
            // In a real implementation, you'd use a QR code library
            qrCodeElement.innerHTML = `
                <div class="text-center p-3 border border-2 border-dark rounded">
                    <small class="text-muted d-block mb-2">QR Code</small>
                    <div class="fw-bold">${booking.bookingId}</div>
                    <small class="text-muted">Scan at cinema</small>
                </div>
            `;
        }
        
        // Update any genre badges if container exists
        const genreBadgesContainer = document.querySelector('.movie-genres');
        if (genreBadgesContainer && booking.movie.genres) {
            genreBadgesContainer.innerHTML = '';
            booking.movie.genres.forEach(genre => {
                const badge = document.createElement('span');
                badge.className = 'badge bg-secondary me-1';
                badge.textContent = genre;
                genreBadgesContainer.appendChild(badge);
            });
        }
    }
    
    // Add CSS for success animations if not already present
    const style = document.createElement('style');
    style.textContent = `
        .fade-in-success {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
        
        .success-checkmark {
            animation: checkmark-bounce 0.6s ease-in-out;
        }
        
        @keyframes checkmark-bounce {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .booking-confirmation-card {
            animation: slideInUp 0.8s ease-out;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});
