
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
        const listingData = data[i];

        const nameDiv = document.createElement("p");
        nameDiv.innerHTML = listingData.name;

        listingDiv.append(nameDiv);

        listingArea.appendChild(listingDiv);
    }
    
    

}

async function cartButton() {
    console.log("Cart button pressed");
}