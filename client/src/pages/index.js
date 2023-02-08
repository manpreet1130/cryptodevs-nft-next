import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { render, unstable_renderSubtreeIntoContainer } from 'react-dom'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { contractAddress, contractABI } from '@/constants'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	const [walletConnected, setWalletConnected] = useState(false);
	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);
	const [presaleStarted, setPresaleStarted] = useState(false);
	const [presaleEnded, setPresaleEnded] = useState(false);
	const [totalMinted, setTotalMinted] = useState(0);
	const [isOwner, setIsOwner] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let checkTotalMinted = null;
		if(contract) {
			checkTotalMinted = setInterval(async () => {
				let minted = await contract.tokenId();
				setTotalMinted(minted.toString() - 1);
			}, 5 * 1000);
		}

		let checkPresale = null;
		if(contract) {
			checkPresale = setInterval(async () => {
				let hasPresaleStarted = await contract.hasPresaleStarted();
				setPresaleStarted(hasPresaleStarted);
				if(hasPresaleStarted) {
					let _presaleEndTime = await contract.presaleEndTime();
					if(_presaleEndTime.toString() < Math.floor(Date.now() / 1000).toString()) {
						setPresaleEnded(true);
					}					
				}
			}, 3 * 1000);
		}

		return () => {
			clearInterval(checkTotalMinted);
			clearInterval(checkPresale);
		}
	}, [walletConnected]);

	if(typeof window !== 'undefined') {
		window.ethereum.on('accountsChanged', updateEthers);
	}

	async function updateEthers() {
		let tempProvider = new ethers.BrowserProvider(window.ethereum);
		setProvider(tempProvider);
		let tempSigner = await tempProvider.getSigner();
		setSigner(tempSigner);
		let tempContract = new ethers.Contract(contractAddress, contractABI, tempSigner);
		setContract(tempContract);

		let contractOwner = await tempContract.owner();
		let currentAccount = await tempSigner.getAddress();

		if(currentAccount.toLowerCase() === contractOwner.toLowerCase()) {
			setIsOwner(true);
		}

		setWalletConnected(true);
	}

	async function startPresale() {
		console.log("starting presale...");
		setLoading(true);
		const tx = await contract.startPresale();
		await tx.wait();
		setLoading(false);
		console.log("presale started...");
		setPresaleStarted(true);
	}

	async function presaleMint() {
		console.log("presale mint...");
		setLoading(true);
		const tx = await contract.presaleMint({
			value: ethers.parseEther("0.05")
		});
		await tx.wait();
		setLoading(false);
	}

	async function publicMint() {
		console.log("public mint...");
		setLoading(true);
		const tx = await contract.publicMint({
			value: ethers.parseEther("0.1")
		});
		await tx.wait();
		setLoading(false);

	}


	function renderButton() {
		if(!walletConnected) {
			return <button className={styles.button} onClick={updateEthers}> Connect Wallet </button>
		}
		if(loading) {
			return <div className={styles.description}> Loading... </div> 
		}
		if(totalMinted == 20) {
			return <div className={styles.description}> Sold Out </div>
		}
		if(isOwner && !presaleStarted) {
			return <button className={styles.button} onClick={startPresale}> Start Presale </button>
		} else if(!isOwner && !presaleStarted) {
			return <div className={styles.description}> Presale has not started yet... </div>
		}

		if(presaleStarted && !presaleEnded) {
			return <button className={styles.button} onClick={presaleMint}> Presale Mint! </button>
		} else if(presaleStarted && presaleEnded) {
			return <button className={styles.button} onClick={publicMint}>Public Mint! </button> 
		}
	}

	return (
		<>
			<Head>
				<title>CryptoDevs NFT Collection</title>
				<meta name="description" content="crypto devs nft collection frontend" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className={styles.main}>
				<div>
					<div className={styles.title}>
					Crypto Devs NFT
					</div>
					<div className={styles.decription}>
					{totalMinted}/20 minted so far...
					</div>
					{ renderButton() }
				</div>
			</div>
		</>
	)
}
