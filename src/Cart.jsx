import "./cart.css";

import { useNavigate } from 'react-router-dom';

function Cart() {

    const navigate = useNavigate();

    return (
        <>
            <div className="top-bar">
                <div type="button" className="nothingTitle" id="nothingTitle" onClick={() => navigate(`/`)}>NOTHINGG</div>
            </div>
            <div className="mainBody" id="mainBody">
                <div id="cartSummary" className="cartSummary">
                    <div id="total" className="total"></div>
                    <div id="noItem" className="noItem" style={{display: 'none'}}>No Items In Cart</div>
                </div>
                

            </div>
        </>
    )
}

export default Cart;