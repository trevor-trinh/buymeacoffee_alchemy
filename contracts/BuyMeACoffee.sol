// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Deployed to Goreli at 0x381C5E1537f7559d64e943691d842350798c64e5

contract BuyMeACoffee {
    // Event to emit when Memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // List of all Memos
    Memo[] memos;

    // Address of contract deployer
    address payable owner;

    // On deploy set owner
    constructor() {
        owner = payable(msg.sender);
    }

    /**
    @dev buys coffee for contract owner
    @param _name name of coffee buyer 
    @param _message message from coffee buyer
    */
    function buyCoffee(string memory _name, string memory _message)
        external
        payable
    {
        require(msg.value > 0, 'Cannot buy coffee with 0 eth');

        // Saves memo to blockchain storage
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        // Emits event when new memo is created
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
    @dev sends entire contract balance to contract owner
    */
    function withdrawTips() external {
        require(owner.send(address(this).balance));
    }

    /**
    @dev retuns all memos associated with this contract
    */
    function getMemos() external view returns (Memo[] memory) {
        return memos;
    }

    /**
    @dev changes contract owner and thus withdrawal address
    @param _address new owner address 
    In production should probably use OpenZepplin Ownable contract
    */
    function changeOwner(address _address) external {
        require(msg.sender == owner);
        owner = payable(_address);
    }
}
