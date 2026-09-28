const API_BASE_URL = "";


// ======================================================
// USER HELPERS
// ======================================================

function getCurrentUserId() {
    return localStorage.getItem("userId");
}

function getCurrentUserRole() {
    return localStorage.getItem("userRole");
}

function getCurrentUserName() {
    const role = getCurrentUserRole();

    if (role === "RIDER") {
        return localStorage.getItem("riderName") || "";
    }

    if (role === "DRIVER") {
        return localStorage.getItem("driverName") || "";
    }

    return "";
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>\"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    })[character]);
}

function storeCurrentUser(user) {
    const prefix = user.role.toLowerCase();
    localStorage.setItem("userId", user.id);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem(`${prefix}Name`, user.name || "");
    localStorage.setItem(`${prefix}Email`, user.email || "");
    localStorage.setItem(`${prefix}Phone`, user.phoneNumber || "");
}

function formatDepartureTime(value) {
    if (!value) return "Not specified";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}


// ======================================================
// PAGE NAVIGATION
// ======================================================

function showPage(page) {

    switch (page) {

        case "home":
            homePage();
            break;

        case "riderLogin":
            riderLoginPage();
            break;

        case "driverLogin":
            driverLoginPage();
            break;

        case "riderRegister":
            riderRegisterPage();
            break;

        case "driverRegister":
            driverRegisterPage();
            break;

        case "riderDashboard":
            riderDashboardPage();
            break;

        case "driverDashboard":
            driverDashboardPage();
            break;

        case "findRide":
            findRidePage();
            break;

        case "myRequests":
            myRequestsPage();
            break;

        case "offerRide":
            offerRidePage();
            break;

        case "rideRequests":
            rideRequestsPage();
            break;

        case "myRides":
            myRidesPage();
            break;

        case "riderAlerts":
            riderAlertsPage();
            break;

        case "driverAlerts":
            driverAlertsPage();
            break;

        case "riderProfile":
            riderProfilePage();
            break;

        case "driverProfile":
            driverProfilePage();
            break;

        default:
            homePage();
    }
}


// ======================================================
// HOME
// ======================================================

function homePage() {

    document.getElementById("navLinks").innerHTML = `
        <button onclick="showPage('home')">Home</button>
        <button onclick="showPage('riderLogin')">Rider Login</button>
        <button onclick="showPage('driverLogin')">Driver Login</button>
    `;

    document.getElementById("app").innerHTML = `

        <section class="home">

            <div class="home-box">

                <h1>RideSafety</h1>

                <p>
                    A simple and safe ride sharing platform.
                </p>

                <div class="home-login-buttons">

                    <button
                        class="primary-button"
                        onclick="showPage('riderLogin')">
                        Rider Login
                    </button>

                    <button
                        class="secondary-button"
                        onclick="showPage('driverLogin')">
                        Driver Login
                    </button>

                </div>

            </div>


            <div class="register-section">

                <h2>New User?</h2>

                <button
                    class="primary-button"
                    onclick="showPage('riderRegister')">
                    Register as Rider
                </button>

                <button
                    class="secondary-button"
                    onclick="showPage('driverRegister')">
                    Register as Driver
                </button>

            </div>

        </section>
    `;

}


// ======================================================
// RIDER LOGIN
// ======================================================

function riderLoginPage() {

    document.getElementById("navLinks").innerHTML = `
        <button onclick="showPage('home')">Home</button>
        <button onclick="showPage('riderRegister')">Register</button>
    `;

    document.getElementById("app").innerHTML = `

        <section class="form-section">

            <div class="form-card">

                <h2>Rider Login</h2>

                <form onsubmit="riderLogin(event)">

                    <label>Email</label>

                    <input
                        type="email"
                        id="riderLoginEmail"
                        autocomplete="username"
                        autofocus
                        required>


                    <label>Password</label>

                    <input
                        type="password"
                        id="riderLoginPassword"
                        autocomplete="current-password"
                        required>


                    <button
                        type="submit"
                        class="primary-button">
                        Login
                    </button>

                    <p class="form-message" role="alert" aria-live="polite"></p>

                </form>

            </div>

        </section>
    `;

    document.getElementById("riderLoginEmail").focus();
}


async function riderLogin(event) {
    await loginUser(event, "RIDER", "riderLoginEmail", "riderLoginPassword");
}

async function loginUser(event, expectedRole, emailId, passwordId) {
    event.preventDefault();
    const form = event.currentTarget;
    const submitButton = event.submitter;
    const message = form.querySelector(".form-message");
    message.textContent = "";
    if (submitButton) submitButton.disabled = true;
    const email = document.getElementById(emailId).value.trim();
    const password = document.getElementById(passwordId).value;

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new Error(await response.text() || "Login failed.");

        const user = await response.json();
        if (user.role !== expectedRole) {
            throw new Error(`This account is not registered as a ${expectedRole.toLowerCase()}.`);
        }

        storeCurrentUser(user);
        showPage(expectedRole === "RIDER" ? "riderDashboard" : "driverDashboard");
    } catch (error) {
        message.textContent = error.message || "Could not log in. Check the server connection and try again.";
        document.getElementById(passwordId).focus();
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
}


// ======================================================
// DRIVER LOGIN
// ======================================================

function driverLoginPage() {

    document.getElementById("navLinks").innerHTML = `
        <button onclick="showPage('home')">Home</button>
        <button onclick="showPage('driverRegister')">Register</button>
    `;

    document.getElementById("app").innerHTML = `

        <section class="form-section">

            <div class="form-card">

                <h2>Driver Login</h2>

                <form onsubmit="driverLogin(event)">

                    <label>Email</label>

                    <input
                        type="email"
                        id="driverLoginEmail"
                        autocomplete="username"
                        autofocus
                        required>


                    <label>Password</label>

                    <input
                        type="password"
                        id="driverLoginPassword"
                        autocomplete="current-password"
                        required>


                    <button
                        type="submit"
                        class="primary-button">
                        Login
                    </button>

                    <p class="form-message" role="alert" aria-live="polite"></p>

                </form>

            </div>

        </section>
    `;

    document.getElementById("driverLoginEmail").focus();
}


async function driverLogin(event) {
    await loginUser(event, "DRIVER", "driverLoginEmail", "driverLoginPassword");
}


// ======================================================
// RIDER REGISTER
// ======================================================

function riderRegisterPage() {

    document.getElementById("navLinks").innerHTML = `
        <button onclick="showPage('home')">Home</button>
        <button onclick="showPage('riderLogin')">Rider Login</button>
    `;

    document.getElementById("app").innerHTML = `

        <section class="form-section">

            <div class="form-card">

                <h2>Rider Registration</h2>

                <form onsubmit="registerRider(event)">

                    <label>Name</label>

                    <input
                        type="text"
                        id="riderName"
                        required>


                    <label>Email</label>

                    <input
                        type="email"
                        id="riderEmail"
                        required>


                    <label>Phone Number</label>

                    <input
                        type="text"
                        id="riderPhone"
                        required>


                    <label>Password</label>

                    <input
                        type="password"
                        id="riderPassword"
                        required>


                    <button
                        type="submit"
                        class="primary-button">
                        Register
                    </button>

                </form>

            </div>

        </section>
    `;
}


async function registerRider(event) {

    event.preventDefault();


    const userData = {

        name:
            document.getElementById("riderName").value.trim(),

        email:
            document.getElementById("riderEmail").value.trim(),

        phoneNumber:
            document.getElementById("riderPhone").value.trim(),

        password:
        document.getElementById("riderPassword").value,

        role: "RIDER"
    };


    try {

        const response = await fetch(
            `${API_BASE_URL}/users/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(userData)
            }
        );


        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(
                errorText || "Registration failed."
            );
        }


        const user = await response.json();


        localStorage.setItem(
            "riderUserId",
            user.id
        );

        localStorage.setItem(
            "userId",
            user.id
        );

        localStorage.setItem(
            "userRole",
            user.role
        );

        localStorage.setItem(
            "riderName",
            user.name
        );

        localStorage.setItem(
            "riderEmail",
            user.email
        );

        localStorage.setItem(
            "riderPhone",
            user.phoneNumber || ""
        );


        alert("Rider registration successful.");

        showPage("riderDashboard");

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


// ======================================================
// DRIVER REGISTER
// ======================================================

function driverRegisterPage() {

    document.getElementById("navLinks").innerHTML = `
        <button onclick="showPage('home')">Home</button>
        <button onclick="showPage('driverLogin')">Driver Login</button>
    `;

    document.getElementById("app").innerHTML = `

        <section class="form-section">

            <div class="form-card">

                <h2>Driver Registration</h2>

                <form onsubmit="registerDriver(event)">

                    <label>Name</label>

                    <input
                        type="text"
                        id="driverName"
                        required>


                    <label>Email</label>

                    <input
                        type="email"
                        id="driverEmail"
                        required>


                    <label>Phone Number</label>

                    <input
                        type="text"
                        id="driverPhone"
                        required>


                    <label>Password</label>

                    <input
                        type="password"
                        id="driverPassword"
                        required>


                    <button
                        type="submit"
                        class="primary-button">
                        Register
                    </button>

                </form>

            </div>

        </section>
    `;
}


async function registerDriver(event) {

    event.preventDefault();


    const driverData = {

        name:
            document.getElementById("driverName").value.trim(),

        email:
            document.getElementById("driverEmail").value.trim(),

        phoneNumber:
            document.getElementById("driverPhone").value.trim(),

        password:
        document.getElementById("driverPassword").value,

        role: "DRIVER"
    };


    try {

        const response = await fetch(
            `${API_BASE_URL}/users/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(driverData)
            }
        );


        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(
                errorText || "Registration failed."
            );
        }


        const user = await response.json();


        localStorage.setItem(
            "driverUserId",
            user.id
        );

        localStorage.setItem(
            "userId",
            user.id
        );

        localStorage.setItem(
            "userRole",
            user.role
        );

        localStorage.setItem(
            "driverName",
            user.name
        );

        localStorage.setItem(
            "driverEmail",
            user.email
        );

        localStorage.setItem(
            "driverPhone",
            user.phoneNumber || ""
        );


        alert("Driver registration successful.");

        showPage("driverDashboard");

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


// ======================================================
// RIDER NAVBAR
// ======================================================

function riderNavbar() {

    document.getElementById("navLinks").innerHTML = `

        <button onclick="showPage('riderDashboard')">
            Dashboard
        </button>

        <button onclick="showPage('findRide')">
            Find Ride
        </button>

        <button onclick="showPage('myRequests')">
            My Requests
        </button>

        <button onclick="showPage('riderAlerts')">
            Alerts
        </button>

        <button onclick="showPage('riderProfile')">
            Profile
        </button>

        <button onclick="logout()">
            Logout
        </button>
    `;
}


// ======================================================
// DRIVER NAVBAR
// ======================================================

function driverNavbar() {

    document.getElementById("navLinks").innerHTML = `

        <button onclick="showPage('driverDashboard')">
            Dashboard
        </button>

        <button onclick="showPage('offerRide')">
            Offer Ride
        </button>

        <button onclick="showPage('myRides')">
            My Rides
        </button>

        <button onclick="showPage('rideRequests')">
            Requests
        </button>

        <button onclick="showPage('driverAlerts')">
            Alerts
        </button>

        <button onclick="showPage('driverProfile')">
            Profile
        </button>

        <button onclick="logout()">
            Logout
        </button>
    `;
}


// ======================================================
// RIDER DASHBOARD
// ======================================================

function riderDashboardPage() {

    riderNavbar();

    const name = getCurrentUserName();

    document.getElementById("app").innerHTML = `

        <section class="dashboard">

            <h2>Rider Dashboard</h2>

            <p>
                Welcome, ${escapeHtml(name || "Rider")}.
            </p>


            <div class="dashboard-grid">

                <div class="dashboard-card">

                    <h3>Find a Ride</h3>

                    <p>
                        View rides offered by drivers.
                    </p>

                    <button
                        class="primary-button"
                        onclick="showPage('findRide')">
                        Find Ride
                    </button>

                </div>


                <div class="dashboard-card">

                    <h3>My Requests</h3>

                    <p>
                        View your ride requests.
                    </p>

                    <button
                        class="primary-button"
                        onclick="showPage('myRequests')">
                        My Requests
                    </button>

                </div>


                <div class="dashboard-card">

                    <h3>Alerts</h3>

                    <p>
                        View your notifications.
                    </p>

                    <button
                        class="primary-button"
                        onclick="showPage('riderAlerts')">
                        View Alerts
                    </button>

                </div>


                <div class="dashboard-card">

                    <h3>Profile</h3>

                    <p>
                        View your account details.
                    </p>

                    <button
                        class="primary-button"
                        onclick="showPage('riderProfile')">
                        Profile
                    </button>

                </div>

            </div>

        </section>
    `;
}


// ======================================================
// DRIVER DASHBOARD
// ======================================================

function driverDashboardPage() {

    driverNavbar();

    const name = getCurrentUserName();

    document.getElementById("app").innerHTML = `

        <section class="dashboard">

            <h2>Driver Dashboard</h2>

            <p>
                Welcome, ${escapeHtml(name || "Driver")}.
            </p>


            <div class="dashboard-grid">

                <div class="dashboard-card">

                    <h3>Offer Ride</h3>

                    <p>
                        Create a new ride.
                    </p>

                    <button
                        class="primary-button"
                        onclick="showPage('offerRide')">
                        Offer Ride
                    </button>

                </div>


                <div class="dashboard-card">

                    <h3>My Rides</h3>

                    <p>
                        View your offered rides.
                    </p>

                    <button
                        class="primary-button"
                        onclick="showPage('myRides')">
                        My Rides
                    </button>

                </div>


                <div class="dashboard-card">

                    <h3>Ride Requests</h3>

                    <p>
                        View rider requests.
                    </p>

                    <button
                        class="primary-button"
                        onclick="showPage('rideRequests')">
                        Requests
                    </button>

                </div>


                <div class="dashboard-card">

                    <h3>Alerts</h3>

                    <p>
                        View your notifications.
                    </p>

                    <button
                        class="primary-button"
                        onclick="showPage('driverAlerts')">
                        Alerts
                    </button>

                </div>

            </div>

        </section>
    `;
}


// ======================================================
// FIND RIDE - RIDER
// ======================================================

async function findRidePage() {
    riderNavbar();
    document.getElementById("app").innerHTML = `
        <section class="content-section">
            <h2>Find a Ride</h2>
            <p class="section-description">Search available rides by route.</p>
            <form class="search-form" onsubmit="searchRides(event)">
                <label>From<input id="searchOrigin" required></label>
                <label>To<input id="searchDestination" required></label>
                <button class="primary-button" type="submit">Search</button>
                <button class="secondary-button" type="button" onclick="loadRides()">Show all</button>
            </form>
            <div id="rideResults" class="ride-list" aria-live="polite"></div>
        </section>
    `;
    await loadRides();
}

async function loadRides(search = null) {
    const results = document.getElementById("rideResults");
    if (!results) return;
    results.innerHTML = '<div class="empty-message">Loading rides...</div>';

    try {
        const url = search
            ? `${API_BASE_URL}/rides/search?origin=${encodeURIComponent(search.origin)}&destination=${encodeURIComponent(search.destination)}`
            : `${API_BASE_URL}/rides`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(await response.text() || "Could not load rides.");
        const rides = await response.json();

        if (!rides.length) {
            results.innerHTML = '<div class="empty-message">No rides found for this route.</div>';
            return;
        }

        results.innerHTML = rides.map(ride => `
            <article class="ride-card">
                <h3>${escapeHtml(ride.origin)} → ${escapeHtml(ride.destination)}</h3>
                <p>Departure: ${escapeHtml(formatDepartureTime(ride.departureTime))}</p>
                <p>Available seats: ${escapeHtml(ride.availableSeats)}</p>
                <p>Driver: ${escapeHtml(ride.driver?.name || "Driver")}</p>
                ${Number.isFinite(Number(ride.driver?.id)) ? `<button class="link-button" onclick="viewUserProfile(${Number(ride.driver.id)})">View driver profile</button>` : ""}
                <button class="primary-button" onclick="requestRide(${Number(ride.id)})" ${Number(ride.availableSeats) < 1 ? "disabled" : ""}>Request Ride</button>
            </article>
        `).join("");
    } catch (error) {
        results.innerHTML = `<div class="empty-message">${escapeHtml(error.message || "Could not load rides.")}</div>`;
    }
}

async function searchRides(event) {
    event.preventDefault();
    await loadRides({
        origin: document.getElementById("searchOrigin").value.trim(),
        destination: document.getElementById("searchDestination").value.trim()
    });
}


// ======================================================
// REQUEST RIDE
// ======================================================

async function requestRide(rideId) {

    const riderId = getCurrentUserId();


    if (!riderId) {

        alert(
            "Rider account not found. Please login again."
        );

        showPage("riderLogin");

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/ride-requests/create`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    rideId: Number(rideId),

                    riderId: Number(riderId)

                })
            }
        );


        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(
                errorText || "Could not send ride request."
            );
        }


        await response.json();


        alert("Ride request sent successfully.");

        showPage("myRequests");

    } catch (error) {

        console.error(error);

        alert(
            "Ride request failed.\n\n" +
            error.message
        );
    }
}


// ======================================================
// MY REQUESTS - RIDER
// ======================================================

async function myRequestsPage() {

    riderNavbar();


    const riderId = getCurrentUserId();


    if (!riderId) {

        document.getElementById("app").innerHTML = `

            <section class="content-section">

                <div class="empty-message">

                    Rider ID not found.

                </div>

            </section>
        `;

        return;
    }


    let requests = [];


    try {

        const response = await fetch(
            `${API_BASE_URL}/ride-requests/rider/${riderId}`
        );


        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(
                errorText || "Could not load requests."
            );
        }


        requests = await response.json();

    } catch (error) {

        console.error(error);

        document.getElementById("app").innerHTML = `

            <section class="content-section">

                <h2>My Requests</h2>

                <div class="empty-message">

                    Could not load requests.

                    <br><br>

                    ${escapeHtml(error.message)}

                </div>

            </section>
        `;

        return;
    }


    let requestHTML = "";


    if (!requests || requests.length === 0) {

        requestHTML = `

            <div class="empty-message">

                You have not requested any rides yet.

            </div>
        `;

    } else {

        requestHTML = requests.map(request => {
            const status = request.status || "PENDING";
            const ride = request.ride || {};
            const driver = ride.driver || {};
            const actionHTML = status === "PENDING"
                ? `<button class="danger-button" onclick="cancelRideRequest(${Number(request.id)})">Cancel request</button>`
                : "";
            const profileHTML = Number.isFinite(Number(driver.id))
                ? `<button class="link-button" onclick="viewUserProfile(${Number(driver.id)})">View driver profile</button>`
                : "";

            return `
                <div class="request-card">
                    <h3>${escapeHtml(ride.origin || "Ride")} → ${escapeHtml(ride.destination || "")}</h3>
                    <p>Departure: ${escapeHtml(formatDepartureTime(ride.departureTime))}</p>
                    <p>Driver: ${escapeHtml(driver.name || "Driver")}</p>
                    <p>Status: <span class="status status-${escapeHtml(status.toLowerCase())}">${escapeHtml(status)}</span></p>
                    <div class="action-buttons">${profileHTML}${actionHTML}</div>
                </div>
            `;

        }).join("");
    }


    document.getElementById("app").innerHTML = `

        <section class="content-section">

            <h2>My Requests</h2>

            <div class="request-list">

                ${requestHTML}

            </div>

        </section>
    `;
}

async function cancelRideRequest(requestId) {
    const riderId = getCurrentUserId();
    if (!riderId) {
        showPage("riderLogin");
        return;
    }
    if (!window.confirm("Cancel this ride request?")) return;

    try {
        const response = await fetch(
            `${API_BASE_URL}/ride-requests/${requestId}/cancel?riderId=${encodeURIComponent(riderId)}`,
            { method: "PUT" }
        );
        if (!response.ok) throw new Error(await response.text() || "Could not cancel request.");
        await myRequestsPage();
    } catch (error) {
        alert(error.message || "Could not cancel request.");
    }
}


// ======================================================
// OFFER RIDE PAGE
// ======================================================

function offerRidePage() {

    driverNavbar();


    document.getElementById("app").innerHTML = `

        <section class="form-section">

            <div class="form-card wide-card">

                <h2>Offer Ride</h2>

                <form onsubmit="offerRide(event)">

                    <label>From</label>

                    <input
                        type="text"
                        id="rideFrom"
                        required>


                    <label>To</label>

                    <input
                        type="text"
                        id="rideTo"
                        required>


                    <label>Date</label>

                    <input
                        type="date"
                        id="rideDate"
                        required>


                    <label>Time</label>

                    <input
                        type="time"
                        id="rideTime"
                        required>


                    <label>Available Seats</label>

                    <input
                        type="number"
                        id="rideSeats"
                        min="1"
                        required>


                    <button
                        type="submit"
                        class="primary-button">

                        Offer Ride

                    </button>

                </form>

            </div>

        </section>
    `;
}


// ======================================================
// OFFER RIDE - SAVE TO MYSQL
// ======================================================

async function offerRide(event) {

    event.preventDefault();


    const driverId = getCurrentUserId();


    if (!driverId) {

        alert(
            "Driver account not found. Please login again."
        );

        showPage("driverLogin");

        return;
    }


    const from =
        document.getElementById("rideFrom").value.trim();

    const to =
        document.getElementById("rideTo").value.trim();

    const date =
        document.getElementById("rideDate").value;

    const time =
        document.getElementById("rideTime").value;

    const seats =
        Number(
            document.getElementById("rideSeats").value
        );


    /*
       RideOfferController accepts RideOffer directly.

       The RideOffer is expected to contain:
       driver
       origin
       destination
       date
       time
       availableSeats
    */

    const rideData = {
        driver: { id: Number(driverId) },
        origin: from,
        destination: to,
        departureTime: `${date}T${time}:00`,
        availableSeats: seats
    };


    try {

        const response = await fetch(
            `${API_BASE_URL}/rides/create`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(rideData)
            }
        );


        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(
                errorText || "Could not create ride."
            );
        }


        const ride = await response.json();


        console.log(
            "Ride created:",
            ride
        );


        alert("Ride created successfully.");


        showPage("myRides");

    } catch (error) {

        console.error(error);

        alert(
            "Ride creation failed.\n\n" +
            error.message
        );
    }
}


// ======================================================
// MY RIDES - DRIVER
// ======================================================

async function myRidesPage() {

    driverNavbar();


    const driverId = getCurrentUserId();


    if (!driverId) {

        document.getElementById("app").innerHTML = `

            <section class="content-section">

                <div class="empty-message">

                    Driver ID not found.

                </div>

            </section>
        `;

        return;
    }


    let rides = [];


    try {

        const response = await fetch(
            `${API_BASE_URL}/rides/driver/${driverId}`
        );


        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(
                errorText || "Could not load your rides."
            );
        }


        rides = await response.json();

    } catch (error) {

        console.error(error);

        document.getElementById("app").innerHTML = `

            <section class="content-section">

                <h2>My Rides</h2>

                <div class="empty-message">

                    Could not load your rides.

                    <br><br>

                    ${escapeHtml(error.message)}

                </div>

            </section>
        `;

        return;
    }


    let rideHTML = "";


    if (!rides || rides.length === 0) {

        rideHTML = `

            <div class="empty-message">

                You have not created any rides yet.

            </div>
        `;

    } else {

        rideHTML = rides.map(ride => {

            const origin =
                ride.origin || "";

            const destination =
                ride.destination || "";

            const seats =
                ride.availableSeats ??
                ride.seats ??
                "";


            return `

                <div class="ride-card">

                    <h3>${escapeHtml(origin)} → ${escapeHtml(destination)}</h3>
                    <p>Departure: ${escapeHtml(formatDepartureTime(ride.departureTime))}</p>
                    <p>Available seats: ${escapeHtml(seats)}</p>
                    <button class="danger-button" onclick="deleteRide(${Number(ride.id)})">Delete Ride</button>

                </div>
            `;

        }).join("");
    }


    document.getElementById("app").innerHTML = `

        <section class="content-section">

            <h2>My Rides</h2>

            <div class="ride-list">

                ${rideHTML}

            </div>

        </section>
    `;
}

async function deleteRide(rideId) {
    if (!window.confirm("Delete this ride and its availability?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/rides/${rideId}`, { method: "DELETE" });
        if (!response.ok) throw new Error(await response.text() || "Could not delete ride.");
        await myRidesPage();
    } catch (error) {
        alert(error.message || "Could not delete ride.");
    }
}


// ======================================================
// DRIVER RIDE REQUESTS
// ======================================================

async function rideRequestsPage() {

    driverNavbar();


    const driverId = getCurrentUserId();


    if (!driverId) {

        document.getElementById("app").innerHTML = `

            <section class="content-section">

                <div class="empty-message">

                    Driver ID not found.

                </div>

            </section>
        `;

        return;
    }


    let rides = [];


    try {

        const response = await fetch(
            `${API_BASE_URL}/rides/driver/${driverId}`
        );


        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(
                errorText || "Could not load driver rides."
            );
        }


        rides = await response.json();

    } catch (error) {

        console.error(error);

        document.getElementById("app").innerHTML = `

            <section class="content-section">

                <h2>Ride Requests</h2>

                <div class="empty-message">

                    ${escapeHtml(error.message)}

                </div>

            </section>
        `;

        return;
    }


    if (!rides || rides.length === 0) {

        document.getElementById("app").innerHTML = `

            <section class="content-section">

                <h2>Ride Requests</h2>

                <div class="empty-message">

                    You have not created any rides yet.

                </div>

            </section>
        `;

        return;
    }


    let requestHTML = "";


    for (const ride of rides) {

        try {

            const response = await fetch(
                `${API_BASE_URL}/ride-requests/ride/${ride.id}`
            );


            if (!response.ok) {
                continue;
            }


            const requests = await response.json();


            if (!requests || requests.length === 0) {

                requestHTML += `

                    <div class="request-card">

                        <h3>
                            ${escapeHtml(ride.origin || "")}
                            →
                            ${escapeHtml(ride.destination || "")}
                        </h3>

                        <p>
                            No requests for this ride.
                        </p>

                    </div>
                `;

                continue;
            }


            requests.forEach(request => {

                const riderName =
                    request.rider?.name ||
                    request.user?.name ||
                    "Rider";


                const status =
                    request.status || "Pending";


                let buttons = "";

                const riderProfile = Number.isFinite(Number(request.rider?.id))
                    ? `<button class="link-button" onclick="viewUserProfile(${Number(request.rider.id)})">View rider profile</button>`
                    : "";


                if (
                    status.toUpperCase() === "PENDING"
                ) {

                    buttons = `

                        <button class="primary-button" onclick="approveRequest(${Number(request.id)})">Accept</button>
                        <button class="danger-button" onclick="rejectRequest(${Number(request.id)})">Reject</button>
                    `;
                }


                requestHTML += `

                    <div class="request-card">

                        <h3>
                            ${escapeHtml(ride.origin || "")}
                            →
                            ${escapeHtml(ride.destination || "")}
                        </h3>

                        <p>
                            Rider:
                            ${escapeHtml(riderName)}
                        </p>

                        <p>
                            Request ID:
                            ${escapeHtml(request.id)}
                        </p>

                        <p>
                            Status:
                            <span class="status status-${escapeHtml(status.toLowerCase())}">
                                ${escapeHtml(status)}
                            </span>
                        </p>

                        <div class="action-buttons">${riderProfile}${buttons}</div>

                    </div>
                `;
            });

        } catch (error) {

            console.error(
                "Could not load requests for ride:",
                ride.id,
                error
            );
        }
    }


    if (!requestHTML) {

        requestHTML = `

            <div class="empty-message">

                No ride requests found.

            </div>
        `;
    }


    document.getElementById("app").innerHTML = `

        <section class="content-section">

            <h2>Ride Requests</h2>

            <div class="request-list">

                ${requestHTML}

            </div>

        </section>
    `;
}


// ======================================================
// APPROVE REQUEST
// ======================================================

async function approveRequest(requestId) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/ride-requests/${requestId}/approve`,
            {
                method: "PUT"
            }
        );


        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(
                errorText || "Could not approve request."
            );
        }


        await response.json();


        alert("Ride request accepted.");

        showPage("rideRequests");

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


// ======================================================
// REJECT REQUEST
// ======================================================

async function rejectRequest(requestId) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/ride-requests/${requestId}/reject`,
            {
                method: "PUT"
            }
        );


        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(
                errorText || "Could not reject request."
            );
        }


        await response.json();


        alert("Ride request rejected.");

        showPage("rideRequests");

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


// ======================================================
// RIDER ALERTS
// ======================================================

async function riderAlertsPage() {

    riderNavbar();

    await showNotifications();
}


// ======================================================
// DRIVER ALERTS
// ======================================================

async function driverAlertsPage() {

    driverNavbar();

    await showNotifications();
}


// ======================================================
// NOTIFICATIONS
// ======================================================

async function showNotifications() {

    const userId = getCurrentUserId();


    if (!userId) {

        document.getElementById("app").innerHTML = `

            <section class="content-section">

                <div class="empty-message">

                    User ID not found.

                </div>

            </section>
        `;

        return;
    }


    let notifications = [];


    try {

        const response = await fetch(
            `${API_BASE_URL}/notifications/user/${userId}`
        );


        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(
                errorText || "Could not load notifications."
            );
        }


        notifications = await response.json();

    } catch (error) {

        console.error(error);

        document.getElementById("app").innerHTML = `

            <section class="content-section">

                <h2>Alerts</h2>

                <div class="empty-message">

                    Could not load alerts.

                    <br><br>

                    ${escapeHtml(error.message)}

                </div>

            </section>
        `;

        return;
    }


    let alertHTML = "";


    if (!notifications || notifications.length === 0) {

        alertHTML = `

            <div class="empty-message">

                No notifications.

            </div>
        `;

    } else {

        alertHTML = notifications.map(notification => {

            return `

                <div class="alert-card">

                    <p>
                        ${escapeHtml(notification.message ||
            notification.content ||
            "Notification")}
                    </p>

                    ${
                (notification.read ?? notification.isRead) === false
                    ?
                    `
                        <button
                            class="secondary-button"
                            onclick="markNotificationRead(${Number(notification.id)})">

                            Mark as Read

                        </button>
                        `
                    :
                    ""
            }

                </div>
            `;

        }).join("");
    }


    document.getElementById("app").innerHTML = `

        <section class="content-section">

            <h2>Alerts</h2>

            <div class="alert-list">

                ${alertHTML}

            </div>

        </section>
    `;
}


// ======================================================
// MARK NOTIFICATION READ
// ======================================================

async function markNotificationRead(notificationId) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/notifications/${notificationId}/read`,
            {
                method: "PUT"
            }
        );


        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(
                errorText || "Could not mark notification as read."
            );
        }


        const role = getCurrentUserRole();

        if (role === "RIDER") {
            showPage("riderAlerts");
        } else {
            showPage("driverAlerts");
        }

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


// ======================================================
// RIDER PROFILE
// ======================================================

async function riderProfilePage() {
    riderNavbar();
    await renderUserProfile(getCurrentUserId(), true);
}


// ======================================================
// DRIVER PROFILE
// ======================================================

async function driverProfilePage() {
    driverNavbar();
    await renderUserProfile(getCurrentUserId(), true);
}

async function viewUserProfile(userId) {
    if (getCurrentUserRole() === "RIDER") riderNavbar();
    else if (getCurrentUserRole() === "DRIVER") driverNavbar();
    else {
        showPage("home");
        return;
    }
    await renderUserProfile(userId, false);
}

async function renderUserProfile(userId, editable) {
    if (!userId) {
        document.getElementById("app").innerHTML = '<section class="content-section"><div class="empty-message">User ID not found. Please log in again.</div></section>';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        if (!response.ok) throw new Error(await response.text() || "Could not load profile.");
        const user = await response.json();
        const profileContent = editable ? `
            <form class="profile-form" onsubmit="updateProfile(event, ${Number(user.id)})">
                <p><strong>Account ID:</strong> ${escapeHtml(user.id)}</p>
                <label>Name<input name="name" value="${escapeHtml(user.name)}" required></label>
                <label>Email<input name="email" type="email" value="${escapeHtml(user.email)}" required></label>
                <label>Phone<input name="phoneNumber" value="${escapeHtml(user.phoneNumber || "")}" required></label>
                <p><strong>Role:</strong> ${escapeHtml(user.role)}</p>
                <div class="profile-actions">
                    <button class="primary-button" type="submit">Save changes</button>
                    <button class="danger-button" type="button" onclick="deleteProfile(${Number(user.id)})">Delete profile</button>
                </div>
            </form>
        ` : `
            <div class="profile-details">
                <p><strong>Account ID:</strong> ${escapeHtml(user.id)}</p>
                <p><strong>Name:</strong> ${escapeHtml(user.name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
                <p><strong>Phone:</strong> ${escapeHtml(user.phoneNumber || "")}</p>
                <p><strong>Role:</strong> ${escapeHtml(user.role)}</p>
            </div>
        `;
        document.getElementById("app").innerHTML = `
            <section class="content-section">
                <h2>${editable ? "My Profile" : "Profile"}</h2>
                <div class="profile-card">${profileContent}</div>
            </section>
        `;
    } catch (error) {
        document.getElementById("app").innerHTML = `<section class="content-section"><div class="empty-message">${escapeHtml(error.message || "Could not load profile.")}</div></section>`;
    }
}

async function updateProfile(event, userId) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const changes = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(changes)
        });
        if (!response.ok) throw new Error(await response.text() || "Could not update profile.");
        const user = await response.json();
        storeCurrentUser(user);
        alert("Profile updated.");
        await renderUserProfile(userId, true);
    } catch (error) {
        alert(error.message || "Could not update profile.");
    }
}

async function deleteProfile(userId) {
    if (!window.confirm("Delete your profile? This cannot be undone.")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, { method: "DELETE" });
        if (!response.ok) throw new Error(await response.text() || "Could not delete profile.");
        ["userId", "userRole", "riderName", "riderEmail", "riderPhone", "driverName", "driverEmail", "driverPhone"].forEach(key => localStorage.removeItem(key));
        alert("Profile deleted.");
        showPage("home");
    } catch (error) {
        alert(error.message || "Could not delete profile.");
    }
}


// ======================================================
// LOGOUT
// ======================================================

function logout() {

    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");

    alert("Logged out successfully.");

    showPage("home");
}


// ======================================================
// START APPLICATION
// ======================================================

showPage("home");