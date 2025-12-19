// contracts/Faucet.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Faucet {
    IERC20 public token;
    uint256 public withdrawalAmount = 10 * (10**18); 
    uint256 public lockTime = 1 days;

    mapping(address => uint256) public nextAccessTime;

    event Withdrawal(address indexed to, uint256 amount);

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    function requestTokens() public {
        require(msg.sender != address(0), "Direccion invalida");
        require(token.balanceOf(address(this)) >= withdrawalAmount, "Faucet vacia (sin fondos)");
        require(block.timestamp >= nextAccessTime[msg.sender], "Debes esperar 24 horas para pedir de nuevo");

        nextAccessTime[msg.sender] = block.timestamp + lockTime;
        token.transfer(msg.sender, withdrawalAmount);

        emit Withdrawal(msg.sender, withdrawalAmount);
    }
}
