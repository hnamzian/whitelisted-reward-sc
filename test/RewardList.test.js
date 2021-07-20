const { expect } = require("chai");

describe("RewardPayout contract: Term", function () {
  it("Deployment should assign term", async () => {
    const Token = await ethers.getContractFactory("OrionToken");

    const totalSupply = 1;
    const orionToken = await Token.deploy(totalSupply);

    const RewardPayout = await ethers.getContractFactory("RewardPayout");

    const term = 1;
    const rewardPayout = await RewardPayout.deploy(term, orionToken.address);

    expect(await rewardPayout.term()).to.equal(term);
  });
  it("Should revert deployment with term equals 0", async () => {
    let reverted = false;

    const Token = await ethers.getContractFactory("OrionToken");

    const totalSupply = 1;
    const orionToken = await Token.deploy(totalSupply);
    
    const RewardPayout = await ethers.getContractFactory("RewardPayout");

    const term = 0;
    try {
      await RewardPayout.deploy(term, orionToken.address);
    } catch(ex) {
      reverted = ex.message.includes("term must be greater than 0");
    }

    expect(reverted).to.equal(true);
  })
  it("Should revert setting term to 0", async () => {
    let reverted = false;

    const Token = await ethers.getContractFactory("OrionToken");

    const totalSupply = 1;
    const orionToken = await Token.deploy(totalSupply);

    const RewardPayout = await ethers.getContractFactory("RewardPayout");

    const term = 1;
    const rewardPayout = await RewardPayout.deploy(term, orionToken.address);

    try {
      await rewardPayout.setTerm(0);
    } catch(ex) {
      reverted = ex.message.includes("term must be greater than 0");
    }

    expect(reverted).to.equal(true);
  })
});

describe("RewardPayout: Rewards", () => {
  it("Should add user to rewards list", async () => {
    const Token = await ethers.getContractFactory("OrionToken");

    const totalSupply = 1;
    const orionToken = await Token.deploy(totalSupply);

    const [, user] = await ethers.getSigners();

    const RewardPayout = await ethers.getContractFactory("RewardPayout");

    const term = 1;
    const rewardPayout = await RewardPayout.deploy(term, orionToken.address);

    const amount = 1;
    await rewardPayout.addUserToRewardList(user.address, amount);

    expect(await rewardPayout.rewardsOf(user.address)).to.equal(amount);
  })
  it("Should revert adding user to rewards list by unpermitted user", async () => {
    let reverted = false;

    const Token = await ethers.getContractFactory("OrionToken");

    const totalSupply = 1;
    const orionToken = await Token.deploy(totalSupply);

    const [, invalidOwner, user] = await ethers.getSigners();

    const RewardPayout = await ethers.getContractFactory("RewardPayout");

    const term = 1;
    const rewardPayout = await RewardPayout.deploy(term, orionToken.address);

    const amount = 1;
    try {
      await rewardPayout.connect(invalidOwner).addUserToRewardList(user.address, amount);
    } catch(ex) {
      reverted = ex.message.includes("revert");
    }

    expect(reverted).to.equal(true);
  })
  it("Should revert adding existing user to rewards list", async () => {
    let reverted = false;

    const Token = await ethers.getContractFactory("OrionToken");

    const totalSupply = 1;
    const orionToken = await Token.deploy(totalSupply);

    const [user] = await ethers.getSigners();

    const RewardPayout = await ethers.getContractFactory("RewardPayout");

    const term = 1;
    const rewardPayout = await RewardPayout.deploy(term, orionToken.address);

    const amount = 1;
    await rewardPayout.addUserToRewardList(user.address, amount);

    try {
      await rewardPayout.addUserToRewardList(user.address, amount);
    } catch(ex) {
      reverted = ex.message.includes("User already exists");
    }

    expect(reverted).to.equal(true);
  })
})
