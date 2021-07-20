// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract RewardWhiteList is Ownable {
  using SafeMath for uint256;

  // struct contains amount of reward and starting date for payment
  struct Reward {
    uint256 amount;
    uint256 startTime;
    bool exists;
  }

  // rewards must be paid to each user (address)
  mapping(address => Reward) rewards;

  uint256 _totalRewards;
  event RewardAssigned(address indexed account, uint256 amount, uint256 startTime);
  event RewardUpdated(address indexed account, uint256 amount);
  event RewardRemvoed(address indexed account);

  constructor() {}

  /**
   * @dev adds new address to rewards list and assigns a specified amount as its total amount
   */
  function addUserToRewardList(address user_, uint256 amount_) public virtual onlyOwner {
    require(rewards[user_].exists == false, "RewardList: User already exists!");

    _totalRewards = _totalRewards.add(amount_);

    Reward memory _reward = Reward(amount_, block.timestamp, true);
    rewards[user_] = _reward;
    emit RewardAssigned(user_, amount_, block.timestamp);
  }

  function updateRewardAmount(address user_, uint256 amount_) public virtual onlyOwner {
    require(rewards[user_].exists == true, "RewardList: User does not exist!");
    
    _totalRewards = _totalRewards.add(amount_).sub(rewards[user_].amount);
    
    rewards[user_].amount = amount_;
    emit RewardUpdated(user_, amount_);
  }

  function removeFromRewardList(address user_) public virtual onlyOwner {
    require(rewards[user_].exists == true, "RewardList: User does not exist!");

    rewards[user_].exists = false;
    emit RewardRemvoed(user_);
  }

  function isWhitelisted(address user_) public view virtual returns (bool) {
    return rewards[user_].exists;
  }

  /**
   * @dev returns total amount of rewards assigned to a specified address
   */
  function rewardsOf(address user_) public view virtual returns (uint256) {
    return rewards[user_].amount;
  }

  /**
   * @dev returns total amount of rewards has been assigned
   */
  function totalRewards() public view returns (uint256) {
    return _totalRewards;
  }
}