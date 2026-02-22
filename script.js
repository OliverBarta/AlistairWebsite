document.addEventListener("DOMContentLoaded", function () {
    console.log("Site loaded");
    loadListings("");
});

async function readfile(fileName) {
    const response = await fetch(fileName);
    const data = await response.json();
    return data;
}

async function loadListings(search) {
    const data = await readfile("listings.json");
    
    


}