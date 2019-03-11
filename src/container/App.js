import React, { Component } from "react";
import { connect } from 'react-redux';
import Actions from '../redux/app/actions';
import RulesTable from '../component/RulesTable';
import ItemsTable from '../component/ItemsTable';
import TransactionTable from './TransactionTable';
import Input from '../component/Input';
import { Algorithm } from '../algorithm/apriori';

const MIN_SUP = 20;
const MIN_CON = 20;
const NUM_TRANS = 5;

class App extends Component {

  render() {
    return (
      <div className='container'>
        <h1>Apiori Algorithm Calculator</h1>
        <Input name="minSup" title="Minimum support" onBlur={this.handleInput} placeholder={MIN_SUP + ''} />
        <Input name="minCon" title="Minimum confidence" onBlur={this.handleInput} placeholder={MIN_CON + ''} />
        <Input name="numTrans" title="Number of transaction" onBlur={this.handleInput} placeholder={NUM_TRANS + ''} />
        <p>กรุณากรอกข้อมูลโดยเว้นวรรคระหว่างแต่ละ item เช่น A B C</p>
        <TransactionTable />
        <button className='btn btn-primary' style={{marginBottom: '10px'}} onClick={this.handleClick}>Calculate</button>
        {this.renderFreqItems()}
        {this.renderRules()}
      </div>
    );
  }

  renderRules = () => {
    const rules = [];
    Object.values(this.props.rules).forEach(rule => {
      rule.forEach((r) => {
        rules.push(r);
      })
    });
    if (rules.length > 0) {
      return (
        <div>
          <RulesTable rules={rules}/>
        </div>
      )
    }
  }

  renderFreqItems = () => {
    const freqItems = [];
    Object.values(this.props.freqItems).forEach(freqItem => {
      freqItem.forEach((f) => {
        freqItems.push(f);
      })
    });
    if (freqItems.length > 0) {
      return (
        <div>
          <ItemsTable items={freqItems}/>
        </div>
      )
    }
  }

  handleInput = (e) => {
    let { name, value } = e.target;
    value = (name === 'minSup' || name === 'minCon') ? value / 100 : value;
    switch (name) {
      case 'minSup': this.props.setMinSup(value); break;
      case 'minCon': this.props.setMinCon(value); break;
      case 'numTrans': this.props.setNumTrans(value); break;
      default: break;
    }
  }


  handleClick = (e) => {
    const { minSup, minCon, transTable } = this.props;

    const aprioriAlgorithm = new Algorithm(minSup, minCon);
    const {associationRules, frequentItemSets} = aprioriAlgorithm.analyze(transTable);

    this.props.setFreqItems(frequentItemSets);
    this.props.setRules(associationRules);

  }

}

export default connect(state => state.App, Actions)(App);