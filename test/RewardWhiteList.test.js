const { expect } = require("chai");

describe("RewardWhiteList: Add to Whitelist", () => {
  it("Should add an address to reward whitelist", async () => {
    const [, user] = await ethers.getSigners();

    const RewardWhiteList = await ethers.getContractFactory("RewardWhiteList");

    const rewardWhiteList = await RewardWhiteList.deploy();

    const rewardAmount = 1;
    await rewardWhiteList.addUserToRewardList(user.address, rewardAmount);

    expect(await rewardWhiteList.isWhitelisted(user.address)).to.equal(true);
    expect(await rewardWhiteList.rewardsOf(user.address)).to.equal(rewardAmount);
  })
  it("Should revert adding existing user to whitelist", async () => {
    let reverted = false;

    const [, user] = await ethers.getSigners();

    const RewardWhiteList = await ethers.getContractFactory("RewardWhiteList");

    const rewardWhiteList = await RewardWhiteList.deploy();

    const rewardAmount = 1;
    await rewardWhiteList.addUserToRewardList(user.address, rewardAmount);

    try {
      await rewardWhiteList.addUserToRewardList(user.address, rewardAmount);
    } catch (ex) {
      reverted = ex.message.includes("User alreadt exists");
    }

    expect(reverted).to.equal(true);
  })
  it("Should revert adding to whitelist by unpermitted user", async () => {
    let reverted = false;

    const [, user] = await ethers.getSigners();

    const RewardWhiteList = await ethers.getContractFactory("RewardWhiteList");

    const rewardWhiteList = await RewardWhiteList.deploy();

    const rewardAmount = 1;
    try {
      await rewardWhiteList.connect(user).addUserToRewardList(user.address, rewardAmount);
    } catch (ex) {
      reverted = ex.message.includes("revert");
    }

    expect(reverted).to.equal(true);
  })
})