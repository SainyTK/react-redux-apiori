import React from 'react';
import styled from 'styled-components'

const WrappedTable = styled.div`
    margin: 0px 10px;
    width: 80%;
    text-size: 11px;
`

const RulesTable = props => {
    const { rules } = props;
    return (
        <WrappedTable>
            <h5>Strong Association Rules</h5>
            <p>There are {rules.length} rules</p>
            <table className='table'>
                <thead>
                    <tr>
                        <th scope='row'>#</th>
                        <th scope='row'>rules</th>
                        <th scope='row'>confidents</th>
                    </tr>
                </thead>
                <tbody>
                    {rules.map((rule, idx) => (
                        <tr key={idx}>
                            <th scope='col'>{idx + 1}</th>
                            <td>{`${rule.lhs} -> ${rule.rhs}`}</td>
                            <td>{rule.confidence * 100}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </WrappedTable>
    )
}

export default RulesTable;