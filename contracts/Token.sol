// contracts/Token.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DemoTDC is ERC20, Ownable {
    constructor() ERC20("demo.tdc", "DTDC") Ownable(msg.sender) {
        // Mint de 1,000,000,000 tokens con 18 decimales
        _mint(msg.sender, 1000000000 * 10**18);
    }

    /**
     * @dev Permite al dueño imprimir mas tokens si el ecosistema crece
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
