pragma solidity ^0.4.2;

import "./Product.sol";

contract First is Product{

    function First () public {
        owner = msg.sender;
    }

    function () public payable {}
}
