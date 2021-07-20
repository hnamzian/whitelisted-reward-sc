const { expect } = require("chai");

describe("RewardList contract: Term", function () {
  it("Deployment should assign term", async () => {
    const Token = await ethers.getContractFactory("OrionToken");

    const totalSupply = 1;
    const orionToken = await Token.deploy(totalSupply);

    const RewardList = await ethers.getContractFactory("RewardList");

    const term = 1;
    const rewardList = await RewardList.deploy(term, orionToken.address);

    expect(await rewardList.term()).to.equal(term);
  });
  it("Should revert deployment with term equals 0", async () => {
    const Token = await ethers.getContractFactory("OrionToken");

    const totalSupply = 1;
    const orionToken = await Token.deploy(totalSupply);
    
    const RewardList = await ethers.getContractFactory("RewardList");

    const term = 0;
    try {
      await RewardList.deploy(term, orionToken.address);
    } catch(ex) {
      expect(ex.message).includes("term must be greater than 0");
    }
  })
  it("Should revert setting term to 0", async () => {
    const Token = await ethers.getContractFactory("OrionToken");

    const totalSupply = 1;
    const orionToken = await Token.deploy(totalSupply);

    const RewardList = await ethers.getContractFactory("RewardList");

    const term = 1;
    const rewardList = await RewardList.deploy(term, orionToken.address);

    try {
      await rewardList.setTerm(0);
    } catch(ex) {
      expect(ex.message).includes("term must be greater than 0");
    }
  })
});

describe("RewardList: Rewards", () => {
  it("Should add user to rewards list", async () => {
    const Token = await ethers.getContractFactory("OrionToken");

    const totalSupply = 1;
    const orionToken = await Token.deploy(totalSupply);

    const [, user] = await ethers.getSigners();

    const RewardList = await ethers.getContractFactory("RewardList");

    const term = 1;
    const rewardList = await RewardList.deploy(term, orionToken.address);

    const amount = 1;
    await rewardList.addUserToRewardList(user.address, amount);

    expect(await rewardList.rewardsOf(user.address)).to.equal(amount);
  })
  it("Should revert adding user to rewards list by unpermitted user", async () => {
    const Token = await ethers.getContractFactory("OrionToken");

    const totalSupply = 1;
    const orionToken = await Token.deploy(totalSupply);

    const [, invalidOwner, user] = await ethers.getSigners();

    const RewardList = await ethers.getContractFactory("RewardList");

    const term = 1;
    const rewardList = await RewardList.deploy(term, orionToken.address);

    const amount = 1;
    try {
      await rewardList.connect(invalidOwner).addUserToRewardList(user.address, amount);
    } catch(ex) {
      expect(ex.message).includes("revert");
    }
  })
  it("Should revert adding existing user to rewards list", async () => {
    const Token = await ethers.getContractFactory("OrionToken");

    const totalSupply = 1;
    const orionToken = await Token.deploy(totalSupply);

    const [user] = await ethers.getSigners();

    const RewardList = await ethers.getContractFactory("RewardList");

    const term = 1;
    const rewardList = await RewardList.deploy(term, orionToken.address);

    const amount = 1;
    await rewardList.addUserToRewardList(user.address, amount);

    try {
      await rewardList.addUserToRewardList(user.address, amount);
    } catch(ex) {
      expect(ex.message).includes("User alreadt exists");
    }
  })
})
