import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class ConductTransaction extends Component {
    state = { recipient: '', amount: 0 };

    handleRecipientChange = (event) => {
        this.setState({ recipient: event.target.value });
    }
    
    handleAmountChange = (event) => {
        this.setState({ amount: Number(event.target.value) });
    }

    handleSubmit = () => {
        const { recipient, amount } = this.state;

        fetch(`${document.location.origin}/api/transact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient, amount })
        }).then(response => response.json())
        .then(json => {
            alert(json.message || json.type);
        });
        this.setState({ recipient: '', amount: 0 });
    }

    render(){
        return (
            <div className='ConductTransaction'>
                <Link to='/'>Home</Link>
                <h3>Conduct Transaction</h3>
                <div style={{ marginBottom: '15px' }}>
                    <FormGroup>
                        <FormControl
                            input='text'
                            placeholder='recipient'
                            value={this.state.recipient}
                            onChange={this.handleRecipientChange}
                        />
                    </FormGroup>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <FormGroup>
                        <FormControl
                            input='number'
                            placeholder='amount'
                            value={this.state.amount}
                            onChange={this.handleAmountChange}
                        />
                    </FormGroup>
                </div>
                <div>
                    <Button bsStyle="danger" onClick={this.handleSubmit}>
                        Submit
                    </Button>
                </div>
            </div>
        );
    }      
}

export default ConductTransaction;
