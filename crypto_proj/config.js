const INITIAL_DIFFICULTY = 4;
const MINE_RATE = 1000;
const STARTING_BALANCE = 1000;

const GENESIS_DATA={
    timestamp:1,
    lastHash:'aaaaa',
    hash:'aashir',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data:[]
};

module.exports = { GENESIS_DATA, MINE_RATE, STARTING_BALANCE };