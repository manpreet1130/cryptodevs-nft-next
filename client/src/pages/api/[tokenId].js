
export default function handler(req, res) {
    let tokenId = req.query.tokenId;

    const name = `CryptoDevs NFT #${tokenId}`;
    const description = "CryptoDevs is an NFT collection for developers!";
    const imageURI = ""

    res.status(200).json({
    });
  }