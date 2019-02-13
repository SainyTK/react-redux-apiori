import React, { Component } from "react";
import Input from '../component/Input';
import TransactionTable from './TransactionTable';
import _ from 'lodash';
import { connect } from 'react-redux';
import { edit } from '../actions/action';
import {
  EDIT_MIN_CON,
  EDIT_MIN_SUP,
  EDIT_NUM_TRANS,
} from '../actions/actionTypes';

const MIN_SUP = 20;
const MIN_CON = 20;
const NUM_TRANS = 5;

class App extends Component {

  items = [];
  freqItemSet = {};
  unFreqItemSet = {};

  constructor(props) {
    super(props);
    this.state = {
      resultLength: '',
      result: '',
    };
  }
  render() {
    return (
      <div>
        <h1>Apiori Algorithm Calculator</h1>
        <Input name="minSup" title="Minimum support" onBlur={this.handleInput} placeholder={MIN_SUP + ''} />
        <Input name="minCon" title="Minimum confidence" onBlur={this.handleInput} placeholder={MIN_CON + ''} />
        <Input name="numTrans" title="Number of transaction" onBlur={this.handleInput} placeholder={NUM_TRANS + ''} />
        <p>กรุณากรอกข้อมูลโดยเว้นวรรคระหว่างแต่ละ item เช่น A B C</p>
        <TransactionTable/>
        <button onClick={this.handleClick}>Calculate</button>
        {this.state.resultLength && <p>{this.state.resultLength}</p>}
        {this.state.result && <p>{this.state.result}</p>}
      </div>
    );
  }

  handleInput = (e) => {
    let { name, value } = e.target;
    value = (name === 'minSup' || name === 'minCon') ? value / 100 : value;
    switch (name) {
      case 'minSup': this.props.dispatch(edit(EDIT_MIN_SUP, value)); break;
      case 'minCon': this.props.dispatch(edit(EDIT_MIN_CON, value)); break;
      case 'numTrans': this.props.dispatch(edit(EDIT_NUM_TRANS, value)); break;
      default: break;
    }
  }


  handleClick = (e) => {
    let itemSet = [];
    this.freqItemSet = {};
    this.unFreqItemSet = {};

    this.generateItemsFromInput();
    for (let i = 1; i < this.props.numTrans; i++) {
      this.generateSets(itemSet, '', this.items, 0, i);
      const candidates = this.createCandidates(itemSet);
      this.filterFreqItemSet(candidates);
    }

    console.log(this.freqItemSet);

    this.showResult();
  }

  generateItemsFromInput = () => {
    this.items = [];
    this.props.transTable.forEach((transaction) => {
      const transactionItems = transaction.trim().split(' ');
      transactionItems.forEach((item) => {
        const notExist = !this.items.find((i) => i+'' === item+'');
        if (notExist) {
          this.items.push(item);
        }
      });
    });
    this.items.sort();
  }

  generateSets = (results, current, items, start, size) => {
    if (size === 0) {
      return results.push(current.slice(0,-1));
    }

    for (let i = start; i <= items.length; i++) {
      if (i < items.length) {
        this.generateSets(results, current + items[i] + ',', items, i + 1, size - 1);
      }
    }
  }

  createCandidates = (itemSet) => {
    const candidates = {};
    itemSet.forEach((item) => {
      //each item in itemset eg. ['AB'], ['BC']: item = ['AB']
      if (!this.isUnFreq(item)) {
        candidates[item] = 0;
        this.props.transTable.forEach((transaction) => {
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
      candidates[key] = value / this.props.numTrans;
    });
    return candidates;
  }

  filterFreqItemSet = (candidates) => {
    Object.entries(candidates).forEach((obj) => {
      const [key, value] = obj;
      if (value >= this.props.minSup) {
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
      const len = key.split(',').length;
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

const mapStateToProps = state => ({
  numTrans: state.numTrans,
  minSup: state.minSup,
  minCon: state.minCon,
  transTable: state.transTable
})

export default connect(mapStateToProps)(App);