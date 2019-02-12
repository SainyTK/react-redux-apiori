import _ from 'lodash';
import React, { Component } from "react";

export default class TransactionTable extends Component {
    constructor(props) {
        super(props);
        const initInputs = _.range(props.n).map(() => '');
        const initWrongInputs = _.range(props.n).map(() => false);
        this.state = {
            inputs: initInputs,
            wrongInputs: initWrongInputs
        };

        if (props.onInput)
            props.onInput(initInputs);
    }

    render() {
        const { n } = this.props;
        return (
            <table>
                <thead>
                    <tr>
                        <th>Transaction id</th>
                        <th>item set</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows(n)}
                </tbody>
            </table>
        );
    }

    renderRows(n) {
        return _.range(n).map((i, k) => (
            <tr key={k}>
                <td>{(k + 1)}</td>
                <td>
                    <input name={k} type="text" onBlur={this.handleFocusOut} />
                </td>
                {this.state.wrongInputs[k] && <td>Wrong input</td>}
            </tr>
        ))
    }

    handleFocusOut = (e) => {
        const { name, value } = e.target;
        const { inputs } = this.state;
        inputs[name] = value;
        this.setState({
            inputs
        }, () => {
            if (this.props.onInput)
                this.props.onInput(this.state.inputs);
        });
    }
}
