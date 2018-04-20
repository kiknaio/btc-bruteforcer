const fetch = require('node-fetch');
const bitcore = require('bitcore');
const fs = require('fs');

let i = 0;

const generateAddress = () => {
	const privateKey = new bitcore.PrivateKey();
	const addressSeed = privateKey.toAddress();
	const address = addressSeed.toObject();

	address.privateKey = privateKey.toObject().bn;
	return address;
}

const checkAddress = async address => {
	let errorCount = 0;
	let response;
	try {
		response = await fetch(`https://blockchain.info/rawaddr/${address}`);
		response = await response.json();
		if(response.final_balance > 0) {
			console.log('-'.repeat(50), '>', 'Found!!', '<', '-'.repeat(50))
			fs.appendFile('found.txt', '-'.repeat(50) + '>' + 'Found!!' + '<' + '-'.repeat(50) + '\n', (err) => {
				if(err) throw err;
			})
			i = 1000;
			return;
		} else {
			console.log('Empty balance')
			console.log('-'.repeat(100))
			fs.appendFile('responses.txt', 'Empty balance \n', (err) => {
				if(err) throw err;
			})
		}
	} catch(err) {
		errorCount++;
	}
}


const bruteforce = (rounds) => {
	console.log(`Bruteforce ${rounds} times`)
	if(typeof rounds != 'number') {
		throw new Error('Please provide number as an argument');
		return;
	}
	while(i < rounds) {
		let sampleAddress = generateAddress();
		// console.log(`Try #${i}`, sampleAddress);

		fs.appendFile('adresses.txt', JSON.stringify(sampleAddress) + '\n', (err) => {
			if(err) throw err;
		})
		let addrs = sampleAddress.hash;

		checkAddress(addrs).then(() => console.log(`Balance fetched: ${addrs}`));
		i++;
	}	
}


bruteforce(parseInt(process.argv[2]));
