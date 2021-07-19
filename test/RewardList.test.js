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
