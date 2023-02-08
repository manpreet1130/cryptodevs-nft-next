import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { unstable_renderSubtreeIntoContainer } from 'react-dom'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

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

	useEffect(() => {
	}, []);

	if(typeof window !== 'undefined') {
		window.ethereum.on('accountsChanged', updateEthers);
	}

	async function updateEthers() {
		// let tempProvider = new ethers.BrowserProvider(window.ethereum);
		// setProvider(tempProvider);
		// let tempSigner = tempProvider.getSigner();
		// setSigner(tempSigner);
		// let tempContract = new ethers.Contract(contractAddress, contractABI, tempSigner);
		// setContract(tempContract);

		// setWalletConnected(true);
	}


	function renderButton() {
		if(!walletConnected) {
			return <button className={styles.button} onClick={updateEthers}> Connect Wallet </button>
		}
		if(isOwner && !presaleStarted) {
			return <button className={styles.button}> Start Presale </button>
		} else if(!isOwner && !presaleStarted) {
			return <div className={styles.description}> Presale has not started yet... </div>
		}

		if(presaleStarted && !presaleEnded) {
			return <button className={styles.button}> Presale Mint! </button>
		} else if(presaleStarted && presaleEnded) {
			return <button className={styles.button}>Public Mint! </button> 
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
					5/20 minted so far...
					</div>
					{ renderButton() }
				</div>
			</div>
		</>
	)
}
