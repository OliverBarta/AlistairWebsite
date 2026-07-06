import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { supabaseClient } from "./supabaseClient";

import "./listing.css";

import defaultImage from "./assets/defaultImage.png";

function Listing() {

        const navigate = useNavigate();

        const { listingId } = useParams();

        const [listingPulled, setListingPulled] = useState(null);

        const [cartTrigger, setCartTrigger] = useState(0);

        const [selectedImageIndex, setSelectedImageIndex] = useState(0);

        useEffect(() => {
            const getListing = async () => {
                try {
                    const { data, error } = await supabaseClient
                        .from('listings')
                        .select('*')
                        .eq('id', listingId)
                        .single();
                    
                    if (error) {
                        console.error('Error fetching listing:', error);
                    } else {
                        setListingPulled(data);
                        setSelectedImageIndex(0);
                    }
                } catch (error) {
                    console.error('Error fetching listing:', error);
                }
            };
    
            getListing();
    
        }, [listingId]);

        if (!listingPulled) {
            return <div>Loading...</div>;
        }

        const isStockAvailable = () => {
            
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const cartItem = cart.find(item => item.id === listingPulled.id);
    
            if (cartItem) {
                return listingPulled.stock - cartItem.quantity > 0;
            } 
            return listingPulled.stock > 0;
        };

        const addItemToCart = () => {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            // check if item already exists
            const existing = cart.find(item => item.id === listingPulled.id);
        
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({
                    id: listingPulled.id,
                    name: listingPulled.name,
                    price: listingPulled.price,
                    image: listingPulled.image,
                    brand: listingPulled.brand,
                    stock: listingPulled.stock,
                    quantity: 1
                });
            }
        
            // save cart
            localStorage.setItem("cart", JSON.stringify(cart));

            setCartTrigger(prev => prev + 1);
        };
    
        const displayedImage = listingPulled.image ? listingPulled.image[selectedImageIndex] : defaultImage;
        const lowStock = listingPulled.stock > 0 && listingPulled.stock <= 3;

        return (
            <>
                <div className="top-bar">
                    <div type="button" className="nothingTitle" id="nothingTitle" onClick={() => navigate(`/`)}>NOTHINGG</div>
                    <button type="button" className="cart" id="cart" onClick={() => navigate(`/Cart`)}>Cart</button>
                </div>
                <div className="mainBodyListing" id="mainBodyListing">
                    <div id='allImagesArea' className='allImages'>
                        <div className="imageCol" id="imageCol">
                            {listingPulled.image && listingPulled.image.map((imgSrc, index) => (
                                <button
                                    key={index}
                                    className={`imageButton ${index === selectedImageIndex ? 'selected' : ''}`}
                                    onClick={() => setSelectedImageIndex(index)}
                                >
                                    <img className="imageSmall" src={imgSrc} alt={`${listingPulled.name} thumbnail ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                        <div className="imageSelectedBody" id="imageSelectedBody">
                            <img className='imageSelected' src={displayedImage} alt={listingPulled.name} />
                        </div>
                    </div>
                    <div className="textArea" id="textArea">
                        <div className='nameDiv'>{listingPulled.name}</div>
                        <div className='stockBrandArea'>
                            <div className='brandDiv'>{listingPulled.brand}</div>
                            <div className={`stockDiv ${lowStock ? 'lowStock' : ''}`}>
                                {listingPulled.stock > 0 ? `In Stock: ${listingPulled.stock}` : 'Out of Stock'}
                            </div>
                        </div>
                        <div className='priceListing'>${listingPulled.price}</div>
                        {isStockAvailable() ?
                            <button className='addToCart' onClick={() => {addItemToCart()}}
                            >Add to Cart</button> :
                            <button className='addToCartNoneLeft' disabled>None Left</button>
                        }
                    </div>
                </div>
            </>
        )
}

export default Listing;