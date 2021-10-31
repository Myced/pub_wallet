const { assert } = require("chai");
const { expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require("@openzeppelin/test-helpers/src/setup");
const Wallet = artifacts.require('Wallet');

contract('Wallet', (accounts) => {
	let wallet;

	beforeEach( async () => {
		//initialise our wallet contract
		wallet = await Wallet.new([
			accounts[0],
			accounts[1],
			accounts[2]
		], 2);

		await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: 1000});
	});

	it('should have correct approvers and quorum', async () => {
		const approvers = await wallet.getApprovers();
		const quorum = await wallet.quorum();

		assert(approvers.length === 3);
		assert(approvers[0] === accounts[0]);
		assert(approvers[1] === accounts[1]);
		assert(approvers[2] === accounts[2]);

		assert(quorum.toNumber() === 2);
	});

	it('should create a new transfer', async () => {
		await wallet.createTransfer(100, accounts[5]);
		const transfers = await wallet.getTransfers();

		assert(transfers.length === 1);
		assert(transfers[0].id === '0');
		assert(transfers[0].amount === '100');
		assert(transfers[0].to === accounts[5]);
		assert(transfers[0].approvals === '0');
		assert(transfers[0].sent === false);
	});

	it('should not create transfer if sender is not approved', async () =>{
		await expectRevert(
			wallet.createTransfer(100, accounts[5], {from: accounts[4]}),
			'Only approvers can execute'
		);
	});

	it('should increment approvals', async () => {
		await wallet.createTransfer(100, accounts[5], {from: accounts[0]});
		await wallet.approveTransfer(0, {from: accounts[0]});
		const balance = await web3.eth.getBalance(wallet.address);
		const transfers = await wallet.getTransfers();
		const transfer = transfers[0];

		assert(transfer.sent === false);
		assert(transfer.approvals === '1');
		assert(balance === '1000');
	})

	it("should send tranfer if quorum is reached", async () =>{
		const balanceBefore = web3.utils.toBN( await web3.eth.getBalance(accounts[6]) );

		//create and approve a tranfer
		await wallet.createTransfer(100, accounts[6], {from: accounts[0]});
		await wallet.approveTransfer(0, {from: accounts[0]});
		await wallet.approveTransfer(0, {from: accounts[1]});

		const balanceAfter = web3.utils.toBN( await web3.eth.getBalance(accounts[6]) );

		const difference = balanceAfter.sub(balanceBefore).toNumber();

		assert(difference === 100);
	});

	it('should not approve transfer is sender is not approved', async () => {
		await wallet.createTransfer(100, accounts[5], {from: accounts[0]});

		await expectRevert(
			wallet.approveTransfer(0, {from: accounts[6]}),
			'Only approvers can execute'
		);
	});

	it('should not approve a transfer twice from the same sender', async () => {
		await wallet.createTransfer(100, accounts[5], {from: accounts[0]});
		wallet.approveTransfer(0, {from: accounts[0]})

		await expectRevert(
			wallet.approveTransfer(0, {from: accounts[0]}),
			'cannot approve transfer twice'
		);
	});

	it('should NOT approve transfer if transfer is already sent', async () => {
		await wallet.createTransfer(100, accounts[5], {from: accounts[2]});
		await wallet.approveTransfer(0, {from: accounts[0]})
		await wallet.approveTransfer(0, {from: accounts[1]})

		await expectRevert(
			wallet.approveTransfer(0, {from: accounts[2]}),
			'transfer has already been sent'
		);
	})
})