// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

/**
 * @dev {ERC20} token, including:
 *
 * Orion Token - contains standard ERC20 features
 * token [name] is set ORION with [symbol] ORN with initial [totalSupply] of 0
 * [admin] of Orion is the address deploys contract
 * [admin] also has MINTER_ROLE (who can mint tokens)
 * [admin] has capability to grant/remove MINTER_ROLE to/from other addresses
 * 
 */
contract OrionToken is ERC20, AccessControlEnumerable {
  string constant NAME = "ORION";
  string constant SYMBOL = "ORN";

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  constructor() ERC20(NAME, SYMBOL) {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());

    _setupRole(MINTER_ROLE, _msgSender());
  }

  /**
    * @dev Creates `amount` new tokens for `to`.
    *
    * See {ERC20-_mint}.
    *
    * Requirements:
    *
    * - the caller must have the `MINTER_ROLE`.
    */
  function mint(address to, uint256 amount) public virtual {
    require(
      hasRole(MINTER_ROLE, _msgSender()),
      "OrionToken: must have minter role to mint"
    );
    _mint(to, amount);
  }
}
