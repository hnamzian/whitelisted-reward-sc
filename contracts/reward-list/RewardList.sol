// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardList is Ownable {
  // period of time in seconds user must be rewarded proportionally
  uint256 _term;

  // struct contains amount of reward and starting date for payment
  struct Reward {
    uint256 amount;
    uint256 startTime;
  }

  // rewards must be paid to each user (address)
  mapping(address => Reward) rewards;

  event Term(uint256);
  event RewardAssigned(address indexed, uint256 amount, uint256 startTime);

  constructor(uint256 term_) {
    require(term_ > 0, "RewardList: term must be greater than 0!");
    _term = term_;
  }

  function term() view public returns (uint256) {
    return _term;
  }

  function setTerm(uint256 term_) public onlyOwner {
    require(term_ > 0, "RewardList: term must be greater than 0!");

    _term = term_;
    emit Term(_term);
  }

  /**
   * @dev adds new address to rewards list and assigns a specified amount as its total amount
   */
  function addUserToRewardList(address user_, uint256 amount_) public onlyOwner {
    require(rewards[user_].startTime == 0, "RewardList: User alreadt exists!");

    Reward memory _reward = Reward(amount_, block.timestamp);
    rewards[user_] = _reward;
    emit RewardAssigned(user_, amount_, block.timestamp);
  }

  /**
   * @dev returns total amount of rewards assigned to a specified address
   */
  function rewardsOf(address user_) public view returns (uint256) {
    return rewards[user_].amount;
  }

}