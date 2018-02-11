pragma solidity ^0.4.2;

import "./Seller.sol";

contract Product is Seller{
    uint256 constant listProductCost = 50 finney;
    event ProductListed (address indexed seller, uint256 indexed price, uint256 indexed prodID, uint24 quantity);
    event ProductBought (address indexed seller, address indexed buyer, uint256 indexed prodID, uint256 price, uint24 quantity);
    event ProductRemoved(address indexed seller, uint256 prodID);
    event ProductPauseToggled (address indexed seller, bool indexed pauseStatus, uint256 indexed prodID);

    struct Merchandise {
        address vendor;
        uint256 price;
        uint24 quantity;
        uint256 identifier;
        bool isPaused;
    }

    function removeProduct (address _vendor, uint256 _prodID) constant external {
        require (msg.sender == _vendor);
        require(isSeller[_vendor] == true);
        require(isProduct[_vendor][_prodID] == true);
    }
    function _removeProduct (address _vendor, uint256 _prodID) internal {
        isProduct[_vendor][_prodID] = false;
        delete goods[_vendor][_prodID];
        ProductRemoved (_vendor, _prodID);
    }

    function pauseProductToggle(address _vendor, uint256 _prodID) external{
        require(msg.sender == _vendor);
        require(isSeller[_vendor] == true);
        require(isProduct[_vendor][_prodID] == true);
        _pauseProductToggle(_vendor, _prodID);
    }
    function _pauseProductToggle (address _vendor, uint256 _prodID) internal {
        goods[_vendor][_prodID].isPaused = !(goods[_vendor][_prodID].isPaused);
        ProductPauseToggled(_vendor, goods[_vendor][_prodID].isPaused, _prodID);
    }

    function listProduct (address _vendor, uint256 _price, uint24 _quantity) external payable{
        require (msg.sender == _vendor);
        require(isSeller[_vendor] == true);
        require (_quantity > 0);
        require (msg.value >= listProductCost);
        _listProduct(_vendor, _price, _quantity);
    }
    function _listProduct (address _vendor, uint256 _price, uint24 _quantity) internal {
        Merchandise memory temp = Merchandise({
            vendor:_vendor,
            price:_price,
            quantity:_quantity,
            identifier: nextProductIDs[_vendor],
            isPaused:false
            });
        goods[_vendor][nextProductIDs[_vendor]] = temp;
        isProduct[_vendor][nextProductIDs[_vendor]] = true;
        nextProductIDs[_vendor]++;
        ProductListed(_vendor, _price, nextProductIDs[_vendor]-1, _quantity);
    }
}
