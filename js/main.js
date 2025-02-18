/******************************************************************************
 * WEB422 -- Assignment 2
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Arshia Keshavarz Motamedi Student ID: 158672220 Date: 2/17/2025
 ******************************************************************************/

let page = 1;
let perPage = 10;
let searchName = null;

const apiUrl = "http://localhost:3000";

// DOM Elements
const listingsTable = document.getElementById("listingsTable");
const previousPageBtn = document.getElementById("previous-page");
const currentPageBtn = document.getElementById("current-page");
const nextPageBtn = document.getElementById("next-page");
const searchBtn = document.getElementById("search");
const clearFormBtn = document.getElementById("clearForm");
const nameInput = document.getElementById("name");

// Load Listings Data
async function loadListingsData() {
    let url = `${apiUrl}/api/listings?page=${page}&perPage=${perPage}`;
    if (searchName) {
        url += `&name=${searchName}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length === 0) {
            listingsTable.innerHTML = "<tr><td colspan='4'>No data available</td></tr>";
        } else {
            populateTable(data);
        }
    } catch (error) {
        console.error("Error fetching listings:", error);
        listingsTable.innerHTML = "<tr><td colspan='4'>Error loading data</td></tr>";
    }
}

// Populate Table
function populateTable(listings) {
    const tbody = listingsTable.querySelector("tbody");
    tbody.innerHTML = "";

    listings.forEach((listing) => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", listing._id);

        row.innerHTML = `
            <td>${listing.name}</td>
            <td>${listing.room_type}</td>
            <td>${listing.address.street}</td>
            <td>${listing.summary}<br>Accommodates: ${listing.accommodates}<br>Rating: ${listing.review_scores ? listing.review_scores.review_scores_rating : "not available"} (${listing.number_of_reviews} Reviews)</td>
        `;
        tbody.appendChild(row);
    });

    tbody.querySelectorAll("tr").forEach((row) => {
        row.addEventListener("click", () => showListingDetails(row.getAttribute("data-id")));
    });
}

// Show Listing Details in Modal
async function showListingDetails(id) {
    try {
        const response = await fetch(`${apiUrl}/api/listings/${id}`);
        const listing = await response.json();

        console.log(listing);

        const modalBody = document.querySelector("#detailsModal .modal-body");
        imageOfHouse = listing.images.picture_url ? `<img src="${listing.images.picture_url}" class="img-fluid mb-3" alt="${listing.name}">` : `<p><strong>Image not available</strong></p>`
        modalBody.innerHTML = `
            ${imageOfHouse}
            <p><strong>Neighbourhood Overview:</strong> ${listing.neighborhood_overview}</p>
            <p><strong>Price:</strong> ${listing.price.$numberDecimal}</p>
            <p><strong>Room Type:</strong> ${listing.room_type}</p>
            <p><strong>Bed Type:</strong> ${listing.bed_type}</p>
            <p><strong>Number of Beds:</strong> ${listing.beds}</p>
        `;

        const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
        modal.show();
    } catch (error) {
        console.error("Error fetching listing details:", error);
    }
}

// Event Listeners
searchBtn.addEventListener("click", () => {
    searchName = nameInput.value.trim();
    page = 1;
    loadListingsData();
});

clearFormBtn.addEventListener("click", () => {
    nameInput.value = "";
    searchName = null;
    page = 1;
    loadListingsData();
});

previousPageBtn.addEventListener("click", () => {
    if (page > 1) {
        page--;
        loadListingsData();
    }
});

nextPageBtn.addEventListener("click", () => {
    page++;
    loadListingsData();
});

// Initialize
loadListingsData();