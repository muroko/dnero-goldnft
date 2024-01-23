/**
 *  This script will calculate the constructor arguments for GoldNFT.sol and deploy it.
 *  After deploying, you can access the contract on etherscan.io with the deployed contract address.
 */

const hre = require('hardhat')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const whitelist = require('./whitelist.js')

//GoldNFT Official - Dnero Mainnet Official IPFS Metadata CID
/** const BASE_URI = 'ipfs://QmSkKxTgVtdS8siDgg1Tkp57Ek5GLvPfKdMB1ZDWLayeY5/'*/
//GoldNFT-Test
const BASE_URI = 'ipfs://QmVxyoFVvoJVFPB9cKXhhNiDLWKkKFoCPvcbqWBgQ2FFFH/'
const proxyRegistryAddressRinkeby = '0xf57b2c51ded3a29e6891aba85459d600256cf317'
// proxyRegistryAddressMainnet Fully Deployed on Dnero Mainnet
const proxyRegistryAddressMainnet = '0x0f3c9AE3d23A7ef05FDAe18c6558E2c263AA7b1a'

async function main() {
  // Calculate merkle root from the whitelist array
  const leafNodes = whitelist.map((addr) => keccak256(addr))
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
  const root = merkleTree.getRoot()

  // Deploy the contract
  const GoldNft = await hre.ethers.getContractFactory('GoldNft')
  const goldNft = await GoldNft.deploy(
    BASE_URI,
    root,
    proxyRegistryAddressMainnet
  )

  await goldNft.deployed()

  console.log('GoldNft deployed to:', goldnft.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
