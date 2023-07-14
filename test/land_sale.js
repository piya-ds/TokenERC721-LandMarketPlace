const LandSale = artifacts.require("LandSale");

let instance;

contract("LandSale", function (accounts) {
  it("The contracts are deployed correctly", async function () {
    instance = await LandSale.deployed();
    assert.isNotNull(instance.address);
  });

  it("Create a new land asset", async function () {
    await instance.registerNewLand(101, "Kollam", "Karunagappally", "Kuzhithura", 08, 10000, 500, {from: accounts[0]})
    const data = await instance.getLandDetails(0);
    assert.equal(data[0], 101);
    assert.equal(data[1], "Kollam");
    assert.equal(data[2], "Karunagappally");
    assert.equal(data[3], "Kuzhithura");
    assert.equal(data[4], 08);
    assert.equal(data[5], 10000);
    assert.equal(data[6], 500);
   });

   it("Bid for the land asset", async function () {
    await instance.bid(1, {from: accounts[1], value: 10000})
   })

   it("Confirm and close the bidding for the land asset", async function () {
    await instance.acceptBid(1, {from: accounts[0]})
   })
});