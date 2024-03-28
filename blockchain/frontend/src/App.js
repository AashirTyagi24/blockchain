import React, { Component } from 'react';
import logo from './assets/logo.png';
import gem from './assets/gem.png'
import {Link} from 'react-router-dom';

class App extends Component{
    state = { walletInfo: {} };

    //fires after component has been inserted into 
    //the main document
    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
        .then(response => response.json())
        .then(json => this.setState({ walletInfo: json }));
    }

    render(){
        const { address, balance } = this.state.walletInfo;
        return (
            <div className='App'>
                <img className='logo' src={logo}></img>
                <br />
                <div style={{ fontSize: '30px' }}>Cryptography!!</div>
                <br />
                <div><Link to='/blocks'>Blocks</Link></div>
                <div><Link to='/conduct-transaction'>Conduct a Transaction</Link></div>
                <div><Link to='/transaction-pool'>Transaction Pool</Link></div>
                <br />
                <div className='WalletInfo'> 
                    <div>Address: {address}</div>
                    <div>Balance: {balance}<span style={{ marginRight: '5px' }}></span><img src={gem} style={{ width: '20px', height: '22px' }} /></div>
                </div>
            </div>
        );
    }
}

export default App;