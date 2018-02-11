pragma solidity ^0.4.2;

import "./Product.sol";

contract First is Buyer{

    function First () public {
        owner = msg.sender;
    }

    function () public payable {}
}
