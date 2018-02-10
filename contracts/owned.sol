pragma solidity ^0.4.2;

contract Owned {
    address public owner;
    /* function Owned() {
        owner = msg.sender;
    } */
    modifier onlyOwner() {
        assert(msg.sender == owner);
        _;
    }
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }
}
