const redis = require('redis');
const { isValidChain } = require('./blockchain');
 
const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION'
};
 
class PubSub {
    constructor({ blockchain,transactionPool, redisUrl }) {
        this.blockchain = blockchain;
        this.transactionPool=transactionPool;
    
        this.publisher = redis.createClient(redisUrl);
        this.subscriber = redis.createClient(redisUrl);
 
    (async () => {
      await this.publisher.connect();
      await this.subscriber.connect();
      await this.subscriber.pSubscribe(
        CHANNELS.TEST, (message, channel) => 
        this.handleMessage(channel, message)
      );

      await this.subscriber.pSubscribe(
        CHANNELS.BLOCKCHAIN, (message, channel) => 
        this.handleMessage(channel, message)
      );

      await this.subscriber.pSubscribe(
        CHANNELS.TRANSACTION, (message, channel) => 
        this.handleMessage(channel, message)
      );
    })();
  }
 
    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}. Message: ${message}`);

        const parsedMessage = JSON.parse(message);

        // if (channel === CHANNELS.BLOCKCHAIN) {
        //     this.blockchain.replaceChain(parsedMessage);
        //     //will change blockchain iff the incoming 
        //     //chain is longer & valid
        // }

        switch(channel) {
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage, () => {
                    this.transactionPool.clearBlockchainTransactions({
                       chain: parsedMessage
                    });
                });
              break;
            case CHANNELS.TRANSACTION:
              this.transactionPool.setTransaction(parsedMessage);
              break;
            default:
              return;
        }


    }

    //we don't want to publish to our own channel so
    //we unsub then publish and finally again sub
    publish({ channel, message}) {
        this.publisher.publish(channel, message);
    }

   broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction){
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
            });
    }


}
 
module.exports = PubSub;