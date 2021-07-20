const { expect } = require("chai");

describe("Token contract", function () {
  it("Deployment should assign name, symbol and totalSupply", async () => {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("OrionToken");

    const totalSupply = 1;
    const orionToken = await Token.deploy(totalSupply);

    expect(await orionToken.name()).to.equal("ORION");
    expect(await orionToken.symbol()).to.equal("ORN");
    expect(await orionToken.totalSupply()).to.equal(totalSupply);
    expect(await orionToken.balanceOf(owner.address)).to.equal(totalSupply);
  });
});
