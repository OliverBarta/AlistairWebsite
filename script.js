//The filter by brand and filter by search filters being selected currently
var filterSelected = "";
var searchVal = "";

//runs on start
document.addEventListener("DOMContentLoaded", function () {
    console.log("Site loaded");

    loadListings(searchVal, filterSelected);
    loadFilters();
});

//runs every time you type in search bar (more specifically when your key goes up)
document.getElementById("search").addEventListener("keyup", function(event) {
    const searchDiv = document.getElementById("search");

    loadListings(searchDiv.value, filterSelected);
});

//reads json file
async function readfile(fileName) {
    const response = await fetch(fileName);
    const data = await response.json();
    return data;
}

//loads listings filtered for search and filter (filter could be brand, etc)
async function loadListings(search, filter) {

    filterSelected = filter;
    searchVal = search;
    const dataPreSearchFilter = await readfile("listings.json");
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
            console.log(listingData.name);
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
    const data = await readfile("listings.json");
    console.log("Loading filters");

    const filterArea = document.getElementById("filterArea");

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
