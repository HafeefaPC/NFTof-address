"use client";
import { React, useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Web3 from 'web3';
import { UserDataNFTAddress } from '../config';
import UserDataNFTAbi from '../utils/UserDataNFT.json';

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [name, setName] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [nftData, setNftData] = useState(null);

  // Function to connect wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        toast.error('Metamask not detected');
        return;
      }

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      const sepoliaChainId = '0xaa36a7'; // Sepolia Testnet

      if (chainId !== sepoliaChainId) {
        alert('Please connect to the Sepolia Testnet!');
        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
      toast.success('Wallet connected');
    } catch (error) {
      console.error('Error connecting to wallet', error);
    }
  };

  // Function to mint a new NFT with user data
  const mintNFT = async () => {
    if (!name || !addressDetails || !email || !age) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const { ethereum } = window;

      if (ethereum) {
        const web3 = new Web3(ethereum);
        const UserDataNFTContract = new web3.eth.Contract(UserDataNFTAbi.abi, UserDataNFTAddress);

        const transaction = await UserDataNFTContract.methods.createUserDataNFT(name, addressDetails, email, age)
          .send({ from: currentAccount });

        const newTokenId = transaction.events.Transfer.returnValues.tokenId;
        setTokenId(newTokenId);
        toast.success(`NFT minted! Token ID: ${newTokenId}`);
      } else {
        console.error('Ethereum object does not exist');
      }
    } catch (error) {
      console.error('Error minting NFT', error);
      toast.error('Error minting NFT');
    }
  };

  // Function to get user data for an NFT
  const getNFTData = async () => {
    if (!tokenId) {
      toast.error('Please enter a valid Token ID');
      return;
    }

    try {
      const { ethereum } = window;

      if (ethereum) {
        const web3 = new Web3(ethereum);
        const UserDataNFTContract = new web3.eth.Contract(UserDataNFTAbi.abi, UserDataNFTAddress);

        const userData = await UserDataNFTContract.methods.getUserData(tokenId).call();
        setNftData(userData);
        toast.success(`Data retrieved for Token ID: ${tokenId}`);
      } else {
        console.error('Ethereum object does not exist');
      }
    } catch (error) {
      console.error('Error retrieving NFT data', error);
      toast.error('Error retrieving NFT data');
    }
  };

  return (
    <div className='bg-black min-h-screen'>
      <ToastContainer />
      <AppBar position="static">
        <Toolbar className='bg-pink-300'>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className='text-pink-300'>
            UserDataNFT DApp
          </Typography>
          {currentAccount === '' ? (
            <Button color="inherit" onClick={connectWallet}>Connect Wallet</Button>
          ) : (
            <Typography variant="h6">{currentAccount}</Typography>
          )}
        </Toolbar>
      </AppBar>

      <Container>
        {currentAccount === '' ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Button className='bg-pink-300' variant="contained" color="primary" size="large" onClick={connectWallet}>
              Connect Wallet
            </Button>
          </Box>
        ) : correctNetwork ? (
          <Box mt={4} display="flex" flexDirection="row" justifyContent="space-between">
            {/* Mint Section */}
            <Box flex={1} mr={2}>
              <Typography className='text-pink-300' variant="h4" align="center" gutterBottom>
                Mint Your UserDataNFT
              </Typography>
              <Box component="form" display="flex" flexDirection="column" alignItems="center" mb={4}>
                <TextField className='bg-pink-300 text-black rounded-xl w-3/4' label="Name" value={name} onChange={e => setName(e.target.value)} margin="normal" />
                <TextField className='bg-pink-300 text-black rounded-xl w-3/4' label="Address" value={addressDetails} onChange={e => setAddressDetails(e.target.value)} margin="normal" />
                <TextField className='bg-pink-300 text-black rounded-xl w-3/4' label="Email" value={email} onChange={e => setEmail(e.target.value)} margin="normal" />
                <TextField className='bg-pink-300 text-black rounded-xl w-3/4' label="Age" value={age} onChange={e => setAge(e.target.value)} margin="normal" type="number" />
                <Button className='bg-pink-300 rounded-xl w-1/8' variant="contained" color="primary" onClick={mintNFT} style={{ marginTop: 20 }}>
                  Mint NFT
                </Button>
              </Box>
            </Box>

            {/* Retrieve NFT Data Section */}
            <Box flex={1} ml={2}>
              <Typography className='text-pink-300 mb-10' variant="h5" align="center" gutterBottom>
                Retrieve NFT Data
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center">
                <TextField className='bg-pink-300 text-black rounded-xl w-3/4 mb-10' label="Token ID" value={tokenId} onChange={e => setTokenId(e.target.value)} margin="normal" />
                <Button className='bg-pink-300 rounded-xl mb-20' variant="contained" color="secondary" onClick={getNFTData} style={{ marginTop: 20 }}>
                  Get NFT Data
                </Button>
              </Box>

              {nftData && (
                <Box mt={4} p={2} border="1px solid #ccc">
                  <Typography variant="h6">NFT Data:</Typography>
                  <Typography>Name: {nftData.name}</Typography>
                  <Typography>Address: {nftData.addressDetails}</Typography>
                  <Typography>Email: {nftData.email}</Typography>
                  <Typography>Age: {nftData.age}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <Typography variant="h6" color="error">Please connect to the Sepolia Testnet</Typography>
          </Box>
        )}
      </Container>
    </div>
  );
}