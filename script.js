//The filter by brand and filter by search filters being selected currently
var filterSelected = "";
var searchVal = "";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

//runs on start
document.addEventListener("DOMContentLoaded", function () {
    console.log("Site loaded");
    console.log("Screen width: ", window.innerWidth);
    
    refreshCartNumber();

    loadListings(searchVal, filterSelected);
    loadFilters();
});

//runs every time you type in search bar (more specifically when your key goes up)
document.getElementById("search").addEventListener("keyup", function(event) {
    const searchDiv = document.getElementById("search");

    loadListings(searchDiv.value, filterSelected);

});

async function readfile() {

    // loads everything from database
    const { data: listings, error } = await supabaseClient
        .from('listings')
        .select('*');

    if (error) console.log("Error reading listings from Supabase:", error);

    return listings;
}

//loads listings filtered for search and filter (filter could be brand, etc)
async function loadListings(search, filter) {

    filterSelected = filter;
    searchVal = search;
    const dataPreSearchFilter = await readfile();
        //aplies search filter
    const data = dataPreSearchFilter.filter(f => f.name?.toLowerCase().startsWith(searchVal));

    console.log("Loading listings with search: "+searchVal+" and filter: "+filterSelected);

    const listingArea = document.getElementById("listingArea");

    while(listingArea.firstChild) {
        listingArea.removeChild(listingArea.firstChild);
    }

    var listingAdded = false;

    for (let i = 0; i < data.length; i++) {
        
        const listingDiv = document.createElement("button");
        listingDiv.classList.add("listing");

        const listingData = data[i];

        //skips the listings not in the brand filter
        if (filter != "" && listingData.brand != filter) {
            continue;
        }

        listingAdded = true;

        const image = document.createElement("img");
        if (!listingData.image.includes("")) {//For if there is no image found
            image.src = listingData.image[0];
        } else {
            image.src = "images\\defaultImage.png";
        }
        image.classList.add("listing-img");

        const listingInfo = document.createElement("div");
        listingInfo.classList.add("listing-info");

        const nameDiv = document.createElement("h2");
        nameDiv.innerHTML = listingData.name;

        const brandDiv = document.createElement("div");
        brandDiv.innerHTML = listingData.brand;
        brandDiv.classList.add("brand");
        const priceDiv = document.createElement("div");
        priceDiv.innerHTML = "$"+listingData.price;
        priceDiv.classList.add("price");

        listingInfo.append(image);
        listingInfo.append(nameDiv);
        listingInfo.append(brandDiv);
        listingInfo.append(priceDiv);
        listingDiv.append(listingInfo);
        listingDiv.onclick = () => {
            location.href = `listing.html?id=${listingData.id}`;
        };

        listingArea.appendChild(listingDiv);
    }

    if (!listingAdded) {
        const Div = document.createElement("div");
        Div.innerHTML = "No Listings for current filter and search.";
        Div.classList.add("noResults");

        listingArea.appendChild(Div);
    }
}


async function loadFilters() {
    const data = await readfile();
    console.log("Loading filters");

    const filterArea = document.getElementById("filterArea");

    while (filterArea.firstChild) {
        filterArea.removeChild(filterArea.firstChild);
    }

    let usedBrands = [];

    for (let i = 0; i < data.length; i++) {
        const listingData = data[i];

        if (!usedBrands.includes(listingData.brand)) {
            usedBrands.push(listingData.brand);

            const filterDiv = document.createElement("button");
            filterDiv.innerHTML = listingData.brand;
            filterDiv.classList.add("filter");
            filterDiv.onclick = () => {
                loadListings(searchVal, listingData.brand);
            };

            filterArea.appendChild(filterDiv);
        }
    }
    const filterDiv = document.createElement("button");
    filterDiv.innerHTML = "Clear filter";
    filterDiv.classList.add("filter");
    filterDiv.onclick = () => {
        loadListings(searchVal, "");
    };
    filterArea.appendChild(filterDiv);
}

async function refreshCartNumber() {
    const cartDiv = document.getElementById("cart");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    var numItemsInCart = 0;

    cart.forEach(item => {
        numItemsInCart += item.quantity;

    });

    cartDiv.innerHTML = numItemsInCart;

}