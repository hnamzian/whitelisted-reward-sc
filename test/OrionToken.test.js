const { expect } = require("chai");

const MINTER_ROLE = ethers.utils.solidityKeccak256(['string'],["MINTER_ROLE"]);

describe("Token contract", function () {
  it("Deployment should assign name, symbol and totalSupply", async () => {
    const Token = await ethers.getContractFactory("OrionToken");

    const orionToken = await Token.deploy();

    expect(await orionToken.totalSupply()).to.equal(0);
    expect(await orionToken.name()).to.equal("ORION");
    expect(await orionToken.symbol()).to.equal("ORN");
  });
});

describe("Mint Token", function () {
  it("Owner should grant MINTER_ROLE to minter address", async () => {
    const [, minter] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("OrionToken");

    const orionToken = await Token.deploy();

    expect(await orionToken.hasRole(MINTER_ROLE, minter.address)).to.equal(false);

    await orionToken.grantRole(MINTER_ROLE, minter.address);
    
    expect(await orionToken.hasRole(MINTER_ROLE, minter.address)).to.equal(true);
  })
  it("Minter should be able to mint token for any address", async () => {
    const [, minter, receiver] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("OrionToken");

    const orionToken = await Token.deploy();

    await orionToken.grantRole(MINTER_ROLE, minter.address);

    expect(await orionToken.balanceOf(receiver.address)).to.equal(0);

    const amount = 1;
    await orionToken.connect(minter).mint(receiver.address, amount);

    const balance = await orionToken.balanceOf(receiver.address);
    expect(parseInt(balance)).to.equal(amount);
  })
})