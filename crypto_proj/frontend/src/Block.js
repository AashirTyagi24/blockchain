import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction'; // Assuming Transaction component is in a separate file

class Block extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFullData: false
    };
  }

  toggleShowFullData = () => {
    this.setState(prevState => ({
      showFullData: !prevState.showFullData
    }));
  };

  renderFullData = data => {
    return (
      <div>
        {data.map((transaction, index) => (
          <Transaction key={index} transaction={transaction} />
        ))}
      </div>
    );
  };

  render() {
    const { timestamp, hash, data } = this.props.block;
    let hashDisplay = `${hash.substring(0, 15)}...`;
    const stringifiedData = JSON.stringify(data);
    const truncatedData = stringifiedData.length > 35 ? stringifiedData.substring(0, 35) + '...' : stringifiedData;

    return (
      <div className='Block'>
        <div>Hash: {hashDisplay}</div>
        <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
        <div>
          Data: {this.state.showFullData ? this.renderFullData(data) : truncatedData}
          {stringifiedData.length > 35 && (
            <Button bsStyle="danger" bsSize="small" onClick={this.toggleShowFullData}>
              {this.state.showFullData ? 'Show Less' : 'Show More'}
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default Block;
