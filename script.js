
document.addEventListener("DOMContentLoaded", function () {
    console.log("Site loaded");

    loadListings("");
    
    const filterArea = document.getElementById("filterArea");

});

async function readfile(fileName) {
    const response = await fetch(fileName);
    const data = await response.json();
    return data;
}

async function loadListings(search) {
    const data = await readfile("listings.json");
    console.log("Loading listings");
    const listingArea = document.getElementById("listingArea");
    

    for (let i = 0; i < data.length; i++) {
        const listingDiv = document.createElement("button");
        listingDiv.classList.add("listing");
        const listingData = data[i];

        const image = document.createElement("img");
        image.src = listingData.image[0];
        image.classList.add("listing-img");

        const listingInfo = document.createElement("div");
        listingInfo.classList.add("listing-info");

        const nameDiv = document.createElement("h2");
        nameDiv.innerHTML = listingData.name;

        const brandDiv = document.createElement("p");
        brandDiv.innerHTML = listingData.brand;
        brandDiv.classList.add("brand");
        const priceDiv = document.createElement("p");
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
    
    

}



