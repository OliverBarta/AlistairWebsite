
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

    if (window.innerWidth < 500) {
        const mainBody = document.getElementById("mainBody");
        mainBody.style.width = '100%';
    }

    loadSideImages(listing);
    loadSelectedImage(listing, 0);
    loadTextArea(listing);
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
        if (window.innerWidth < 750) {
            img.style.width = '50px';
            img.style.height = '50px';
            imageColDiv.style.marginRight = 'auto';
        }

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
    if (window.innerWidth < 750) {
        imageSelectedDiv.style.height = '300px';
        imageSelectedDiv.style.maxWidth = '300px';
        imageSelectedBody.style.width = '300px';
        imageSelectedBody.style.height = '300px';
    }
    if (window.innerWidth < 500) {
        imageSelectedDiv.style.height = '200px';
        imageSelectedDiv.style.maxWidth = '200px';
        imageSelectedBody.style.width = '200px';
        imageSelectedBody.style.height = '200px';
    }

    imageSelectedBody.appendChild(imageSelectedDiv);
}

async function loadTextArea(listing) {

    const textArea = document.getElementById("textArea");

    const nameDiv = document.createElement("div");
    nameDiv.classList.add("nameDiv");
    nameDiv.innerHTML = listing.name;

    const brandDiv = document.createElement("div");
    brandDiv.classList.add("brandDiv");
    brandDiv.innerHTML = listing.brand;

    const priceDiv = document.createElement("div");
    priceDiv.classList.add("priceDiv");
    priceDiv.innerHTML = listing.price+"$";

    const addToCart = document.createElement("button");
    addToCart.classList.add("addToCart");
    addToCart.innerHTML = "Add to cart";
    addToCart.onclick = () => {
        addItemToCart(listing);
    }

    textArea.appendChild(nameDiv);
    textArea.appendChild(brandDiv);
    textArea.appendChild(priceDiv);
    textArea.appendChild(addToCart);
}

function addItemToCart(listing) {

    // get existing cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // check if item already exists
    const existing = cart.find(item => item.id === listing.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: listing.id,
            name: listing.name,
            price: listing.price,
            image: listing.image,
            brand: listing.brand,
            quantity: 1
        });
    }

    // save cart
    localStorage.setItem("cart", JSON.stringify(cart));

    console.log("Item added:", listing.name);
}

