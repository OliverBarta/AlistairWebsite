const data = readfile("listings.json");

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
    console.log("Loading listings");

}

async function cartButton() {
    console.log("Cart button pressed");
}