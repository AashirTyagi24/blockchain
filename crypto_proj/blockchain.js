const Block = require('./block');
const cryptoHash = require('./crypto-hash');


class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
        lastBlock: this.chain[this.chain.length-1],
        data
    });

    this.chain.push(newBlock);
  }

  replaceChain(chain, onSuccess) {
    if (chain.length < this.chain.length) {
      return;
    }

    if (!Blockchain.isValidChain(chain)) {
      return;
    }

    if (onSuccess) onSuccess();
    this.chain = chain;
  }

    static isValidChain(chain) {
        /* Rule-1 start with genesis
        Rule-2 lastHash reference should be same
        Rule-3 block with invalid field
        */
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
    
        for (let i=1; i<chain.length; i++) {
          const { timestamp, lastHash, hash, data,nonce,difficulty } = chain[i];
          const actualLastHash = chain[i-1].hash;
          const lastDifficulty = chain[i-1].difficulty;
    
          if (lastHash !== actualLastHash) return false;
    
          const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

          if (hash !== validatedHash) return false;

          if (Math.abs(lastDifficulty - difficulty) > 1) return false;
        }
    
        return true;
    }
}
module.exports = Blockchain;