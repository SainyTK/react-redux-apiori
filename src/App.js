import React, { Component } from "react";
import Input from './component/Input';
import TransactionTable from './component/TransactionTable';
import _ from 'lodash';

export default class App extends Component {

  items = [];
  transactionTable = [];
  freqItemSet = {};
  unFreqItemSet = {};

  constructor(props) {
    super(props);
    this.state = {
      numTrans: 5,
      minSup: 0,
      minCon: 0,
      resultLength: '',
      result: '',
    };
  }
  render() {
    return (
      <div>
        <h1>Apiori App</h1>
        <Input name="minSup" title="Minimum support" onChange={this.handleInput} placeholder={0 + ''} />
        <Input name="minCon" title="Minimum confidence" onChange={this.handleInput} placeholder={0 + ''} />
        <Input name="numTrans" title="Number of transaction" onChange={this.handleInput} placeholder={10 + ''} />
        <p>กรุณากรอกข้อมูลโดยเว้นวรรคระหว่างแต่ละ item เช่น A B C</p>
        <TransactionTable n={this.state.numTrans} onInput={this.handleTable} />
        <button onClick={this.handleClick}>Calculate</button>
        {this.state.resultLength && <p>{this.state.resultLength}</p>}
        {this.state.result && <p>{this.state.result}</p>}
      </div>
    );
  }

  handleInput = (e) => {
    let { name, value } = e.target;
    value = (name === 'minSup' || name === 'minCon') ? value / 100 : value;
    this.setState({
      [name]: value
    });
  }

  handleTable = (inputs) => {
    this.transactionTable = inputs;
  }

  handleClick = (e) => {
    let itemSet = [];
    this.freqItemSet = {};
    this.unFreqItemSet = {};

    this.generateItemsFromInput();
    for (let i = 1; i < this.state.numTrans; i++) {
      this.generateSets(itemSet, '', this.items, 0, i);
      const candidates = this.createCandidates(itemSet);
      this.filterFreqItemSet(candidates);
    }

    this.showResult();
  }

  generateItemsFromInput = () => {
    this.items = [];
    this.transactionTable.forEach((transaction) => {
      const transactionItems = transaction.trim().split(' ');
      transactionItems.forEach((item) => {
        const notExist = !this.items.find((i) => i === item);
        if (notExist) {
          this.items.push(item);
        }
      });
    });
    this.items.sort();
  }

  generateSets = (results, current, items, start, size) => {
    if (size === 0) {
      return results.push(current);
    }

    for (let i = start; i <= items.length; i++) {
      if (i < items.length) {
        this.generateSets(results, current + items[i], items, i + 1, size - 1);
      }
    }
  }

  createCandidates = (itemSet) => {
    const candidates = {};
    itemSet.forEach((item) => {
      //each item in itemset eg. ['AB'], ['BC']: item = ['AB']
      if (!this.isUnFreq(item)) {
        candidates[item] = 0;
        this.transactionTable.forEach((transaction) => {
          //each item in transactionTable eg. transaction = 'A B C D' => ['A','B','C','D']
          const tItems = transaction.trim().split(' ');
          let count = 0;
          tItems.forEach((tItem) => {
            //tItem item in a transaction eg.: tItem = 'A', 'B', 'C'
            for (let i = 0; i < item.length; i++) {
              if (tItem === item.charAt(i)) {
                count++;
                if (count === item.length) {
                  candidates[item]++;
                  break;
                }
              }
            }
          });
        });
      }
    });
    Object.entries(candidates).forEach((obj) => {
      const [key, value] = obj;
      candidates[key] = value / this.state.numTrans;
    });
    return candidates;
  }

  filterFreqItemSet = (candidates) => {
    Object.entries(candidates).forEach((obj) => {
      const [key, value] = obj;
      if (value >= this.state.minSup) {
        this.freqItemSet[key] = value;
      } else {
        this.unFreqItemSet[key] = value;
      }
    });
  }

  isUnFreq = (item) => !!Object.entries(this.unFreqItemSet).find((unFreqItem) => unFreqItem === item)

  showResult = () => {
    const results = _.range(this.items.length).map(() => []);
    Object.entries(this.freqItemSet).forEach(obj => {
      const [key] = obj;
      const len = key.length;
      results[len].push(key);
    });

    let resultLengthText = `มี Frequence itemset ทั้งหมด ${Object.keys(this.freqItemSet).length} เซ็ต ได้แก่`
    let resultText = '';

    results.forEach((result) => {
      result.forEach((resItem) => {
        resultText += `{${resItem}} `;
      });
    });

    this.setState({
      resultLength: resultLengthText,
      result: resultText
    });

  }
}
