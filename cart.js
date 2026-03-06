document.addEventListener("DOMContentLoaded", async function () {

    console.log("cart loading");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    console.log(cart);

    if (cart.length === 0) {
        const noItemDiv = document.getElementById("noItem");
        noItemDiv.style.display = "flex";
    }
    
    loadCart(cart);
    
});

async function loadCart(cart) {

    const mainBodyDiv = document.getElementById("mainBody");

    cart.forEach(item => {
        const listingDiv = document.createElement("listing");
        listingDiv.classList.add("listing");

        const imgDiv = document.createElement("img");
        imgDiv.classList.add("listing-img");
        imgDiv.src = item.image[0];

        const centerItemsDiv = document.createElement("centerItems");
        centerItemsDiv.classList.add("centerItems");

        const nameDiv = document.createElement("button");
        nameDiv.classList.add("name");
        nameDiv.innerHTML = item.name;
        nameDiv.onclick = () => {
            location.href = `listing.html?id=${item.id}`;
        };

        centerItemsDiv.appendChild(nameDiv);


        const brandDiv = document.createElement("brand");
        brandDiv.innerHTML = item.brand;
        brandDiv.classList.add("brand");
        centerItemsDiv.appendChild(brandDiv);

        const priceDiv = document.createElement("price");
        priceDiv.innerHTML = item.price+"$ x "+item.quantity;
        priceDiv.classList.add("price");

        const removeItemButton = document.createElement("button");
        removeItemButton.classList.add("removeItemButton");
        removeItemButton.innerHTML = "Remove   ";

        removeItemButton.onclick = () => {

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
        
            const cartItem = cart.find(i => i.id === item.id);
        
            if (cartItem.quantity <= 1) {
                cart = cart.filter(i => i.id !== item.id);
            } else {
                cartItem.quantity -= 1;
            }
        
            localStorage.setItem("cart", JSON.stringify(cart));
        
            location.reload();
        };

        listingDiv.appendChild(imgDiv);
        listingDiv.appendChild(centerItemsDiv);
        listingDiv.appendChild(priceDiv);
        listingDiv.appendChild(removeItemButton);
        
        mainBodyDiv.appendChild(listingDiv);


    });

}

function removeFromCart(id) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart.filter(item => item.id !== id);
    
    localStorage.setItem("cart", JSON.stringify(cart));
}