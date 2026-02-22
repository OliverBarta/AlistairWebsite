
//runs on start
document.addEventListener("DOMContentLoaded", async function () {
    console.log("Listing loaded");
    const params = new URLSearchParams(window.location.search);
    listingId = params.get("id");
    const data = await readfile("listings.json");
    const listing = data.find(item => item.id === listingId);

    if (!listing) {
        console.error("Listing not found for id:", listingId);
        return;
    }

    loadSideImages(listing);
    loadSelectedImage(listing, 0);
});

//reads json file
async function readfile(fileName) {
    const response = await fetch(fileName);
    const data = await response.json();
    return data;
}

async function loadSideImages(listing) {

    const imageColDiv = document.getElementById("imageCol");

    for (let i = 0; i < listing.image.length; i++) {
        const buttonImg = document.createElement("button");
        buttonImg.classList.add("imageButton");
        const img = document.createElement("img");
        img.classList.add("imageSmall");
        img.src = listing.image[i];

        buttonImg.onclick = () => {
            loadSelectedImage(listing, i);
        }
        buttonImg.appendChild(img);

        imageColDiv.appendChild(buttonImg);
    }
}

async function loadSelectedImage(listing, num) {
    const imageSelectedBody = document.getElementById("imageSelectedBody");

    while (imageSelectedBody.firstChild) {
        imageSelectedBody.removeChild(imageSelectedBody.firstChild);
    }

    const imageSelectedDiv = document.createElement("img");
    imageSelectedDiv.classList.add("imageSelected");
    imageSelectedDiv.src = listing.image[num];

    imageSelectedBody.appendChild(imageSelectedDiv);
}