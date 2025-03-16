// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the home page
    if (document.querySelector('#featured-events-container')) {
        loadFeaturedEvents();
        initSearchForm();
    }
});

/**
 * Initialize the search form on the home page
 */
function initSearchForm() {
    const searchForm = document.getElementById('search-form');
    
    if (searchForm) {
        // Set default date values
        const today = new Date();
        const todayFormatted = today.toISOString().split('T')[0];
        
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const nextMonthFormatted = nextMonth.toISOString().split('T')[0];
        
        document.getElementById('date-from').value = todayFormatted;
        document.getElementById('date-to').value = nextMonthFormatted;
    }
}

/**
 * Load and display featured events on the home page
 */
function loadFeaturedEvents() {
    const featuredEventsContainer = document.getElementById('featured-events-container');
    
    if (featuredEventsContainer) {
        // Get the sample events
        const events = getSampleEvents();
        
        // Filter to get only featured events (first 3)
        const featuredEvents = events.slice(0, 3);
        
        // Clear the container
        featuredEventsContainer.innerHTML = '';
        
        // Add each featured event to the container
        featuredEvents.forEach(event => {
            const eventCard = createEventCard(event);
            featuredEventsContainer.appendChild(eventCard);
        });
    }
}