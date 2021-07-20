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
      reverted = ex.message.includes("User already exists");
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

describe("RewardWhiteList: Update whitelist", () => {
  it("Should add an address to reward whitelist", async () => {
    const [, user] = await ethers.getSigners();

    const RewardWhiteList = await ethers.getContractFactory("RewardWhiteList");

    const rewardWhiteList = await RewardWhiteList.deploy();

    let rewardAmount = 1;
    await rewardWhiteList.addUserToRewardList(user.address, rewardAmount);

    rewardAmount = 0;
    await rewardWhiteList.updateRewardAmount(user.address, rewardAmount);

    expect(await rewardWhiteList.isWhitelisted(user.address)).to.equal(true);
    expect(await rewardWhiteList.rewardsOf(user.address)).to.equal(rewardAmount);
  })
  it("Should revert updating non-existing user of whitelist", async () => {
    let reverted = false;

    const [, user] = await ethers.getSigners();

    const RewardWhiteList = await ethers.getContractFactory("RewardWhiteList");

    const rewardWhiteList = await RewardWhiteList.deploy();

    const rewardAmount = 1;
    try {
      await rewardWhiteList.updateRewardAmount(user.address, rewardAmount);
    } catch (ex) {
      reverted = ex.message.includes("User does not exist");
    }

    expect(reverted).to.equal(true);
  })
  it("Should revert updating whitelist by unpermitted user", async () => {
    let reverted = false;

    const [, user] = await ethers.getSigners();

    const RewardWhiteList = await ethers.getContractFactory("RewardWhiteList");

    const rewardWhiteList = await RewardWhiteList.deploy();

    const rewardAmount = 1;
    await rewardWhiteList.addUserToRewardList(user.address, rewardAmount);

    try {
      await rewardWhiteList.connect(user).updateRewardAmount(user.address, 0);
    } catch (ex) {
      reverted = ex.message.includes("revert");
    }

    expect(reverted).to.equal(true);
  })
})

describe("RewardWhiteList: Remove from Whitelist", () => {
  it("Should remove user from whitelist", async () => {
    const [, user] = await ethers.getSigners();

    const RewardWhiteList = await ethers.getContractFactory("RewardWhiteList");

    const rewardWhiteList = await RewardWhiteList.deploy();

    let rewardAmount = 1;
    await rewardWhiteList.addUserToRewardList(user.address, rewardAmount);

    await rewardWhiteList.removeFromRewardList(user.address);

    expect(await rewardWhiteList.isWhitelisted(user.address)).to.equal(false);
  })
  it("Should revert removing non-existing user from whitelist", async () => {
    let reverted = false;

    const [, user] = await ethers.getSigners();

    const RewardWhiteList = await ethers.getContractFactory("RewardWhiteList");

    const rewardWhiteList = await RewardWhiteList.deploy();

    try {
      await rewardWhiteList.removeFromRewardList(user.address);
    } catch(ex) {
      reverted = ex.message.includes("User does not exist");
    }

    expect(reverted).to.equal(true);
  })
  it("Should revert removing user from whitelist by unpermitted user", async () => {
    let reverted = false;

    const [, user] = await ethers.getSigners();

    const RewardWhiteList = await ethers.getContractFactory("RewardWhiteList");

    const rewardWhiteList = await RewardWhiteList.deploy();

    let rewardAmount = 1;
    await rewardWhiteList.addUserToRewardList(user.address, rewardAmount);

    try {
      await rewardWhiteList.connect(user).removeFromRewardList(user.address);
    } catch(ex) {
      reverted = ex.message.includes("revert");
    }

    expect(reverted).to.equal(true);
  })
})

describe("RewardWhiteList: Total rewards", () => {
  it("Should update correctly total rewards", async () => {
    const [, user1, user2] = await ethers.getSigners();
  
      const RewardWhiteList = await ethers.getContractFactory("RewardWhiteList");
  
      const rewardWhiteList = await RewardWhiteList.deploy();
  
      const user1RewardAmount = 1;
      await rewardWhiteList.addUserToRewardList(user1.address, user1RewardAmount);
      expect(await rewardWhiteList.totalRewards()).to.equal(user1RewardAmount);
  
      const user2RewardAmount = 1;
      await rewardWhiteList.addUserToRewardList(user2.address, user2RewardAmount);
      expect(await rewardWhiteList.totalRewards()).to.equal(user1RewardAmount + user2RewardAmount);
  })
})