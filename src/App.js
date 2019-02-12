import React, { Component } from "react";
import Input from './component/Input';
import TransactionTable from './component/TransactionTable';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numTrans: 5,
      minSup: 0,
      minCon: 0,
      itemSet: []
    };
  }
  render() {
    return (
      <div>
        <h1>Apiori App</h1>
        <h2>Start editing to see some magic happen!</h2>
        <Input name="minSup" title="Minimum support" onChange={this.handleInput} placeholder={0 + ''} />
        <Input name="minCon" title="Minimum confidence" onChange={this.handleInput} placeholder={0 + ''} />
        <Input name="numTrans" title="Number of transaction" onChange={this.handleInput} placeholder={10 + ''} />
        <TransactionTable n={this.state.numTrans} onInput={this.handleTable} />
        <button onClick={this.handleClick}>Calculate</button>
      </div>
    );
  }

  handleInput = (e) => {
    let { name, value } = e.target;
    value = (name === 'minSup' || name === 'minCon') ? value / 100 : value;
    this.setState({
      [name]: value
    }, () => {
      console.log(this.state[name])
    });
  }

  handleTable = (inputs) => {
    this.setState({
      itemSet: inputs
    }, () => {
      console.log(this.state.itemSet);
    })
  }

  handleClick = (e) => {
    this.calculateApiori(this.state.itemSet);
  }

  calculateApiori = (inputs) => {
    console.log(this.createItemsFromTransaction(inputs));
  }

  createItemsFromTransaction = (inputs) => {
    const itemSets = {};
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i].replace(' ', '').toUpperCase();
      for (let j = 0; j < input.length; j++) {
        const item = input.charAt(j);
        if (item >= 'A' && item <= 'Z') {
          //obj[0] is key, //obj[1] is value
          const isExist = !!Object.entries(itemSets).find((obj) => (item == obj[0]));
          if (isExist) {
            itemSets[item]++;
          } else {
            itemSets[item] = 1;
          }
        }
      }
    }

    Object.entries(itemSets).forEach((obj) => {
      const [key, value] = obj;
      itemSets[key] = value / this.state.numTrans;
    });
    return itemSets;
  }

  createFreqItemSet = (itemset) => {
    const freqItemset = {};

  }
}
