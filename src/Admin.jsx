import './admin.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { supabaseClient } from "./supabaseClient";

function Admin() {

    const navigate = useNavigate();

    const [loggedIn, setLoggedIn] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [listings, setListings] = useState([]);

    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState(1);
    const [images, setImages] = useState('');
    const [formMessage, setFormMessage] = useState({ text: '', color: '' });

    const [editingListing, setEditingListing] = useState(null);
    const [editName, setEditName] = useState('');
    const [editBrand, setEditBrand] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editStock, setEditStock] = useState('');
    const [editImages, setEditImages] = useState('');
    const [editMessage, setEditMessage] = useState({ text: '', color: '' });

    // check for an existing session on load
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                setLoggedIn(true);
            }
            setCheckingSession(false);
        };
        checkSession();
    }, []);

    // load listings whenever we become logged in
    useEffect(() => {
        if (loggedIn) {
            loadListingsList();
        }
    }, [loggedIn]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');

        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

        if (error) {
            setLoginError(error.message);
            return;
        }

        setLoggedIn(true);
    };

    const handleLogout = async () => {
        await supabaseClient.auth.signOut();
        setLoggedIn(false);
        setListings([]);
    };

    const loadListingsList = async () => {
        const { data, error } = await supabaseClient
            .from("listings")
            .select("*")
            .order("id");

        if (error) {
            console.error("Failed to load listings:", error);
            return;
        }

        setListings(data);
    };

    const parseImageUrls = (raw) =>
        raw.split("\n").map(url => url.trim()).filter(url => url.length > 0);

    const handleAddListing = async (e) => {
        e.preventDefault();

        const { error } = await supabaseClient
            .from("listings")
            .insert({
                name,
                brand,
                price: parseFloat(price),
                stock: parseInt(stock),
                image: parseImageUrls(images)
            });

        if (error) {
            setFormMessage({ text: "Error: " + error.message, color: "red" });
            return;
        }

        setFormMessage({ text: "Listing added!", color: "green" });
        setName('');
        setBrand('');
        setPrice('');
        setStock(1);
        setImages('');
        loadListingsList();
    };

    const openEditModal = (listing) => {
        setEditingListing(listing);
        setEditName(listing.name);
        setEditBrand(listing.brand);
        setEditPrice(listing.price);
        setEditStock(listing.stock);
        setEditImages(listing.image.join("\n"));
        setEditMessage({ text: '', color: '' });
    };

    const handleSaveEdit = async () => {
        const { error } = await supabaseClient
            .from("listings")
            .update({
                name: editName,
                brand: editBrand,
                price: parseFloat(editPrice),
                stock: parseInt(editStock),
                image: parseImageUrls(editImages) || []
            })
            .eq("id", editingListing.id);

        if (error) {
            setEditMessage({ text: "Error: " + error.message, color: "red" });
            return;
        }

        setEditingListing(null);
        loadListingsList();
    };

    const handleDelete = async (listing) => {
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

        loadListingsList();
    };

    if (checkingSession) {
        return <div>Loading...</div>;
    }

    if (!loggedIn) {
        return (
            <div id="loginSection" className='bodySectionAdmin'>
                <h2>Log in</h2>
                <button className='backToSite' onClick={() => navigate("/")}>Back to Site</button>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Log in</button>
                </form>
                <p style={{ color: 'red' }}>{loginError}</p>
            </div>
        );
    }

    return (
        <div id="adminSection" className='bodySectionAdmin'>
            <h2>Add New Listing</h2>
            <button className='backToSite' onClick={() => navigate("/")}>Back to Site</button>
            <button onClick={handleLogout}>Log out</button>

            <form onSubmit={handleAddListing}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="text" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
                <textarea placeholder="Image URLs, one per line" rows="5" value={images} onChange={(e) => setImages(e.target.value)}></textarea>
                <button type="submit">Add Listing</button>
            </form>
            <p style={{ color: formMessage.color }}>{formMessage.text}</p>

            <div id="manageListings">
                <h2>Manage Listings</h2>
                <div id="listingsList">
                    {listings.map(listing => (
                        <div key={listing.id} className="listingRow">
                            <span>{listing.name} — ${listing.price} — {listing.stock} in stock</span>
                            <button onClick={() => openEditModal(listing)}>Edit</button>
                            <button onClick={() => handleDelete(listing)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>

            {editingListing && (
                <div id="editModal">
                    <h2>Edit Listing</h2>
                    <input type="text" placeholder="Name" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                    <input type="text" placeholder="Brand" value={editBrand} onChange={(e) => setEditBrand(e.target.value)} required />
                    <input type="number" placeholder="Price" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} required />
                    <input type="number" placeholder="Stock" value={editStock} onChange={(e) => setEditStock(e.target.value)} required />
                    <textarea placeholder="Image URLs, one per line" rows="5" value={editImages} onChange={(e) => setEditImages(e.target.value)} required></textarea>
                    <button onClick={handleSaveEdit}>Save changes</button>
                    <button onClick={() => setEditingListing(null)}>Cancel</button>
                    <p style={{ color: editMessage.color }}>{editMessage.text}</p>
                </div>
            )}
        </div>
    );
}

export default Admin;