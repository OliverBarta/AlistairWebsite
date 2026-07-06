import "./Home.css";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import banner from "./assets/banneraliwebsite .jpeg";
import defaultImage from "./assets/defaultImage.png";

import { supabaseClient } from "./supabaseClient";

function Home() {

    const navigate = useNavigate();

    const [AllListings, setAllListings] = useState([]);

    const [brandFilter, setBrandFilter] = useState('');

    const [uniqueBrands, setUniqueBrands] = useState([]);

    const [searchVal, setSearchVal] = useState('');

    useEffect(() => {
        const getListings = async () => {
            try {
                const { data, error } = await supabaseClient.from('listings').select('*');
                if (error) {
                    console.error('Error fetching listings:', error);
                } else {
                    console.log('Fetched listings:', data);
                    setAllListings(data);
                }
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };

        getListings();

    }, []);

    if (!AllListings) return <div>Loading...</div>;

    useEffect(() => {
        const brands = [...new Set(AllListings.map(listing => listing.brand))];
        setUniqueBrands(brands);
    }, [AllListings]);

    const filteredListings = AllListings.filter(listing =>
        listing.name.toLowerCase().includes(searchVal.toLowerCase()) &&
        (listing.brand === brandFilter || brandFilter === "")
    );

    return (
        <>
            <div className="top-bar">
                <div className="search-bar">
                    <input type="text" placeholder="Search" id="search" autoComplete="off"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    ></input>
                </div>
                <div className="nothingTitle" id="nothingTitle">NOTHINGG</div>
                <button type="button" id="cart" className="cart" onClick={() => navigate(`/Cart`)}>Cart</button>
            </div>

            <div className="ticker">
                <div className="ticker-track">
                    <div className="ticker-group">
                        {Array(8).fill("NOTHINGG · SHOP NOW").map((text, i) => (
                            <span key={`a-${i}`}>{text}</span>
                        ))}
                    </div>
                    <div className="ticker-group" aria-hidden="true">
                        {Array(8).fill("NOTHINGG · SHOP NOW").map((text, i) => (
                            <span key={`b-${i}`}>{text}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div id="banner" className="banner"><img className="bannerImg" src={banner}/></div>


            <div id="mainBody" className="mainBody">
                <div id="filterArea" className="filterArea">
                    <div className="filterAreaTitle">FILTER BY BRAND</div>
                    <button
                        className={`filter ${brandFilter === '' ? 'active' : ''}`}
                        onClick={() => setBrandFilter('')}
                    >
                        Clear Filters
                    </button>    
                    {uniqueBrands.map((brand) => (
                        <button
                            key={brand}
                            className={`filter ${brandFilter === brand ? 'active' : ''}`}
                            onClick={() => setBrandFilter(brand)}
                        >
                            {brand}
                        </button>
                    ))}             
                </div>
                <div id="listingArea" className="listingArea">
                    {filteredListings.length === 0 ? (
                        <div className="noResults">No listings match your search.</div>
                    ) : (
                        filteredListings.map((listing) => (
                            <button key={listing.id} className="listing" onClick={() => navigate(`/Listing/${listing.id}`)}>
                                <div className="listing-img-wrap">
                                    <img className="listing-img" src={listing.image ? listing.image[0] : defaultImage} alt={listing.name} />
                                </div>
                                <div className="listing-info">
                                    <h2>{listing.name}</h2>
                                    <div className="brand">{listing.brand}</div>
                                    <div className="price">${listing.price}</div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
            <div className="extraArea" onClick={() => navigate(`/Admin`)}>Admin Login</div>
        </>
    )
}

export default Home;