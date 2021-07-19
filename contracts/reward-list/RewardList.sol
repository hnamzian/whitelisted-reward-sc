// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardList is Ownable {
  // period of time in seconds user must be rewarded proportionally
  uint256 _term;

  event Term(uint256);

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

}