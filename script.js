// Business Logic

// Place Constructor
function Place(location, landmarks, timeOfYear, notes) {
  this.location = location;
  this.landmarks = landmarks;
  this.timeOfYear = timeOfYear;
  this.notes = notes;
}

// Place Prototype Methods
Place.prototype.fullLocation = function() {
  return this.location;
};

// PlaceBook Constructor
function PlaceBook() {
  this.places = {};
  this.currentId = 0;
}

// PlaceBook Prototype Methods
PlaceBook.prototype.addPlace = function(place) {
  place.id = this.assignId();
  this.places[place.id] = place;
};

PlaceBook.prototype.assignId = function() {
  this.currentId += 1;
  return this.currentId;
};

PlaceBook.prototype.findPlace = function(id) {
  if (this.places[id] !== undefined) {
    return this.places[id];
  }
  return false;
};

PlaceBook.prototype.deletePlace = function(id) {
  if (this.places[id] === undefined) {
    return false;
  }
  delete this.places[id];
  return true;
};

// User Interface Logic

let placeBook = new PlaceBook();

// Display all places in the list
function displayPlaces() {
  const placesList = document.getElementById("places-list");
  placesList.innerHTML = "";
  
  const placeIds = Object.keys(placeBook.places);
  
  if (placeIds.length === 0) {
    placesList.innerHTML = '<p class="empty-message">No places added yet. Start by adding your first destination!</p>';
    return;
  }
  
  placeIds.forEach(function(id) {
    const place = placeBook.findPlace(id);
    const placeItem = document.createElement("div");
    placeItem.classList.add("place-item");
    placeItem.setAttribute("data-id", id);
    
    const placeName = document.createElement("span");
    placeName.classList.add("place-name");
    placeName.textContent = place.location;
    
    placeItem.appendChild(placeName);
    placesList.appendChild(placeItem);
  });
}

// Display details of a selected place
function showPlaceDetails(placeId) {
  const place = placeBook.findPlace(placeId);
  
  if (!place) {
    return;
  }
  
  document.getElementById("detail-location").textContent = place.location;
  document.getElementById("detail-landmarks").textContent = place.landmarks;
  document.getElementById("detail-time").textContent = place.timeOfYear;
  document.getElementById("detail-notes").textContent = place.notes;
  
  const placeDetails = document.getElementById("place-details");
  placeDetails.style.display = "block";
  
  // Store current place id for deletion
  placeDetails.setAttribute("data-current-id", placeId);
  
  // Highlight selected place
  const allPlaceItems = document.querySelectorAll(".place-item");
  allPlaceItems.forEach(function(item) {
    item.classList.remove("active");
  });
  
  const selectedItem = document.querySelector(`[data-id="${placeId}"]`);
  if (selectedItem) {
    selectedItem.classList.add("active");
  }
}

// Handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  
  const location = document.getElementById("location").value;
  const landmarks = document.getElementById("landmarks").value;
  const timeOfYear = document.getElementById("time-of-year").value;
  const notes = document.getElementById("notes").value;
  
  // Create new place
  const newPlace = new Place(location, landmarks, timeOfYear, notes);
  placeBook.addPlace(newPlace);
  
  // Reset form
  document.getElementById("new-place-form").reset();
  
  // Update display
  displayPlaces();
}

// Handle place item click
function handlePlaceClick(event) {
  const placeItem = event.target.closest(".place-item");
  if (placeItem) {
    const placeId = placeItem.getAttribute("data-id");
    showPlaceDetails(placeId);
  }
}

// Handle delete button click
function handleDeleteClick() {
  const placeDetails = document.getElementById("place-details");
  const currentId = placeDetails.getAttribute("data-current-id");
  
  if (currentId && confirm("Are you sure you want to delete this place?")) {
    placeBook.deletePlace(currentId);
    
    // Hide details
    placeDetails.style.display = "none";
    
    // Update display
    displayPlaces();
  }
}

// Initialize event listeners when DOM is loaded
window.addEventListener("load", function() {
  // Form submission
  document.getElementById("new-place-form").addEventListener("submit", handleFormSubmit);
  
  // Place list clicks (event delegation)
  document.getElementById("places-list").addEventListener("click", handlePlaceClick);
  
  // Delete button
  document.getElementById("delete-btn").addEventListener("click", handleDeleteClick);
});