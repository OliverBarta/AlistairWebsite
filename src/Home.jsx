import "./style.css";

function Home() {

  return (
    <>
        <div class="top-bar">
            <div class="search-bar">
                <input type="text" placeholder="Search" id="search" autocomplete="off"></input>
            </div>
            <div class="nothingTitle" id="nothingTitle">NOTHINGG</div>
            <button type="button" id="cart" class="cart" onclick="location.href='cart.html'"></button>
        </div>
        <div id="banner" class="banner"><img class="bannerImg" src="./assets/banneraliwebsite .jpeg"/></div>
        <div id="mainBody" class="mainBody">
            <div id="filterArea" class="filterArea"></div>
            <div id="listingArea" class="listingArea">
            </div>
        </div>
        <div class="extraArea" onclick="location.href='admin.html'">Admin Login</div>
    </>
  );
}

export default Home;