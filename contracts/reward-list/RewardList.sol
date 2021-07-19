// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract RewardList is Ownable {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  // period of time in seconds user must be rewarded proportionally
  uint256 _term;

  // struct contains amount of reward and starting date for payment
  struct Reward {
    uint256 amount;
    uint256 startTime;
  }

  // rewards must be paid to each user (address)
  mapping(address => Reward) rewards;
  // rewards has been paid to each address
  mapping(address => uint256) payouts;

  uint256 _totalRewards;
  uint256 _totalPayouts;

  IERC20 orionToken;

  event Term(uint256);
  event RewardAssigned(address indexed, uint256 amount, uint256 startTime);
  event Rewarded(address indexed, uint256 amount);

  constructor(uint256 term_, address orionToken_) {
    require(term_ > 0, "RewardList: term must be greater than 0!");
    _term = term_;
    orionToken = IERC20(orionToken_);
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

    _totalRewards.add(amount_).sub(rewards[user_].amount);

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

  /**
   * @dev calculates total amounts must be rewarded and transfers ORN to the address
   */
  function getReward() public {
    address _to = msg.sender;
    Reward memory _reward = rewards[_to];

    // rewarded amount
    uint256 _paid = payouts[_to];
    // total amount must be paid till now
    uint256 _total_payout = _reward.amount.mul(block.timestamp - _reward.startTime).div(_term);
    // amount must be rewarded
    uint256 _payout = _total_payout.sub(_paid);

    require(_payout > 0, "RewardList: payout amount is 0!");
    // update payouts
    payouts[_to] = _total_payout;
    // update totalPayouts
    _total_payout = _total_payout.add(_payout);
    
    // transfer token
    orionToken.safeTransfer(msg.sender, _payout);
    emit Rewarded(_to, _total_payout);
  }

  /**
   * @dev returns total amount has been rewarded to the user
   */
  function earned(address user) public view returns (uint256) {
    return payouts[user];
  }

  function totalRewards() public view returns (uint256) {
    return _totalRewards;
  }

  function totalPayouts() public view returns (uint256) {
    return _totalPayouts;
  }

}