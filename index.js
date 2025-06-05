// Homepage functionality for movie booking
document.addEventListener('DOMContentLoaded', function() {
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
});
