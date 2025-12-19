// contracts/DEX.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DEX {
    IERC20 public token;

    event EthToTokenSwap(address buyer, uint256 ethIn, uint256 tokensOut);
    event TokenToEthSwap(address seller, uint256 tokensIn, uint256 ethOut);
    event LiquidityAdded(address provider, uint256 ethIn, uint256 tokensIn);

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    /**
     * @dev Añadir liquidez inicial al contrato
     */
    function addLiquidity(uint256 tokenAmount) public payable returns (uint256) {
        require(msg.value > 0, "Envia ETH para liquidez");
        require(tokenAmount > 0, "Envia Tokens para liquidez");
        
        uint256 ethReserves = address(this).balance - msg.value;
        uint256 tokenReserves = token.balanceOf(address(this));

        // Si ya hay liquidez, debemos mantener la proporcion
        if (tokenReserves > 0) {
            uint256 requiredTokenAmount = (msg.value * tokenReserves) / ethReserves;
            require(tokenAmount >= requiredTokenAmount, "Tokens insuficientes para mantener la proporcion");
            tokenAmount = requiredTokenAmount;
        }

        bool success = token.transferFrom(msg.sender, address(this), tokenAmount);
        require(success, "Fallo transferencia de tokens");

        emit LiquidityAdded(msg.sender, msg.value, tokenAmount);
        return tokenAmount;
    }

    /**
     * @dev Formula x * y = k para calcular el precio
     */
    function price(uint256 inputAmount, uint256 inputReserve, uint256 outputReserve) public pure returns (uint256) {
        uint256 inputAmountWithFee = inputAmount * 997; // 0.3% comision
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 1000) + inputAmountWithFee;
        return numerator / denominator;
    }

    /**
     * @dev Cambiar ETH por Tokens
     */
    function ethToToken() public payable returns (uint256) {
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 tokensBought = price(msg.value, address(this).balance - msg.value, tokenReserve);

        require(token.transfer(msg.sender, tokensBought), "Fallo transferencia");
        
        emit EthToTokenSwap(msg.sender, msg.value, tokensBought);
        return tokensBought;
    }

    /**
     * @dev Cambiar Tokens por ETH
     */
    function tokenToEth(uint256 tokenInput) public returns (uint256) {
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 ethBought = price(tokenInput, tokenReserve, address(this).balance);

        require(token.transferFrom(msg.sender, address(this), tokenInput), "Fallo transferencia de entrada");
        (bool success, ) = msg.sender.call{value: ethBought}("");
        require(success, "Fallo transferencia de salida");

        emit TokenToEthSwap(msg.sender, tokenInput, ethBought);
        return ethBought;
    }
}
