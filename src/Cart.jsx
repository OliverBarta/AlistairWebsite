import "./cart.css";

import { useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react';

import { supabaseClient } from "./supabaseClient";

import defaultImage from "./assets/defaultImage.png";

function Cart() {

    const navigate = useNavigate();

    const [listingPulled, setListingPulled] = useState(null);

    const [cartItems, setCartItems] = useState([]);


    useEffect(() => {
        const getListings = async () => {
            try {
                const { data, error } = await supabaseClient.from('listings').select('*');
                if (error) {
                    console.error('Error fetching listings:', error);
                } else {
                    console.log('Fetched listings:', data);
                    setListingPulled(data);
                }
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };

        getListings();

        setCartItems(JSON.parse(localStorage.getItem("cart")) || []);

    }, []);

    if (!listingPulled || !cartItems) {
        return <div>Loading...</div>;
    }

    const totalCost = cartItems.reduce((sum, item) => {
            const itemC = cartItems.find(l => l.id === item.id);
            return itemC ? sum + (itemC.price * itemC.quantity) : sum;
        }, 0);

    const removeOneFromCart = (itemId) => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

        const updatedCart = storedCart
            .map(item => item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item)
            .filter(item => item.quantity > 0);

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCartItems(updatedCart);
    };

    const verifyItem = (itemId) => {

        const itemInCart = cartItems.find(item => item.id === itemId);
        const itemInListings = listingPulled.find(listing => listing.id === itemId);

        if (itemInCart && itemInListings) {
            if (itemInCart.price !== itemInListings.price) return false;
            if (itemInCart.name !== itemInListings.name) return false;
            if (itemInCart.brand !== itemInListings.brand) return false;
            if (itemInCart.stock !== itemInListings.stock) return false;
            return true;
        }

        return false;

    };


    return (
        <>
            <div className="top-bar">
                <div type="button" className="nothingTitle" id="nothingTitle" onClick={() => navigate(`/`)}>NOTHINGG</div>
            </div>

            <div className="mainBodyCart" id="mainBodyCart">

                <div className="cartTotalRow">
                    <span className="totalLabel">Total</span>
                    <span className="total">${totalCost.toFixed(2)}</span>
                </div>

                {cartItems.length === 0 ? (
                    <div className="noItem">No Items In Cart</div>
                ) : (
                    <div className="cartList">
                        {cartItems.map(item => {
                            if (!verifyItem(item.id)) {
                                return (
                                    <div key={item.id} className="listingCart">
                                        <button
                                            className="removeItemButton"
                                            onClick={() => removeOneFromCart(item.id)}
                                            aria-label={`Remove one ${item.name} from cart`}
                                        >
                                            Remove
                                        </button>
                                    
                                    Item bugged</div>
                                );
                            } else {

                            return (
                                <div key={item.id} className="listingCart">
                                    <img
                                        src={item.image ? item.image[0] : defaultImage}
                                        alt={item.name}
                                        className="listingCart-img"
                                    />
                                    <div className="cartItemDetails">
                                        <div className="nameCart">{item.name}</div>
                                        <div className="brandCart">{item.brand}</div>
                                    </div>
                                    <div className="priceCart">${item.price} × {item.quantity}</div>
                                    <button
                                        className="removeItemButton"
                                        onClick={() => removeOneFromCart(item.id)}
                                        aria-label={`Remove one ${item.name} from cart`}
                                    >
                                        Remove
                                    </button>
                                </div>
                            );
                            }
                        })}
                    </div>
                )}

            </div>
        </>
    )
}

export default Cart;