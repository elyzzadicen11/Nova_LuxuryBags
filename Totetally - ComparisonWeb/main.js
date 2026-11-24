const COMPARE_API_URL = "https://bags-api-elec2.vercel.app/api/v1";
const COMPARE_API_KEY = "compareBags";


let allBags = [];

// API FETCH OPTIONS

function getCompareFetchOptions() {
    return {
        headers: {
            "x-api-key": COMPARE_API_KEY
        }
    };
}


// GET ALL BAGS
async function loadBags() {
    try {
        const response = await fetch(`${COMPARE_API_URL}/bags`, getCompareFetchOptions());
        if (!response.ok) {
            throw new Error("API request failed.");
        }
        const data = await response.json();
        allBags = data.bags;
        loadBagDropDowns();
    }
    catch (error) {
        console.error(error);
    }
}




// LOAD BAG DROPDOWNS

function loadBagDropDowns() {
    const dropdowns = [
        document.getElementById("bag1"),
        document.getElementById("bag2"),
        document.getElementById("bag3")
    ];

    dropdowns.forEach(dropdown => {
        [...allBags].sort((a, b) => a.name.localeCompare(b.name)).forEach(bag => {
            const option = document.createElement("option");
            option.value = bag.name;
            option.textContent = bag.name;
            dropdown.appendChild(option);

        });
    });
}


// DISPLAY BAG
function displayBag(slotNumber) {
    const selectedBagName = document.getElementById(`bag${slotNumber}`).value;
    const selectedBag = allBags.find(bag => bag.name === selectedBagName);
    const slot = document.getElementById(`bagslot${slotNumber}`);

    if (selectedBagName === "") {
        slot.innerHTML = "+";
        return;
    }

    slot.innerHTML = `
        <img src="images/${selectedBag.id}.png" alt="Bag Image">
        <h3>${selectedBag.name}</h3>
        <p>$${selectedBag.price}</p>
        <button class = "view-product">View Product</button>
    `;

    // VIEWING PRODUCT
    slot.querySelector(".view-product").addEventListener("click", function(){
        viewBag(selectedBag.id);
    })
}



// UPDATE COMPARISON

function updateComparison() {
    const selectedBags = [
        document.getElementById("bag1").value,
        document.getElementById("bag2").value,
        document.getElementById("bag3").value
    ];

    const rows = document.querySelectorAll(".comparison-row");
    const attributes = [
        "name",
        "brand",
        "price",
        "rating",
        "collection",
        "availability",
        "origin",
        "type",
        "size",
        "color",
        "shape",
        "material",
        "strap_type",
        "closure",
        "compartments",
        "weight_g",
        "water_resistant",
        "description",
        "buyer_notes"
    ];

    rows.forEach((row, rowIndex) => {
        // Remove old bag values
        row.querySelectorAll(".comparison-value").forEach(value => {
            value.remove();
        });

        selectedBags.forEach(bagName => {

            const value = document.createElement("span");
            value.className = "comparison-value";

            const bag = allBags.find(
                bag => bag.name === bagName
            );

            if (!bag) {
                value.textContent = "";
            }

            else if (attributes[rowIndex] === "water_resistant") {
                value.textContent =
                    bag.water_resistant ? "Yes" : "No";
            }

            else {
                value.textContent =
                    bag[attributes[rowIndex]] ?? "";
            }

            row.appendChild(value);
        });
    });
}


// LOAD EVERYTHING

loadBags();


// For displaying and updating bags
document.getElementById("bag1").addEventListener("change", function () {
    displayBag(1);
    updateComparison();
});

document.getElementById("bag2").addEventListener("change", function () {
    displayBag(2);
    updateComparison();

});
document.getElementById("bag3").addEventListener("change", function () {
    displayBag(3);
    updateComparison();

});

 //----------------------------------------------------------------------------------------------------------


// For comparison filters

const categories = document.querySelectorAll(".comparison-category");

function showCategory(categoryId) {
    categories.forEach(category => {
        category.style.display = "none";
    });
    document.getElementById(categoryId).style.display = "block";
}


document.getElementById("all-btn").addEventListener("click", function () {
    categories.forEach(category => {
        category.style.display = "block";
    });
});

document.getElementById("basic-btn").addEventListener("click", function () {
    showCategory("basic");
});


document.getElementById("design-btn").addEventListener("click", function () {
    showCategory("design");
});


document.getElementById("materials-btn").addEventListener("click", function () {
    showCategory("materials");
});

document.getElementById("additional-btn").addEventListener("click", function () {
    showCategory("additional");
});