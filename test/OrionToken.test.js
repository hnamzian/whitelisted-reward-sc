const { expect } = require("chai");

describe("Token contract", function () {
  it("Deployment should assign name, symbol and totalSupply", async () => {
    const Token = await ethers.getContractFactory("OrionToken");

    const orionToken = await Token.deploy();

    expect(await orionToken.totalSupply()).to.equal(0);
    expect(await orionToken.name()).to.equal("ORION");
    expect(await orionToken.symbol()).to.equal("ORN");
  });
});
