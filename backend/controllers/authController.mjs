import jwt from 'jsonwebtoken';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { PublicKey } from '@solana/web3.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const User = require('../models/User.js');

// Helper to verify Solana signature
function verifySolanaSignature(message, signature, publicKey) {
  try {
    const msgUint8 = new TextEncoder().encode(message);
    const sigUint8 = bs58.decode(signature);
    const pubKeyUint8 = new PublicKey(publicKey).toBytes();
    return nacl.sign.detached.verify(msgUint8, sigUint8, pubKeyUint8);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

export const loginWithWallet = async (req, res) => {
  const { wallet, message, signature } = req.body;
  if (!wallet || !message || !signature) {
    return res.status(400).json({ error: 'Missing wallet, message, or signature' });
  }
  
  try {
    // Verify signature
    const valid = verifySolanaSignature(message, signature, wallet);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Find or create validator user
    let user = await User.findOne({ solanaWallet: wallet, role: 'validator' });
    if (!user) {
      // Generate unique username for validator
      const baseUsername = `validator_${wallet.slice(-8)}`;
      let username = baseUsername;
      let counter = 1;
      
      // Check if username exists and increment counter if needed
      while (await User.findOne({ username })) {
        username = `${baseUsername}_${counter}`;
        counter++;
      }
      
      user = await User.create({
        username,
        solanaWallet: wallet,
        role: 'validator'
        // No email or password needed for validators
      });
      console.log(`✅ New validator registered: ${wallet} with username: ${username}`);
    } else {
      console.log(`✅ Existing validator logged in: ${wallet}`);
    }
    
    // Issue JWT
    const token = jwt.sign(
      { id: user._id, wallet: user.solanaWallet, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        wallet: user.solanaWallet,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Wallet login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}; 