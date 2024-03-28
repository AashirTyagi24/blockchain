const bodyParser = require('body-parser');
const express = require('express');
const Blockchain = require('./blockchain');
const PubSub = require('./pubsub');
const request = require('request');
const TransactionPool = require('./transaction-pool');
const Wallet = require('./wallet');
const Transaction = require('./transaction');
const TransactionMiner = require('./transaction-miner');
const path = require('path');

const app = express();
const blockchain = new Blockchain();
const transactionPool= new TransactionPool();
const wallet= new Wallet();

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
const REDIS_URL='redis-11395.c264.ap-south-1-1.ec2.cloud.redislabs.com:11395';

const pubsub= new PubSub({blockchain, transactionPool,redisUrl: REDIS_URL});
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'./frontend/dist')));

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });

  pubsub.broadcastChain();

  res.redirect('/api/blocks');
});
app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;
    let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });
    try {
            if (transaction) {
                //transaction = new Transaction(transaction); // Convert to Transaction instance
                const {id , outputMap,input }=transaction;
                transaction=new Transaction({id,outputMap,input});
                console.log('hell');
                transaction.update({ senderWallet: wallet, recipient, amount });
            } else {
                transaction = wallet.createTransaction({
                    recipient,
                    amount,
                    chain: blockchain.chain
                });
            }
        } catch(error) {
            return res.status(400).json({ type: 'error', message: error.message });
        }

    transactionPool.setTransaction(transaction);

    pubsub.broadcastTransaction(transaction);

    res.json({ type: 'success', transaction });
});

app.get('/api/transaction-pool-map',(req,res)=>{
    res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
    transactionMiner.mineTransactions();
  
    res.redirect('/api/blocks');
});

app.get('/api/wallet-info', (req, res) => {
  
    res.json({
      address:wallet.publicKey,
      balance: Wallet.calculateBalance({ chain: blockchain.chain, address:wallet.publicKey })
    });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/dist/index.html'));
});

const syncChainsAndTPool = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        //if no error and success http
        //body contains blockchain in JSON stringify
        const rootChain = JSON.parse(body);
  
        console.log('replace chain on a sync with', rootChain);
        blockchain.replaceChain(rootChain);
      }
    });

    request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const rootTransactionPoolMap = JSON.parse(body);
    
          console.log('replace transaction pool map on a sync with', rootTransactionPoolMap);
          transactionPool.setMap(rootTransactionPoolMap);
        }
      });
};

const PORT = process.env.PORT || (process.env.GENERATE_PEER_PORT === 'true' ? DEFAULT_PORT + Math.ceil(Math.random() * 1000) : DEFAULT_PORT);
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);
    
    if (PORT !== DEFAULT_PORT) {
        syncChainsAndTPool();
    }
});
  