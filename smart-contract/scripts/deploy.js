async function main() {
	console.log("deploying contract...");
	const NFT = await ether.contractFactory("NFT");
	const nft = await NFT.deploy(
		"", // baseURI
		"CryptoDevs NFT", // name
		"CD", // symbol
		"0x204d0E513C657fdDF1e7FC0e097268C40bD7a4d0" // whitelist contract address
	);
	await nft.deployed();
	console.log(`deployed: ${nft.address}`);
}

main().then(() => {
	console.log("deployed successfully");
	process.exit(0);
}).catch((err) => {
	console.error(err);
	process.exit(1);
}) 