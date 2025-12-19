// contracts/Vendor.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vendor is Ownable {
    IERC20 public myToken;
    uint256 public tokensPerEth = 100000;
    event BuyTokens(address buyer, uint256 amountOfEth, uint256 amountOfTokens);

    constructor(address tokenAddress) Ownable(msg.sender) {
        myToken = IERC20(tokenAddress);
    }

    function buyTokens() public payable {
        require(msg.value > 0, "Envia algo de ETH para comprar tokens");
        uint256 amountToBuy = msg.value * tokensPerEth;
        uint256 vendorBalance = myToken.balanceOf(address(this));
        require(vendorBalance >= amountToBuy, "La tienda no tiene suficientes tokens");
        (bool sent) = myToken.transfer(msg.sender, amountToBuy);
        require(sent, "Fallo el envio de tokens");
        emit BuyTokens(msg.sender, msg.value, amountToBuy);
    }

    function withdraw() public onlyOwner {
        uint256 ownerAmount = address(this).balance;
        require(ownerAmount > 0, "No hay ETH para retirar");
        (bool sent, ) = msg.sender.call{value: ownerAmount}("");
        require(sent, "Fallo el retiro de ETH");
    }
}
