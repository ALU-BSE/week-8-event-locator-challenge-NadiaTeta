// Initialize the events page when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the events page
    if (document.querySelector('#events-container')) {
        initEventsPage();
    }
});

/**
 * Initialize the events list page
 */
function initEventsPage() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get('city') || '';
    const category = urlParams.get('category') || '';
    const dateFrom = urlParams.get('date-from') || '';
    const dateTo = urlParams.get('date-to') || '';
    
    // Set filter form values from URL parameters
    document.getElementById('filter-city').value = city;
    document.getElementById('filter-category').value = category;
    document.getElementById('filter-date-from').value = dateFrom;
    document.getElementById('filter-date-to').value = dateTo;
    
    // Load events based on filters
    loadEvents(city, category, dateFrom, dateTo);
    
    // Initialize event listeners for filters
    initFilterEvents();
}

/**
 * Initialize event listeners for the filter form
 */
function initFilterEvents() {
    const filterForm = document.getElementById('filter-form');
    const resetButton = document.getElementById('reset-filter');
    const sortOptions = document.querySelectorAll('.sort-option');
    
    // Filter form submission
    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const city = document.getElementById('filter-city').value;
        const category = document.getElementById('filter-category').value;
        const dateFrom = document.getElementById('filter-date-from').value;
        const dateTo = document.getElementById('filter-date-to').value;
        
        // Update URL parameters
        const url = new URL(window.location);
        url.searchParams.set('city', city);
        url.searchParams.set('category', category);
        url.searchParams.set('date-from', dateFrom);
        url.searchParams.set('date-to', dateTo);
        window.history.pushState({}, '', url);
        
        // Load events with new filters
        loadEvents(city, category, dateFrom, dateTo);
    });
    
    // Reset button click
    resetButton.addEventListener('click', function() {
        filterForm.reset();
        
        // Clear URL parameters
        window.history.pushState({}, '', 'events.html');
        
        // Load all events
        loadEvents('', '', '', '');
    });
    
    // Sort options
    sortOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sortOption = this.getAttribute('data-sort');
            const sortText = this.textContent;
            
            // Update dropdown button text
            document.getElementById('sortDropdown').textContent = `Sort by: ${sortText}`;
            
            // Get current filters
            const city = document.getElementById('filter-city').value;
            const category = document.getElementById('filter-category').value;
            const dateFrom = document.getElementById('filter-date-from').value;
            const dateTo = document.getElementById('filter-date-to').value;
            
            // Load events with current filters and new sort option
            loadEvents(city, category, dateFrom, dateTo, sortOption);
        });
    });
}

/**
 * Load and display events based on filters
 * @param {string} city - The city filter
 * @param {string} category - The category filter
 * @param {string} dateFrom - The start date filter
 * @param {string} dateTo - The end date filter
 * @param {string} sortOption - The sort option
 */
function loadEvents(city = '', category = '', dateFrom = '', dateTo = '', sortOption = 'date-desc') {
    // Show loading spinner
    const loadingSpinner = document.getElementById('loading-spinner');
    const eventsContainer = document.getElementById('events-container');
    const noEventsMessage = document.getElementById('no-events-message');
    
    loadingSpinner.style.display = 'block';
    eventsContainer.innerHTML = '';
    noEventsMessage.style.display = 'none';
    
    // Simulate API call delay
    setTimeout(() => {
        // Get sample events
        let events = getSampleEvents();
        
        // Apply filters
        if (city) {
            events = events.filter(event => event.city.toLowerCase().includes(city.toLowerCase()));
        }
        
        if (category) {
            events = events.filter(event => event.category === category);
        }
        
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            events = events.filter(event => new Date(event.date) >= fromDate);
        }
        
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999); // End of day
            events = events.filter(event => new Date(event.date) <= toDate);
        }
        
        // Apply sorting
        events = sortEvents(events, sortOption);
        
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
        
        // Update result count
        document.getElementById('result-count').textContent = `(${events.length} events)`;
        
        if (events.length === 0) {
            // Show no events message
            noEventsMessage.style.display = 'block';
        } else {
            // Display events
            events.forEach(event => {
                const eventCard = createEventCard(event);
                eventsContainer.appendChild(eventCard);
            });
            
            // Update page title based on category or city
            let pageTitle = 'Events';
            if (category) {
                pageTitle = `${getCategoryDisplayName(category)} Events`;
            } else if (city) {
                pageTitle = `Events in ${city}`;
            }
            document.getElementById('events-title').textContent = pageTitle;
        }
    }, 800); // Simulate loading delay
}

/**
 * Sort events based on the specified option
 * @param {Array} events - The events to sort
 * @param {string} sortOption - The sort option
 * @returns {Array} - The sorted events
 */
function sortEvents(events, sortOption) {
    switch (sortOption) {
        case 'date-asc':
            return events.sort((a, b) => new Date(a.date) - new Date(b.date));
        case 'date-desc':
            return events.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'name-asc':
            return events.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return events.sort((a, b) => b.name.localeCompare(a.name));
        default:
            return events.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

/**
 * Create an event card element
 * @param {Object} event - The event data
 * @returns {HTMLElement} - The event card element
 */
function createEventCard(event) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';
    
    // Format the date
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    // Get category display name
    const categoryDisplayName = getCategoryDisplayName(event.category);
    
    col.innerHTML = `
        <div class="card event-card">
            <div class="position-relative">
                <img src="${event.image}" class="card-img-top" alt="${event.name}">
                <div class="event-date">${formattedDate}</div>
                <div class="event-category">${categoryDisplayName}</div>
            </div>
            <div class="card-body">
                <h5 class="card-title">${event.name}</h5>
                <p class="event-location">
                    <i class="fas fa-map-marker-alt me-1"></i> ${event.venue}, ${event.city}
                </p>
                <p class="card-text">${event.description.substring(0, 100)}...</p>
                <a href="event-details.html?id=${event.id}" class="btn btn-outline-primary">View Details</a>
            </div>
        </div>
    `;
    
    return col;
}

/**
 * Get the display name for a category
 * @param {string} category - The category key
 * @returns {string} - The display name
 */
function getCategoryDisplayName(category) {
    const categories = {
        'music': 'Music',
        'sports': 'Sports',
        'art': 'Art & Culture',
        'food': 'Food & Drink',
        'tech': 'Technology',
        'workshop': 'Workshop'
    };
    
    return categories[category] || 'Event';
}