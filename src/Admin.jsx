import './admin.css';

import { useNavigate } from 'react-router-dom';


function Admin() {

    const navigate = useNavigate();

    return (
        <>
            <div id="loginSection">
                <h2>Log in</h2>
                <input type="email" id="email" placeholder="Email"></input>
                <input type="password" id="password" placeholder="Password"></input>
                <button id="loginBtn">Log in</button>
                <p id="loginError" style={{color:'red'}}></p>
            </div>

            <div id="adminSection" style={{display:'none'}}>
                <h2>Add New Listing</h2>
                <button id="logoutBtn">Log out</button>

                <form id="addListingForm">
                    <input type="text" id="name" placeholder="Name" required></input>
                    <input type="text" id="brand" placeholder="Brand" required></input>
                    <input type="number" id="price" placeholder="Price" required></input>
                    <input type="number" id="stock" placeholder="Stock" value="1" required></input>
                    <textarea id="images" placeholder="Image URLs, paste url then hit enter and paste next url" rows="5" required></textarea>
                    <button type="submit">Add Listing</button>
                </form>
                <p id="formMessage"></p>


                <div id="manageListings">
                    <h2>Manage Listings</h2>
                    <div id="listingsList"></div>
                </div>
                
                <div id="editModal" style={{display:'none'}}>
                    <h2>Edit Listing</h2>
                    <input type="hidden" id="editId"></input>
                    <input type="text" id="editName" placeholder="Name" required></input>
                    <input type="text" id="editBrand" placeholder="Brand" required></input>
                    <input type="number" id="editPrice" placeholder="Price" required></input>
                    <input type="number" id="editStock" placeholder="Stock" required></input>
                    <textarea id="editImages" placeholder="Image URLs, paste url then hit enter and paste next url" rows="5" required></textarea>
                    <button id="saveEditBtn">Save changes</button>
                    <button id="cancelEditBtn">Cancel</button>
                    <p id="editMessage"></p>
                </div>
            </div>
        </>
    )
}

export default Admin;