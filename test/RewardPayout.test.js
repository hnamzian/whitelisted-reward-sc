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

describe("RewardPayout: Get reward", () => {
  it("Should transfer ORN as rewards to user", async () => {
    const [, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("OrionToken");

    const totalSupply = 100;
    const orionToken = await Token.deploy(totalSupply);

    const RewardPayout = await ethers.getContractFactory("RewardPayout");

    const term = 5;
    const rewardPayout = await RewardPayout.deploy(term, orionToken.address);
    
    await orionToken.transfer(rewardPayout.address, 100);

    const rewardAmount = 20;
    await rewardPayout.addUserToRewardList(user.address, rewardAmount);

    const rewardStartTime = await rewardPayout.rewardStartsAt(user.address);
    const rate = rewardAmount / term;
    let earned = 0;
    while (earned < rewardAmount) {
      await rewardPayout.connect(user).getReward();
      earned = await rewardPayout.earned(user.address);
      const balance = await orionToken.balanceOf(user.address);

      const payments = await rewardPayout.paymentsOf(user.address);
      const [, lastPaymentTime] = payments[payments.length - 1];

      const totalPayment = rate * (lastPaymentTime - rewardStartTime);
      expect(earned).to.equal(totalPayment);
      expect(balance).to.equal(totalPayment); 
      expect(await rewardPayout.totalPayouts()).to.equal(totalPayment);
    }
  })
  it("Should transfer ORN as rewards to user when term changes", async () => {
    const [, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("OrionToken");

    const totalSupply = 100;
    const orionToken = await Token.deploy(totalSupply);

    const RewardPayout = await ethers.getContractFactory("RewardPayout");

    let term = 5;
    const rewardPayout = await RewardPayout.deploy(term, orionToken.address);
    
    await orionToken.transfer(rewardPayout.address, 100);

    const rewardAmount = 20;
    await rewardPayout.addUserToRewardList(user.address, rewardAmount);

    const rewardStartTime = await rewardPayout.rewardStartsAt(user.address);
    let earned = 0;
    while (earned < rewardAmount) {
      const rate = rewardAmount / term;
      await rewardPayout.connect(user).getReward();
      earned = await rewardPayout.earned(user.address);
      const balance = await orionToken.balanceOf(user.address);

      const payments = await rewardPayout.paymentsOf(user.address);
      const [, lastPaymentTime] = payments[payments.length - 1];

      const totalPayment = Math.min(rate * (lastPaymentTime - rewardStartTime), 20);
      expect(earned).to.equal(totalPayment);
      expect(balance).to.equal(totalPayment); 
      expect(await rewardPayout.totalPayouts()).to.equal(totalPayment);

      term -= 1;
      await rewardPayout.setTerm(term);
    }

    let reverted = false;
    try {
      await rewardPayout.connect(user).getReward();
    } catch(ex) {
      reverted = ex.message.includes("payout amount is 0")
    }
    expect(reverted).to.equal(true);
  })
})

describe("RewardPayouts: Update Rewrds", () => {
  it("Should revert updating reward amount lower payouts", async () => {
    let reverted = false;

    const [, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("OrionToken");

    const totalSupply = 100;
    const orionToken = await Token.deploy(totalSupply);

    const RewardPayout = await ethers.getContractFactory("RewardPayout");

    let term = 5;
    const rewardPayout = await RewardPayout.deploy(term, orionToken.address);
    
    await orionToken.transfer(rewardPayout.address, 100);

    let rewardAmount = 20;
    await rewardPayout.addUserToRewardList(user.address, rewardAmount);

    await rewardPayout.connect(user).getReward();

    rewardAmount = 0;
    try {
      await rewardPayout.updateRewardAmount(user.address, rewardAmount);
    } catch(ex) {
      reverted = ex.message.includes("New amount cannot be lower than current payouts")
    }
    expect(reverted).to.equal(true);
  })
})

describe("RewardPayouts: Remove Rewards", () => {
  it("Should set reward amount to totalPayouts when remvoed from whitelist", async () => {
    let reverted = false;

    const [, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("OrionToken");

    const totalSupply = 100;
    const orionToken = await Token.deploy(totalSupply);

    const RewardPayout = await ethers.getContractFactory("RewardPayout");

    let term = 5;
    const rewardPayout = await RewardPayout.deploy(term, orionToken.address);
    
    await orionToken.transfer(rewardPayout.address, 100);

    let rewardAmount = 20;
    await rewardPayout.addUserToRewardList(user.address, rewardAmount);

    await rewardPayout.connect(user).getReward();

    await rewardPayout.removeFromRewardList(user.address);

    const earned = await rewardPayout.earned(user.address);
    const reward = await rewardPayout.rewardsOf(user.address);

    expect(reward).to.equal(earned);
  })
})