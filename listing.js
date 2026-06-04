

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

    refreshCartNumber();
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

async function loadTextArea(listing) {

    const textArea = document.getElementById("textArea");

    while (textArea.firstChild) {
        textArea.removeChild(textArea.firstChild);
    }

    const nameDiv = document.createElement("div");
    nameDiv.classList.add("nameDiv");
    nameDiv.innerHTML = listing.name;

    const brandDiv = document.createElement("div");
    brandDiv.classList.add("brandDiv");
    brandDiv.innerHTML = listing.brand;

    const priceDiv = document.createElement("div");
    priceDiv.classList.add("priceDiv");
    priceDiv.innerHTML = listing.price+"$";

    // get existing cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItem = cart.find(item => item.id === listing.id);
    
    let moreToAddToCart = false;
    let stockConsideringCart = listing.stock;

    if (cartItem) {
        console.log(cartItem);
        if (listing.stock - cartItem.quantity > 0) {
            moreToAddToCart = true;
        }
        stockConsideringCart -= cartItem.quantity;
    } else {
        if (listing.stock > 0) {
            moreToAddToCart = true;
        }
    }

    const stockDiv = document.createElement("div");
    stockDiv.classList.add("stockDiv");
    stockDiv.innerHTML = listing.stock+" in stock";

    const cartCountDiv = document.createElement("div");
    cartCountDiv.classList.add("cartCount");
    if (cartItem) {
        cartCountDiv.innerHTML = cartItem.quantity+" in cart";
    } else {
        cartCountDiv.innerHTML = "None in cart";
    }
    const addToCart = document.createElement("button");
    
    addToCart.innerHTML = "Add to cart";

    if (moreToAddToCart) {
        addToCart.classList.add("addToCart");
        addToCart.onclick = () => {
            addItemToCart(listing);
        }
    } else {
        addToCart.classList.add("addToCartNoneLeft");
        addToCart.onclick = () => {}
        addToCart.innerHTML = "None left"
    }

    const stockBrandArea = document.createElement("div");
    stockBrandArea.classList.add("stockBrandArea");

    textArea.appendChild(nameDiv);
    stockBrandArea.appendChild(brandDiv);
    stockBrandArea.appendChild(cartCountDiv);
    stockBrandArea.appendChild(stockDiv);
    textArea.appendChild(stockBrandArea);
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

    loadTextArea(listing);
    refreshCartNumber();
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