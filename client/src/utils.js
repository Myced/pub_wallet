import Web3 from 'web3';
import Wallet from './contracts/Wallet.json';

const getWeb3 = () => {
	//TODO: make detecting metamaskt to use '@metamask/detect-provider';`
	return new Promise( (resolve, reject) => {
		window.addEventListener('load', async () => {
			if(window.ethereum)
			{
				const web3 = new Web3(window.ethereum);
				try{
					window.ethereum.enable();
					resolve(web3);
				}
				catch(error)
				{
					reject(error)
				}
			}
			else if (window.web3)
			{
				resolve(window.web3);
			}
			else {
				reject("Install metamask");
			}
		});
	})
}

const getWallet = async web3 => {
	const networkId = await web3.eth.net.getId();

	const deployedNetwork = await Wallet.networks[networkId];

	return new web3.eth.Contract(
		Wallet.abi,
		deployedNetwork && deployedNetwork.address
	);
}

export { getWeb3, getWallet };