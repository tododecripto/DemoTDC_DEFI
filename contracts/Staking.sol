// contracts/Staking.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is Ownable {
    IERC20 public stakingToken;

    // Tasa Anual: 20% (APY)
    // 20 Tokens de premio por cada 100 Staked en 1 año (31,536,000 segundos)
    // Reward Rate = 20 / 31536000 = 0.00000063419...
    // Multiplicamos por 1e18 para precision
    uint256 public rewardRatePerSecond = 634195839675; // Equivalente a ~20% APY

    struct Stake {
        uint256 amount;
        uint256 startTime;
    }

    mapping(address => Stake) public stakes;
    mapping(address => uint256) public rewards;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);

    constructor(address _stakingToken) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
    }

    function calculateReward(address account) public view returns (uint256) {
        Stake memory userStake = stakes[account];
        if (userStake.amount == 0) return 0;

        uint256 timeElapsed = block.timestamp - userStake.startTime;
        
        // Formula: (Monto * Tiempo * Tasa) / Escala
        // Escala 1e18 compensa la precision, y dividimos por 100 para el porcentaje
        return (userStake.amount * timeElapsed * rewardRatePerSecond) / 1e18; 
    }

    function stake(uint256 amount) public {
        require(amount > 0, "Monto debe ser mayor a 0");
        rewards[msg.sender] += calculateReward(msg.sender);
        bool success = stakingToken.transferFrom(msg.sender, address(this), amount);
        require(success, "Transferencia fallida (Diste permiso/approve?)");
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].startTime = block.timestamp;
        emit Staked(msg.sender, amount);
    }

    function withdraw() public {
        uint256 amount = stakes[msg.sender].amount;
        require(amount > 0, "No tienes nada depositado");
        uint256 reward = rewards[msg.sender] + calculateReward(msg.sender);
        stakes[msg.sender].amount = 0;
        stakes[msg.sender].startTime = 0;
        rewards[msg.sender] = 0;
        stakingToken.transfer(msg.sender, amount);
        if (reward > 0 && stakingToken.balanceOf(address(this)) >= reward) {
            stakingToken.transfer(msg.sender, reward);
            emit RewardClaimed(msg.sender, reward);
        }
        emit Withdrawn(msg.sender, amount);
    }
}