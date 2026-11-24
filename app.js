const API_URL = "https://bags-api-elec2.vercel.app/api/v1";

const API_KEY = "ey-pi-ay";

const FETCH_OPTIONS = {
    headers: { "x-api-key": API_KEY }
};


//----------------------------------------------------------------------------------------------------------
// USER SESSION

let authToken = sessionStorage.getItem("authToken") || null;
let userRole = sessionStorage.getItem("userRole") || null;
let selectedBag = null;
let isWishlisted = false;

function getFetchOptions() {
    const headers = {
        "x-api-key": API_KEY
    };

    if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
    }

    return { headers };
}

// RESTRICT GUEST ACCESS TO COMPARE AND PERSONALITY

function restrictGuestAccess() {

    const restrictedPages = [
        "Totetally - ComparisonWeb/index.html",
        "BagItUp - PersonalityWebsite/index.html"
    ];

    document.querySelectorAll("a[href]").forEach(link => {

        link.addEventListener("click", function(event) {

            const destination = link.getAttribute("href");

            if (restrictedPages.includes(destination)) {

                const currentToken = sessionStorage.getItem("authToken");

                if (!currentToken) {
                    event.preventDefault();
                    window.location.href = "/loginscreen.html";
                }

            }

        });

    });

}

restrictGuestAccess();

//----------------------------------------------------------------------------------------------------------
// GET ALL BAGS

async function loadBags() {
    try {
        const response = await fetch(`${API_URL}/bags`, getFetchOptions());
        if (!response.ok) throw new Error("API request failed.");

        const data = await response.json();
        allBags = data.bags;
        displayBags(allBags);
    }
    catch (error) {
        console.error(error);

        const bagList = document.getElementById("bagList");

        if (bagList) {
            bagList.innerHTML = "Unable to connect to the API.";
        }
    }
}


//----------------------------------------------------------------------------------------------------------
// DISPLAY BAGS / BAG CARDS

function displayBags(bags) {
    const bagList = document.getElementById("bagList");

    if (!bagList) return;

    bagList.innerHTML = "";
    bags.sort((a, b) => a.name.localeCompare(b.name));

    bags.forEach(bag => {

        const card = document.createElement("div");

        card.className = "bag-card";

        card.innerHTML = `
            <img src="images/${bag.id}.png" alt="${bag.name}">
            <p class="bag-collection">${bag.collection}</p>
            <h3>${bag.name}</h3>
            <span class="bag-type">${bag.type}</span>

            <div class="bag-card-p">
                <p><span>Brand:</span> ${bag.brand}</p>
                <p><span>Price:</span> $${bag.price}</p>
                <p><span>Rating:</span> ${bag.rating}</p>
            </div>

            <button onclick="viewBag(${bag.id})">
                View Details
            </button>
        `;

        bagList.appendChild(card);
    });
}


//----------------------------------------------------------------------------------------------------------
// GET ONE BAG

async function viewBag(id) {

    // CHECK IF USER IS LOGGED IN
    if (!authToken) {
        window.location.href = "/loginscreen.html";
        return;
    }

    try {
        // OPEN THE SEPARATE BAG DETAILS PAGE
        window.location.href = `/bagdetails.html?id=${id}`;
    }
    catch (error) {
        console.error(error);
        alert("Unable to retrieve bag.");
    }
}

//----------------------------------------------------------------------------------------------------------
// LOAD BAG DETAILS PAGE

async function loadBagDetails() {
    const productPage = document.querySelector(".product-page");
    const params = new URLSearchParams(window.location.search);
    const bagId = params.get("id");

    if (!bagId) {
        alert("No bag selected.");
        window.location.href = "index.html";
        return;
    }

    if (!authToken) {
        window.location.href = "/loginscreen.html";
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/bags/${bagId}`,
            getFetchOptions()
        );

        if (!response.ok) {
            throw new Error("Unable to retrieve bag.");
        }

        const bag = await response.json();
        currentBagId = bag.id;

        // BASIC INFORMATION
       document.getElementById("bagCollection").textContent = bag.collection || "";
        document.getElementById("bagImage").src = `images/${bag.id}.png`;
        document.getElementById("bagName").textContent = bag.name;
        document.getElementById("bagPrice").textContent = `$${bag.price}`;
        document.getElementById("bagSummary").textContent =
            `${bag.material} | ${bag.size} | ${bag.color}`;

        // IMAGE CAPTION
        document.getElementById("imageBagName").textContent = bag.name;
        document.getElementById("imageBrand").textContent = bag.brand;
        document.getElementById("imageCollection").textContent = bag.collection;
        document.getElementById("bagRating").textContent = bag.rating;

        // DESCRIPTION
        document.getElementById("bagDescription").textContent = bag.description || "No description available.";
        document.getElementById("buyerNotes").textContent = bag.buyer_notes || "";

        // DESIGN AND APPEARANCE
        document.getElementById("bagType").textContent = bag.type || "—";
        document.getElementById("bagSize").textContent = bag.size || "—";
        document.getElementById("bagColor").textContent = bag.color || "—";
        document.getElementById("bagShape").textContent = bag.shape || "—";

        // MATERIALS AND CONSTRUCTION
        document.getElementById("bagMaterial").textContent = bag.material || "—";
        document.getElementById("bagStrapType").textContent = bag.strap_type || "—";
        document.getElementById("bagClosure").textContent = bag.closure || "—";
        document.getElementById("bagCompartments").textContent = bag.compartments ?? "—";
        document.getElementById("bagWeight").textContent =
            bag.weight_g != null ? `${bag.weight_g} g` : "—";

        document.getElementById("bagWaterResistance").textContent =
            bag.water_resistant ? "Water Resistant" : "Not Water Resistant";
        await checkWishlistStatus();
        document.getElementById("bagLoading").style.display = "none";
        productPage.style.visibility = "visible";

    }
    catch (error) {
        console.error(error);
        alert("Unable to retrieve bag details.");
    }
}



//----------------------------------------------------------------------------------------------------------
// ADMIN - VIEW SWITCHING

function showAdminView(view) {
    document.getElementById("bagListView").hidden = view !== "list";
    document.getElementById("createBagView").hidden = view !== "create";
    document.getElementById("updateBagView").hidden = view !== "update";

    window.scrollTo({ top: 0, behavior: "smooth" });
}


//----------------------------------------------------------------------------------------------------------
// ADMIN - FORM FIELD CATEGORIES

const bagCategories = {
    "Basic Information": [
        "name",
        "brand",
        "collection",
        "type",
        "origin"
    ],

    "Physical Details": [
        "size",
        "shape",
        "material",
        "color"
    ],

    "Construction & Features": [
        "strap_type",
        "closure",
        "compartments",
        "weight_g",
        "water_resistant"
    ],

    "Pricing & Availability": [
        "price",
        "rating",
        "availability"
    ],

    "Additional Information": [
        "description",
        "buyer_notes"
    ]
};


//----------------------------------------------------------------------------------------------------------
// ADMIN - GENERATE FORM FIELDS

function generateBagFields(container, bag = null) {

    container.innerHTML = "";

    for (const category in bagCategories) {

        const section = document.createElement("div");
        section.className = "update-category";

        const heading = document.createElement("h3");
        heading.textContent = category;

        const categoryFields = document.createElement("div");
        categoryFields.className = "update-category-fields";

        for (const key of bagCategories[category]) {

            const wrapper = document.createElement("div");
            wrapper.className = "update-field";

            const label = document.createElement("label");
            label.textContent = key.replaceAll("_", " ");
            label.htmlFor = `bag-${key}`;

            let input;

            // SIZE DROPDOWN
            if (key === "size") {

                input = document.createElement("select");

                const placeholder = document.createElement("option");
                placeholder.value = "";
                placeholder.textContent = "Select size";
                placeholder.disabled = true;

                input.appendChild(placeholder);

                ["Mini", "Small", "Medium", "Large"].forEach(size => {

                    const option = document.createElement("option");
                    option.value = size;
                    option.textContent = size;

                    input.appendChild(option);
                });

                input.value = bag?.[key] || "";

            }

            // DESCRIPTION AND BUYER NOTES
            else if (["description", "buyer_notes"].includes(key)) {

                input = document.createElement("textarea");
                input.value = bag?.[key] || "";

            }

            // OTHER INPUTS
            else {

                input = document.createElement("input");

                if (key === "water_resistant") {

                    input.type = "checkbox";
                    input.checked = Boolean(bag?.[key]);

                }

                else if (["price", "rating", "compartments", "weight_g"].includes(key)) {

                    input.type = "number";
                    input.value = bag?.[key] ?? "";

                    if (key === "rating") {
                        input.step = "any";
                        input.min = "0";
                        input.max = "5";
                    }

                    else if (key === "price") {
                        input.step = "any";
                        input.min = "0.01";
                    }

                    else {
                        input.step = "1";
                        input.min = "0";
                    }

                }

                else {

                    input.type = "text";
                    input.value = bag?.[key] || "";

                }
            }

            input.id = `bag-${key}`;
            input.name = key;

            if (key !== "water_resistant" &&
                !["description", "buyer_notes"].includes(key)) {
                input.required = true;
            }

            wrapper.appendChild(label);
            wrapper.appendChild(input);
            categoryFields.appendChild(wrapper);
        }

        section.appendChild(heading);
        section.appendChild(categoryFields);
        container.appendChild(section);
    }
}


//----------------------------------------------------------------------------------------------------------
// ADMIN - ADD NEW BAG VIEW

const addNewBagButton = document.getElementById("addNewBagButton");

if (addNewBagButton) {

    addNewBagButton.onclick = function () {

        selectedBag = null;

        document.getElementById("createBagForm").reset();
        document.getElementById("createBagMessage").textContent = "";

        generateBagFields(
            document.getElementById("createBagFields")
        );

        showAdminView("create");
    };
}


//----------------------------------------------------------------------------------------------------------
// ADMIN - BACK TO BAG LIST

const backFromCreate = document.getElementById("backFromCreate");
const cancelCreateBag = document.getElementById("cancelCreateBag");

const backFromUpdate = document.getElementById("backFromUpdate");
const cancelUpdateBag = document.getElementById("cancelUpdateBag");

if (backFromCreate) {
    backFromCreate.onclick = () => showAdminView("list");
}

if (cancelCreateBag) {
    cancelCreateBag.onclick = () => showAdminView("list");
}

if (backFromUpdate) {
    backFromUpdate.onclick = () => showAdminView("list");
}

if (cancelUpdateBag) {
    cancelUpdateBag.onclick = () => showAdminView("list");
}


//----------------------------------------------------------------------------------------------------------
// ADMIN - EDIT BAG VIEW

const adminBagList = document.getElementById("adminBagList");

if (adminBagList) {

    adminBagList.addEventListener("click", async function(event) {

        const editButton = event.target.closest(".admin-edit-button");
        const deleteButton = event.target.closest(".admin-delete-button");

        // EDIT BAG
        if (editButton) {

            const bagId = editButton.dataset.bagId;

            try {

                const response = await fetch(
                    `${API_URL}/bags/${bagId}`,
                    getFetchOptions()
                );

                if (!response.ok) {
                    throw new Error("Unable to retrieve bag.");
                }

                selectedBag = await response.json();

                document.getElementById("updateBagForm").reset();
                document.getElementById("updateBagMessage").textContent = "";

                generateBagFields(
                    document.getElementById("updateBagFields"),
                    selectedBag
                );

                showAdminView("update");

            }
            catch (error) {

                console.error(error);
                alert("Unable to open bag details.");

            }
        }


        // DELETE BAG DIRECTLY FROM LIST
        if (deleteButton) {

            const bagId = deleteButton.dataset.bagId;

            const bagItem = deleteButton.closest(".admin-bag-item");
            const bagName = bagItem.querySelector("h2").textContent;

            const confirmDelete = confirm(
                `Are you sure you want to delete ${bagName}?`
            );

            if (!confirmDelete) return;

            try {

                const response = await fetch(`${API_URL}/bags/${bagId}`, {
                    method: "DELETE",
                    headers: getFetchOptions().headers
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.detail || "Unable to delete bag.");
                }

                alert("Bag deleted successfully!");

                await loadAdminBags();

            }
            catch (error) {

                console.error(error);
                alert(error.message || "Unable to delete bag.");

            }
        }

    });
}


//----------------------------------------------------------------------------------------------------------
// ADMIN - PREPARE BAG DATA

function getBagFormData(form) {

    const formData = new FormData(form);
    const bag = {};

    formData.forEach((value, key) => {
        bag[key] = value;
    });

    bag.water_resistant =
        form.querySelector('[name="water_resistant"]').checked;

    bag.rating = Number(bag.rating);
    bag.price = Number(bag.price);
    bag.compartments = Number(bag.compartments);
    bag.weight_g = Number(bag.weight_g);

    return bag;
}


//----------------------------------------------------------------------------------------------------------
// ADMIN - CREATE BAG

const createBagForm = document.getElementById("createBagForm");

if (createBagForm) {

    createBagForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const message = document.getElementById("createBagMessage");
        message.textContent = "";

        const newBag = getBagFormData(this);

        if (
            !Number.isFinite(newBag.rating) ||
            !Number.isFinite(newBag.price) ||
            !Number.isFinite(newBag.compartments) ||
            !Number.isFinite(newBag.weight_g)
        ) {
            message.textContent = "Please enter valid numbers in all numeric fields.";
            return;
        }

        try {

            const response = await fetch(`${API_URL}/bags`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getFetchOptions().headers
                },
                body: JSON.stringify(newBag)
            });

            const data = await response.json();

            if (!response.ok) {

                const errorMessage = Array.isArray(data.detail)
                    ? data.detail.map(error => error.msg).join("\n")
                    : data.detail;

                throw new Error(errorMessage || "Unable to create bag.");
            }

            alert("Bag created successfully!");

            this.reset();

            await loadAdminBags();

            showAdminView("list");

        }
        catch (error) {

            console.error(error);
            message.textContent = error.message || "Unable to connect to the server.";

        }

    });
}


//----------------------------------------------------------------------------------------------------------
// ADMIN - UPDATE BAG

const updateBagForm = document.getElementById("updateBagForm");

if (updateBagForm) {

    updateBagForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        if (!selectedBag) return;

        const message = document.getElementById("updateBagMessage");
        message.textContent = "";

        const updatedBag = getBagFormData(this);

        if (
            !Number.isFinite(updatedBag.rating) ||
            !Number.isFinite(updatedBag.price) ||
            !Number.isFinite(updatedBag.compartments) ||
            !Number.isFinite(updatedBag.weight_g)
        ) {
            message.textContent = "Please enter valid numbers in all numeric fields.";
            return;
        }

        try {

            const response = await fetch(`${API_URL}/bags/${selectedBag.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...getFetchOptions().headers
                },
                body: JSON.stringify(updatedBag)
            });

            const data = await response.json();

            if (!response.ok) {

                const errorMessage = Array.isArray(data.detail)
                    ? data.detail.map(error => error.msg).join("\n")
                    : data.detail;

                throw new Error(errorMessage || "Unable to update bag.");
            }

            selectedBag = data;

            alert("Bag updated successfully!");

            await loadAdminBags();

            showAdminView("list");

        }
        catch (error) {

            console.error(error);
            message.textContent = error.message || "Unable to connect to the server.";

        }

    });
}


//----------------------------------------------------------------------------------------------------------
// ADMIN - DELETE BAG FROM UPDATE VIEW

const deleteBagButton = document.getElementById("deleteBagButton");

if (deleteBagButton) {

    deleteBagButton.onclick = async function() {

        if (!selectedBag) return;

        const confirmDelete = confirm(
            `Are you sure you want to delete ${selectedBag.name}?`
        );

        if (!confirmDelete) return;

        try {

            const response = await fetch(`${API_URL}/bags/${selectedBag.id}`, {
                method: "DELETE",
                headers: getFetchOptions().headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Unable to delete bag.");
            }

            alert("Bag deleted successfully!");

            selectedBag = null;

            await loadAdminBags();

            showAdminView("list");

        }
        catch (error) {

            console.error(error);
            document.getElementById("updateBagMessage").textContent =
                error.message || "Unable to delete bag.";

        }
    };
}

//----------------------------------------------------------------------------------------------------------
// SEARCH

async function searchBags() {
    const query = document.getElementById("searchInput").value;

    if (!query) {
        loadBags();
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/bags/search?q=${encodeURIComponent(query)}`,
            getFetchOptions()
        );

        const data = await response.json();
        displayBags(data.results);

        document.getElementById("searchInput").value = "";
    }
    catch (error) {
        console.error(error);
        alert("Search failed.");
    }
}


//----------------------------------------------------------------------------------------------------------
// KEYBOARD SEARCH

const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            searchBags();
        }
    });
}


//----------------------------------------------------------------------------------------------------------
// NAVBAR ANIMATION

window.addEventListener("scroll", function () {
    const nav = document.querySelector("nav");

    if (!nav) return;

    if (window.scrollY > 50) {
        nav.classList.add("scrolled");
    }
    else {
        nav.classList.remove("scrolled");
    }
});


//----------------------------------------------------------------------------------------------------------
// UPDATE NAVBAR BASED ON USER ROLE

const NewBagButton = document.getElementById("NewBagButton");
const loginButton = document.getElementById("loginButton");

const wishlistNav = document.getElementById("wishlistNav");
const cartNav = document.getElementById("cartNav");
const adminButton = document.getElementById("adminButton");

if (userRole === "admin") {

    if (wishlistNav) wishlistNav.style.display = "none";
    if (cartNav) cartNav.style.display = "none";
    if (loginButton) loginButton.style.display = "none";
    if (adminButton) adminButton.style.display = "inline-block";

} else {

    if (wishlistNav) wishlistNav.style.display = "inline-block";
    if (cartNav) cartNav.style.display = "inline-block";
    if (loginButton) loginButton.style.display = "inline-block";
    if (adminButton) adminButton.style.display = "none";

}

// LOGIN / LOGOUT BUTTON

if (loginButton) {
    loginButton.textContent = authToken ? "LOG OUT" : "LOG IN";
}

if (NewBagButton) {
    NewBagButton.style.display =
        userRole === "admin" ? "inline-block" : "none";
}

//----------------------------------------------------------------------------------------------------------
// LOGIN BUTTON

if (loginButton) {
    loginButton.onclick = function () {
        if (authToken) {
            authToken = null;
            userRole = null;

            sessionStorage.removeItem("authToken");
            sessionStorage.removeItem("userRole");
        }

        window.location.href = "/loginscreen.html";
    };
}


// ADMIN LOG OUT BUTTON

const adminLogoutButton = document.getElementById("logoutButton");

if (adminLogoutButton) {
    adminLogoutButton.addEventListener("click", function() {
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("userRole");

        authToken = null;
        userRole = null;

        window.location.href = "/loginscreen.html";
    });
}



//----------------------------------------------------------------------------------------------------------
// LOGIN FORM

const loginForm = document.getElementById("login-form");
console.log("LOGIN FORM FOUND:", loginForm);

if (loginForm) {
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const message = document.getElementById("loginMessage");

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();



            if (!response.ok) {
                message.textContent =
                    data.detail || "Invalid username or password.";
                return;
            }

            authToken = data.access_token;
            userRole = data.user.role;

            sessionStorage.setItem("authToken", authToken);
            sessionStorage.setItem("userRole", userRole);

            window.location.href = "index.html";
        }
        catch (error) {
            console.error(error);
            message.textContent = "Unable to connect to the server.";
        }
    });
}


//----------------------------------------------------------------------------------------------------------
// GUEST LOGIN

const guestButton = document.getElementById("guest-account");

if (guestButton) {
    guestButton.onclick = function () {
        authToken = null;
        userRole = null;

        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("userRole");

        window.location.href = "index.html";
    };
}



 //----------------------------------------------------------------------------------------------------------
const quantityTimers = new Map(); // JS Storage for quantiy counter
// LOAD CART

async function loadCart() {

    // CHECK IF USER IS LOGGED IN
    if (!authToken) {
        window.location.href = "/loginscreen.html";
        return;
    }

    const cartList = document.getElementById("cartList");

    if (!cartList) return;

    // SHOW LOADING MESSAGE
    cartList.textContent = "Loading your bags. Please wait.";

    try {
        const response = await fetch(
            `${API_URL}/cart`,
            getFetchOptions()
        );

        if (!response.ok) {
            throw new Error("Unable to retrieve cart.");
        }

        const data = await response.json();

        cartList.innerHTML = "";

        // CHECK IF CART IS EMPTY
        if (data.cart.length === 0) {

            cartList.textContent = "Your shopping bag is empty.";

            document.getElementById("itemCount").textContent = "0 ITEMS";
            document.getElementById("selectedCount").textContent = "0 items";
            document.getElementById("selectedTotal").textContent = "$0.00";

            return;
        }

        data.cart.forEach(item => {

            const cartItem = document.createElement("div");

            cartItem.className = "cart-item";
            cartItem.dataset.bagId = item.bag_id;
            cartItem.dataset.price = item.price;

            cartItem.innerHTML = `
                <label class="item-select">
                    <input type="checkbox" name="cartItem">
                    <span class="checkmark"></span>
                </label>

                <div class="item-image">
                    <img src="${item.image_url}" alt="${item.name}">
                </div>

                <div class="item-information">
                    <p class="item-brand">${item.brand}</p>
                    <h3>${item.name}</h3>

                    <p class="item-description">
                        ${item.material || ""} · ${item.color || ""}
                    </p>

                    <div class="quantity-control">
                        <button class="quantity-decrease" type="button">−</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-increase" type="button">+</button>
                    </div>

                    <button class="remove-item" type="button">
                        Remove
                    </button>
                </div>

                <p class="item-price">
                    $${Number(item.price).toLocaleString("en-US")}
                </p>
            `;

            cartList.appendChild(cartItem);


            // SELECT BAG
            cartItem.querySelector('input[name="cartItem"]').addEventListener("change", () => {
                updateCartSelection();
            });


            // DECREASE QUANTITY
            cartItem.querySelector(".quantity-decrease").addEventListener("click", () => {

                const quantityDisplay = cartItem.querySelector(".quantity-value");
                const currentQuantity = Number(quantityDisplay.textContent);

                if (currentQuantity <= 1) return;

                updateCartQuantity(item.bag_id, currentQuantity - 1);
            });


            // INCREASE QUANTITY
            cartItem.querySelector(".quantity-increase").addEventListener("click", () => {

                const quantityDisplay = cartItem.querySelector(".quantity-value");
                const currentQuantity = Number(quantityDisplay.textContent);

                updateCartQuantity(item.bag_id, currentQuantity + 1);
            });


            // REMOVE BAG
            cartItem.querySelector(".remove-item").addEventListener("click", () => {

                const confirmRemove = confirm(
                    `Are you sure you want to remove ${item.name} from your shopping bag?`
                );

                if (!confirmRemove) return;

                removeCartItems([item.bag_id]);
            });

        });

        document.getElementById("itemCount").textContent =
            `${data.count} ITEMS`;

        // RESET SELECTION SUMMARY
        updateCartSelection();

    }
    catch (error) {
        console.error(error);
        cartList.textContent = "Unable to load your shopping bag.";
    }
}
// UPDATE CART QUANTITY

function updateCartQuantity(bagId, quantity) {

    if (quantity < 1) return;

    const cartItem = document.querySelector(
        `.cart-item[data-bag-id="${bagId}"]`
    );

    if (!cartItem) return;

    // UPDATE DISPLAY IMMEDIATELY
    cartItem.querySelector(".quantity-value").textContent = quantity;

    // UPDATE SELECTED TOTAL
    updateCartSelection();

    // CANCEL PREVIOUS PENDING REQUEST
    clearTimeout(quantityTimers.get(bagId));

    // SEND LATEST QUANTITY AFTER CLICKING STOPS
    const timer = setTimeout(async () => {

        try {

            const options = getFetchOptions();

            const response = await fetch(`${API_URL}/cart/${bagId}`, {
                ...options,
                method: "PATCH",
                headers: {
                    ...options.headers,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    quantity: quantity
                })
            });

            if (!response.ok) {
                throw new Error("Unable to update quantity.");
            }

            quantityTimers.delete(bagId);

        }
        catch (error) {

            console.error(error);
            alert("Unable to update bag quantity.");

            quantityTimers.delete(bagId);

            await loadCart();
        }

    }, 400);

    quantityTimers.set(bagId, timer);
}

// REMOVE BAGS FROM CART

async function removeCartItems(bagIds) {

    try {

        // CANCEL PENDING QUANTITY UPDATES FOR REMOVED ITEMS
        bagIds.forEach(bagId => {
            clearTimeout(quantityTimers.get(bagId));
            quantityTimers.delete(bagId);
        });

        const options = getFetchOptions();

        const response = await fetch(`${API_URL}/cart`, {
            method: "DELETE",
            headers: {
                ...options.headers,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                bag_ids: bagIds
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Unable to remove bags.");
        }

        await loadCart();

    }
    catch (error) {

        console.error(error);
        alert(error.message || "Unable to remove bags from your cart.");

    }
}

// UPDATE CART SELECTION

function updateCartSelection() {

    const selectedItems = document.querySelectorAll(
        '.cart-item input[name="cartItem"]:checked'
    );

    let totalItems = 0;
    let totalPrice = 0;

    selectedItems.forEach(checkbox => {

        const cartItem = checkbox.closest(".cart-item");

        const quantity = Number(
            cartItem.querySelector(".quantity-value").textContent
        );

        const price = Number(
            cartItem.dataset.price
        );

        totalItems += quantity;
        totalPrice += price * quantity;

    });

    document.getElementById("selectedCount").textContent =
        `${totalItems} items`;

    document.getElementById("selectedTotal").textContent =
        `$${totalPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
}



//----------------------------------------------------------------------------------------------------------
// WISHLIST



async function loadWishlist() {
    const wishlistContainer = document.getElementById("wishlistContainer");

    if (!wishlistContainer) return;

    wishlistContainer.innerHTML = `
        <div class="wishlist-loading">
            <p>Loading your wishlist...</p>
        </div>
    `;

    // CHECK LOGIN
    if (!authToken) {
        wishlistContainer.innerHTML = `
            <div class="wishlist-empty">
                <h2>LOGIN REQUIRED</h2>
                <p>Please log in to view your wishlist.</p>
            </div>
        `;
        return;
    }

    try {
        // GET WISHLIST
        const response = await fetch(`${API_URL}/wishlist`, {
            headers: getFetchOptions().headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Unable to load wishlist.");
        }

        // CHECK EMPTY WISHLIST
        if (data.wishlist.length === 0) {
            wishlistContainer.innerHTML = `
                <div class="wishlist-empty">
                    <div class="empty-heart">
                        <i class="fa-regular fa-heart"></i>
                    </div>
                    <h2>YOUR WISHLIST IS EMPTY</h2>

                    <p class="empty-description">
                        You haven't saved any bags yet. Explore our collection
                        and find something worth keeping.
                    </p>

                    <a href="index.html" class="discover-button">
                        DISCOVER BAGS
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
                            `;
            return;
        }

        // DISPLAY WISHLIST ITEMS
        wishlistContainer.innerHTML = data.wishlist.map(bag => `
            <div class="wishlist-item" data-bag-id="${bag.id}">

                <div class="wishlist-image">
                    <img src="${bag.image_url}" alt="${bag.name}">
                </div>

                <div class="wishlist-information">

                    <div class="wishlist-details">
                        <h2>${bag.name}</h2>

                        <p class="wishlist-description">
                            ${bag.brand} · ${bag.size} · ${bag.color}
                        </p>

                        <p class="wishlist-price">
                            $${Number(bag.price).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </p>
                    </div>

                    <div class="wishlist-actions">

                        <button class="add-to-cart" data-bag-id="${bag.id}">
                            ADD TO CART
                        </button>

                        <button class="remove-wishlist" data-bag-id="${bag.id}">
                            REMOVE
                        </button>

                    </div>

                </div>

            </div>
        `).join("");



        // ADD TO CART
        wishlistContainer.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", async function () {

                const bagId = this.dataset.bagId;

                this.disabled = true;
                this.textContent = "ADDING...";

                try {
                    const options = getFetchOptions();

                    // ADD BAG TO CART
                    const cartResponse = await fetch(`${API_URL}/cart/${bagId}`, {
                        method: "POST",
                        headers: options.headers
                    });

                    const cartData = await cartResponse.json();

                    if (!cartResponse.ok) {
                        throw new Error(cartData.detail || "Unable to add bag to cart.");
                    }

                    // REMOVE BAG FROM WISHLIST
                    const wishlistResponse = await fetch(`${API_URL}/wishlist/${bagId}`, {
                        method: "DELETE",
                        headers: options.headers
                    });

                    const wishlistData = await wishlistResponse.json();

                    if (!wishlistResponse.ok) {
                        throw new Error(
                            "Bag was added to your cart, but could not be removed from your wishlist: " +
                            (wishlistData.detail || "Unknown error.")
                        );
                    }

                    // REFRESH WISHLIST
                    await loadWishlist();

                    alert("Bag added to your shopping bag!");

                } catch (error) {
                    console.error("Add to cart error:", error);
                    alert(error.message);

                    this.disabled = false;
                    this.textContent = "ADD TO CART";
                }

            });
        });



        // REMOVE FROM WISHLIST
        wishlistContainer.querySelectorAll(".remove-wishlist").forEach(button => {
            button.addEventListener("click", async function () {

                const bagId = this.dataset.bagId;

                this.disabled = true;
                this.textContent = "REMOVING...";

                try {
                    const options = getFetchOptions();

                    const response = await fetch(`${API_URL}/wishlist/${bagId}`, {
                        method: "DELETE",
                        headers: options.headers
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.detail || "Unable to remove bag.");
                    }

                    // REFRESH WISHLIST
                    await loadWishlist();

                } catch (error) {
                    console.error("Remove wishlist error:", error);
                    alert(error.message);

                    this.disabled = false;
                    this.textContent = "REMOVE";
                }

            });
        });

    } catch (error) {
        console.error("Wishlist error:", error);

        wishlistContainer.innerHTML = `
            <div class="wishlist-empty">
                <h2>UNABLE TO LOAD WISHLIST</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
}



//----------------------------------------------------------------------------------------------------------
// BAG DETAILS - WISHLIST

async function checkWishlistStatus() {
    const button = document.getElementById("wishlistButton");

    if (!button || !currentBagId) return;

    try {
        const response = await fetch(
            `${API_URL}/wishlist`,
            getFetchOptions()
        );

        if (!response.ok) throw new Error("Unable to check wishlist.");

        const data = await response.json();

        isWishlisted = data.wishlist.some(
            bag => Number(bag.id) === Number(currentBagId)
        );

        button.classList.toggle("wishlisted", isWishlisted);
        button.setAttribute("aria-pressed", isWishlisted);

    } catch (error) {
        console.error("Wishlist status error:", error);
    }
}


// ADD / REMOVE WISHLIST

const wishlistButton = document.getElementById("wishlistButton");

if (wishlistButton) {
    wishlistButton.addEventListener("click", async function () {

        if (!currentBagId) return;

        this.disabled = true;

        try {
            const method = isWishlisted ? "DELETE" : "POST";

            const response = await fetch(
                `${API_URL}/wishlist/${currentBagId}`,
                {
                    method: method,
                    headers: getFetchOptions().headers
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Unable to update wishlist.");
            }

            isWishlisted = !isWishlisted;

            this.classList.toggle("wishlisted", isWishlisted);
            this.setAttribute("aria-pressed", isWishlisted);

            alert(
                isWishlisted
                    ? "Bag added to your wishlist!"
                    : "Bag removed from your wishlist!"
            );

        } catch (error) {
            console.error("Wishlist error:", error);
            alert(error.message);

        } finally {
            this.disabled = false;
        }
    });
}


//----------------------------------------------------------------------------------------------------------
// BAG DETAILS - ADD TO CART

const addToCartButton = document.getElementById("addToCartButton");

if (addToCartButton) {
    addToCartButton.addEventListener("click", async function () {

        if (!currentBagId) return;

        this.disabled = true;
        this.textContent = "ADDING...";

        try {
            const response = await fetch(
                `${API_URL}/cart/${currentBagId}`,
                {
                    method: "POST",
                    headers: getFetchOptions().headers
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Unable to add bag to cart.");
            }

            alert("Bag added to your shopping bag!");

        } catch (error) {
            console.error("Add to cart error:", error);
            alert(error.message);

        } finally {
            this.disabled = false;
            this.textContent = "Add to Cart";
        }
    });
}



// HERO CAROUSEL

const heroSlides = document.querySelectorAll(".hero-slide");
const heroIndicators = document.querySelectorAll(".hero-indicators span");

const heroPrev = document.getElementById("heroPrev");
const heroNext = document.getElementById("heroNext");

let currentHeroSlide = 0;

function showHeroSlide(index) {
    heroSlides.forEach(slide => slide.classList.remove("active"));
    heroIndicators.forEach(indicator => indicator.classList.remove("active"));

    currentHeroSlide = (index + heroSlides.length) % heroSlides.length;

    heroSlides[currentHeroSlide].classList.add("active");
    heroIndicators[currentHeroSlide].classList.add("active");
}

if (heroPrev && heroNext) {
    heroPrev.addEventListener("click", () => {
        showHeroSlide(currentHeroSlide - 1);
    });

    heroNext.addEventListener("click", () => {
        showHeroSlide(currentHeroSlide + 1);
    });

    heroIndicators.forEach(indicator => {
        indicator.addEventListener("click", () => {
            showHeroSlide(Number(indicator.dataset.slide));
        });
    });
}



//----------------------------------------------------------------------------------------------------------
// ADMIN - LOAD ALL BAGS

async function loadAdminBags() {
    const adminBagList = document.getElementById("adminBagList");

    if (!adminBagList) return;

    adminBagList.textContent = "Loading bags...";

    try {
        const response = await fetch(`${API_URL}/bags`, getFetchOptions());

        if (!response.ok) {
            throw new Error("Unable to retrieve bags.");
        }

        const data = await response.json();

        displayAdminBags(data.bags);

    } catch (error) {
        console.error(error);
        adminBagList.textContent = "Unable to load bags.";
    }
}


//----------------------------------------------------------------------------------------------------------
// ADMIN - DISPLAY ALL BAGS

function displayAdminBags(bags) {
    const adminBagList = document.getElementById("adminBagList");

    if (!adminBagList) return;

    adminBagList.innerHTML = "";

    bags.sort((a, b) => a.name.localeCompare(b.name));

    bags.forEach(bag => {

        const item = document.createElement("div");

        item.className = "wishlist-item admin-bag-item";
        item.dataset.bagId = bag.id;

        item.innerHTML = `
            <div class="wishlist-image">
                <img src="images/${bag.id}.png" alt="${bag.name}">
            </div>

            <div class="wishlist-information">

                <div class="wishlist-details">
                    <h2>${bag.name}</h2>

                    <p class="wishlist-description">
                        ${bag.brand} · ${bag.size} · ${bag.color}
                    </p>

                    <p class="wishlist-price">
                        $${Number(bag.price).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </p>

                    <p class="admin-availability">
                        ${bag.availability || "Availability not specified"}
                    </p>
                </div>

                <div class="wishlist-actions">

                    <button class="admin-edit-button" data-bag-id="${bag.id}">
                        EDIT
                    </button>

                    <button class="admin-delete-button" data-bag-id="${bag.id}">
                        DELETE
                    </button>

                </div>

            </div>
        `;

        adminBagList.appendChild(item);
    });
}


















//----------------------------------------------------------------------------------------------------------
// LOAD MAIN PAGE

if (document.getElementById("bagList")) {
    loadBags();
}

//----------------------------------------------------------------------------------------------------------
// LOAD BAG DETAILS PAGE

if (document.querySelector(".product-page")) {
    loadBagDetails();
}

//----------------------------------------------------------------------------------------------------------
// LOAD CART PAGE

if (document.getElementById("cartList")) {
    loadCart();
}

//----------------------------------------------------------------------------------------------------------
// LOAD WISHLIST PAGE

if (document.getElementById("wishlistContainer")) {
    loadWishlist();
}

if (document.getElementById("adminBagList")) {
    loadAdminBags();
}