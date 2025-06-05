// General shared functionality across all pages
document.addEventListener('DOMContentLoaded', function() {
    // Initialize any general functionality that applies to all pages
    initializeSharedFeatures();
});

function initializeSharedFeatures() {
    // Any shared initialization code can go here
    console.log('Shared features initialized');
}

// Shared ripple effect functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.payment-btn, .time-slot, .btn');
    
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


