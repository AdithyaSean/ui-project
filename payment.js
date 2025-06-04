// Payment page functionality with placeholder data and animations

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page with fade-in animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Placeholder booking data (instead of localStorage)
    const placeholderBookingData = {
        movie: {
            title: 'Interstellar (2014)',
            poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
            genres: ['Sci-Fi', 'Drama']
        },
        showtime: {
            dateDisplay: 'Jun 02, sunday',
            timeDisplay: '7.30 PM'
        },
        seats: ['D6', 'D7', 'D8'],
        pricing: {
            pricePerTicket: 1500,
            subtotal: 4500,
            discount: 450,
            total: 4050,
            ticketCount: 3
        },
        bookingId: 'BK' + Date.now()
    };

    // Load booking data into the page
    loadBookingData(placeholderBookingData);

    // Payment method selection
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const paymentSections = document.querySelectorAll('.payment-form-section');

    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Hide all payment sections with animation
            paymentSections.forEach(section => {
                section.style.transition = 'all 0.3s ease';
                section.style.opacity = '0';
                section.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    section.style.display = 'none';
                }, 300);
            });

            // Show selected payment section with animation
            setTimeout(() => {
                const targetSection = document.getElementById(this.value + '-section');
                if (targetSection) {
                    targetSection.style.display = 'block';
                    setTimeout(() => {
                        targetSection.style.opacity = '1';
                        targetSection.style.transform = 'translateY(0)';
                    }, 50);
                }
            }, 300);

            // Add pulse animation to selected payment method
            const selectedLabel = document.querySelector(`label[for="${this.id}"]`);
            if (selectedLabel) {
                selectedLabel.style.animation = 'pulse 0.6s ease';
                setTimeout(() => {
                    selectedLabel.style.animation = '';
                }, 600);
            }
        });
    });

    // Form validation and submission
    const paymentForm = document.getElementById('payment-form');
    const payNowBtn = document.getElementById('pay-now-btn');

    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add loading animation to button
            const originalText = payNowBtn.innerHTML;
            payNowBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing Payment...';
            payNowBtn.disabled = true;

            // Add shake animation if validation fails
            const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
            if (!selectedPaymentMethod) {
                showNotification('Please select a payment method', 'error');
                shakeElement(payNowBtn);
                payNowBtn.innerHTML = originalText;
                payNowBtn.disabled = false;
                return;
            }

            // Simulate payment processing
            setTimeout(() => {
                // Add success animation
                payNowBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Payment Successful!';
                payNowBtn.classList.remove('btn-primary');
                payNowBtn.classList.add('btn-success');
                
                // Add bounce animation
                payNowBtn.style.animation = 'bounceIn 0.6s ease';
                
                setTimeout(() => {
                    // Fade out and redirect to confirmation
                    document.body.style.transition = 'opacity 0.5s ease';
                    document.body.style.opacity = '0';
                    
                    setTimeout(() => {
                        window.location.href = 'confirmation.html';
                    }, 500);
                }, 1000);
            }, 2000);
        });
    }

    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            if (formattedValue !== e.target.value) {
                e.target.value = formattedValue;
            }
        });

        // Add focus animations
        cardNumberInput.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });

        cardNumberInput.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    }

    // Expiry date formatting
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // CVV input restrictions
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }

    // Add hover animations to all buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-2px)';
                this.style.transition = 'transform 0.2s ease';
            }
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Load booking data into the page
function loadBookingData(bookingData) {
    // Update movie poster
    const moviePoster = document.querySelector('.movie-poster-small');
    if (moviePoster && bookingData.movie.poster) {
        moviePoster.src = bookingData.movie.poster;
        moviePoster.alt = bookingData.movie.title + ' Poster';
    }

    // Update movie title
    const movieTitle = document.querySelector('.movie-title');
    if (movieTitle) {
        movieTitle.textContent = bookingData.movie.title;
    }

    // Update genres
    const genreContainer = document.querySelector('.genre-badges');
    if (genreContainer && bookingData.movie.genres) {
        genreContainer.innerHTML = '';
        bookingData.movie.genres.forEach(genre => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-secondary me-1';
            badge.textContent = genre;
            genreContainer.appendChild(badge);
        });
    }

    // Update date and time
    const dateTimeText = document.getElementById('booking-datetime');
    if (dateTimeText) {
        dateTimeText.textContent = `${bookingData.showtime.dateDisplay}, ${bookingData.showtime.timeDisplay}`;
    }

    // Update selected seats
    const seatsContainer = document.querySelector('.selected-seats-display');
    if (seatsContainer && bookingData.seats) {
        seatsContainer.innerHTML = '';
        bookingData.seats.forEach(seat => {
            const seatBadge = document.createElement('span');
            seatBadge.className = 'badge bg-success me-1 mb-1';
            seatBadge.textContent = seat;
            seatsContainer.appendChild(seatBadge);
        });
    }

    // Update pricing
    if (bookingData.pricing) {
        const elements = {
            'ticket-count': bookingData.pricing.ticketCount,
            'price-per-ticket': `LKR ${bookingData.pricing.pricePerTicket.toLocaleString()}`,
            'subtotal-amount': `LKR ${bookingData.pricing.subtotal.toLocaleString()}`,
            'discount-amount': `LKR ${bookingData.pricing.discount.toLocaleString()}`,
            'total-amount': `LKR ${bookingData.pricing.total.toLocaleString()}`
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    // Update booking ID
    const bookingIdElement = document.getElementById('booking-id');
    if (bookingIdElement) {
        bookingIdElement.textContent = bookingData.bookingId;
    }

    // Add staggered fade-in animation to booking details
    const bookingDetails = document.querySelectorAll('.booking-detail-item');
    bookingDetails.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : 'success'} notification-popup`;
    notification.innerHTML = `
        <i class="bi bi-${type === 'error' ? 'exclamation-triangle' : 'check-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
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
    }, 4000);
}

function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Add CSS animations
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
        }
        
        .payment-form-section {
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        }
        
        .payment-form-section.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        .booking-detail-item {
            transition: all 0.3s ease;
        }
        
        .booking-detail-item:hover {
            background-color: rgba(106, 17, 203, 0.05);
            border-radius: 8px;
            padding: 10px;
            margin: -5px;
        }
    `;
    document.head.appendChild(style);
});
