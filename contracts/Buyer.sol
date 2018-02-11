pragma solidity ^0.4.2;

import "./Product.sol"

contract Buyer is Product {
    //event ProductBought (address indexed seller, address indexed buyer, uint256 indexed prodID, uint256 price, uint24 quantity);
    /* struct Merchandise {
        address vendor;
        uint256 price;
        uint24 quantity;
        uint256 identifier;
        bool isPaused;
    } */
    /* mapping (address => bool) isSeller;
    mapping (address => mapping (uint256 => Product.Merchandise)) goods;
    mapping (address => mapping (uint256 => bool)) isProduct;
    mapping (address => uint256) nextProductIDs; */


    function buyGoods (address _vendor, address _buyer, uint256 _prodID, uint24 _quantity) external payable {
        require (msg.sender == _buyer);
        require (isSeller[_vendor] == true);
        require (isProduct[_vendor][_prodID] == true);
        require (_quantity <= goods[_vendor][_prodID].quantity);
        require (msg.value >= _quantity * goods[_vendor][_prodID].price);

    }

    function _buyGoods (address _vendor, address _buyer, uint256 _prodID, uint24 _quantity) internal {
        goods[_vendor][_prodID].quantity -= _quantity;
        _vendor.send(_quantity * goods[_vendor][_prodID].price);
        ProductBought(_vendor, _buyer, _prodID, goods[_vendor][_prodID].price, _quantity);
    }
}
