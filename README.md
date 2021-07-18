Whitelisted-Rewards contract allows userts to claim the rewards according to the list of participants. The reward is accrued continuously and the participant can request payment of the reward at any time.

1) There is a list of participants AND the amounts that must be paid to each investor during the term (term - total). The amount is paid in ORN token.
For example, address 0xF1 .. must be paid ORN 10000 (in 2 years). Address 0xF2 ... - the amount is 2000 ORN (in 2 years too).
2) The term is set when the contract is created. Addresses and amounts can be added or removed later.
2.1) The term can be changed by the owner of the contract. In this case, the reward is accrued according with the new term.
3) The payout amount for every user may also change.