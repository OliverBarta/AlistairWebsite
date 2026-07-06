const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginSection = document.getElementById("loginSection");
const adminSection = document.getElementById("adminSection");

// check if already logged in on page load
document.addEventListener("DOMContentLoaded", async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) showAdmin();
});

document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
        document.getElementById("loginError").textContent = error.message;
        return;
    }

    showAdmin();
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    location.reload();
});

function showAdmin() {
    loginSection.style.display = "none";
    adminSection.style.display = "block";
    loadListingsList();
}

document.getElementById("addListingForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const brand = document.getElementById("brand").value;
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock").value);
    const imageUrls = document.getElementById("images").value
        .split("\n")
        .map(url => url.trim())
        .filter(url => url.length > 0);

    const { data, error } = await supabaseClient
        .from("listings")
        .insert({ name, brand, price, stock, image: imageUrls });

    const messageEl = document.getElementById("formMessage");

    if (error) {
        messageEl.style.color = "red";
        messageEl.textContent = "Error: " + error.message;
        return;
    }

    messageEl.style.color = "green";
    messageEl.textContent = "Listing added!";
    e.target.reset();
    loadListingsList();
});


// call this after login succeeds, and after any add/edit/delete
async function loadListingsList() {
    const { data: listings, error } = await supabaseClient
        .from("listings")
        .select("*")
        .order("id");

    if (error) {
        console.error("Failed to load listings:", error);
        return;
    }

    const listEl = document.getElementById("listingsList");
    listEl.innerHTML = "";

    listings.forEach(listing => {
        const row = document.createElement("div");
        row.classList.add("listingRow");

        const info = document.createElement("span");
        info.textContent = `${listing.name} — $${listing.price} — ${listing.stock} in stock`;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => openEditModal(listing);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteListing(listing);

        row.appendChild(info);
        row.appendChild(editBtn);
        row.appendChild(deleteBtn);
        listEl.appendChild(row);
    });
}

function openEditModal(listing) {
    document.getElementById("editId").value = listing.id;
    document.getElementById("editName").value = listing.name;
    document.getElementById("editBrand").value = listing.brand;
    document.getElementById("editPrice").value = listing.price;
    document.getElementById("editStock").value = listing.stock;
    document.getElementById("editImages").value = listing.image.join("\n");

    document.getElementById("editModal").style.display = "block";
}

document.getElementById("cancelEditBtn").addEventListener("click", () => {
    document.getElementById("editModal").style.display = "none";
});

document.getElementById("saveEditBtn").addEventListener("click", async () => {
    const id = parseInt(document.getElementById("editId").value);
    const name = document.getElementById("editName").value;
    const brand = document.getElementById("editBrand").value;
    const price = parseFloat(document.getElementById("editPrice").value);
    const stock = parseInt(document.getElementById("editStock").value);
    const imageUrls = document.getElementById("editImages").value
        .split("\n")
        .map(url => url.trim())
        .filter(url => url.length > 0);

    const { error } = await supabaseClient
        .from("listings")
        .update({ name, brand, price, stock, image: imageUrls })
        .eq("id", id);

    const messageEl = document.getElementById("editMessage");

    if (error) {
        messageEl.style.color = "red";
        messageEl.textContent = "Error: " + error.message;
        return;
    }

    document.getElementById("editModal").style.display = "none";
    loadListingsList(); // refresh the list to show updated values
});

async function deleteListing(listing) {
    const confirmed = confirm(`Delete "${listing.name}"? This can't be undone.`);
    if (!confirmed) return;

    const { error } = await supabaseClient
        .from("listings")
        .delete()
        .eq("id", listing.id);

    if (error) {
        alert("Error deleting: " + error.message);
        return;
    }

    loadListingsList(); // refresh the list
}