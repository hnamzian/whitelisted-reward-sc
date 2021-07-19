const { expect } = require("chai");

describe("RewardList contract: Term", function () {
  it("Deployment should assign term", async () => {
    const RewardList = await ethers.getContractFactory("RewardList");

    const term = 1;
    const rewardList = await RewardList.deploy(term);

    expect(await rewardList.term()).to.equal(term);
  });
  it("Should revert deployment with term equals 0", async () => {
    const RewardList = await ethers.getContractFactory("RewardList");

    const term = 0;
    try {
      await RewardList.deploy(term);
    } catch(ex) {
      expect(ex.message).includes("term must be greater than 0");
    }
  })
  it("Should revert setting term to 0", async () => {
    const RewardList = await ethers.getContractFactory("RewardList");

    const term = 1;
    const rewardList = await RewardList.deploy(term);

    try {
      await rewardList.setTerm(0);
    } catch(ex) {
      expect(ex.message).includes("term must be greater than 0");
    }
  })
});

describe("RewardList: Rewards", () => {
  it("Should add user to rewards list", async () => {
    const [, user] = await ethers.getSigners();

    const RewardList = await ethers.getContractFactory("RewardList");

    const term = 1;
    const rewardList = await RewardList.deploy(term);

    const amount = 1;
    await rewardList.addUserToRewardList(user.address, amount);

    expect(await rewardList.rewardsOf(user.address)).to.equal(amount);
  })
  it("Should revert adding user to rewards list by unpermitted user", async () => {
    const [, invalidOwner, user] = await ethers.getSigners();

    const RewardList = await ethers.getContractFactory("RewardList");

    const term = 1;
    const rewardList = await RewardList.deploy(term);

    const amount = 1;
    try {
      await rewardList.connect(invalidOwner).addUserToRewardList(user.address, amount);
    } catch(ex) {
      expect(ex.message).includes("revert");
    }
  })
  it("Should revert adding existing user to rewards list", async () => {
    const [user] = await ethers.getSigners();

    const RewardList = await ethers.getContractFactory("RewardList");

    const term = 1;
    const rewardList = await RewardList.deploy(term);

    const amount = 1;
    await rewardList.addUserToRewardList(user.address, amount);

    try {
      await rewardList.addUserToRewardList(user.address, amount);
    } catch(ex) {
      expect(ex.message).includes("User alreadt exists");
    }
  })
})
