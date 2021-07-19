// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @dev {ERC20} token, including:
 *
 * Orion Token - contains standard ERC20 features
 * token [name] is set ORION with [symbol] ORN with initial [totalSupply] of 0
 * 
 */
contract OrionToken is ERC20 {
  string constant NAME = "ORION";
  string constant SYMBOL = "ORN";

  constructor() ERC20(NAME, SYMBOL) {}
}
