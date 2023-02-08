
export default function handler(req, res) {
    let tokenId = req.query.tokenId;

    const name = `CryptoDevs NFT #${tokenId}`;
    const description = "CryptoDevs is an NFT collection for developers!";
    const imageURI = `https://raw.githubusercontent.com/manpreet1130/cryptodevs-nft-next/main/client/public/${Number(tokenId) - 1}.svg`

    res.status(200).json({
        name: name,
        description: description,
        image: imageURI
    });
  }