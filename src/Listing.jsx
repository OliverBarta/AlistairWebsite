import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { supabaseClient } from "./supabaseClient";

import "./listing.css";

import defaultImage from "./assets/defaultImage.png";

function Listing() {

        const navigate = useNavigate();

        const { listingId } = useParams();

        const [listingPulled, setListingPulled] = useState(null);


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
                        console.log('Fetched listing:', data);
                        setListingPulled(data);
                    }
                } catch (error) {
                    console.error('Error fetching listing:', error);
                }
            };
    
            getListing();
    
        }, []);

        if (!listingPulled) {
            return <div>Loading...</div>;
        }
    
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
                                <button key={index} className="imageButton" onClick={() => {
                                    const imageSelectedBody = document.getElementById("imageSelectedBody");
                                    while (imageSelectedBody.firstChild) {
                                        imageSelectedBody.removeChild(imageSelectedBody.firstChild);
                                    }
                                    const imageSelectedDiv = document.createElement("img");
                                    imageSelectedDiv.classList.add("imageSelected");
                                    imageSelectedDiv.src = imgSrc;
                                    imageSelectedBody.appendChild(imageSelectedDiv);
                                }}>
                                    <img className="imageSmall" src={imgSrc} alt={`Listing ${index}`} />
                                </button>
                            ))}
                        </div>
                        <div className="imageSelectedBody" id="imageSelectedBody"><img className='imageSelected' src={listingPulled.image ? listingPulled.image[0] : defaultImage}></img></div>
                    </div>
                    <div className="textArea" id="textArea">
                        <div className='nameDiv'>{listingPulled.name}</div>
                        <div className='stockBrandArea'>
                            <div className='brandDiv'>{listingPulled.brand}</div>
                            <div className='stockDiv'>In Stock: {listingPulled.stock}</div>
                        </div>
                        <div className='priceListing'>${listingPulled.price}</div>
                        
                    </div>
                </div>
            </>
        )
}

export default Listing;