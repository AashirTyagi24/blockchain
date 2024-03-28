const crypto = require('crypto');

const cryptoHash = (...inputs) => { //n arguments into a single array inputs
  const hash = crypto.createHash('sha256');

  hash.update(inputs.map(input => JSON.stringify(input)).sort().join(' '));
   //mapping each element in the inputs array to its JSON representation 
   //join all strings in the input 
   //array to a single string with spaces in between

  return hash.digest('hex');  //o/p of hash in hex 
};

module.exports = cryptoHash;