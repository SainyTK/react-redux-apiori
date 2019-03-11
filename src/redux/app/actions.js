import helpers from '../../helpers/appHelper';

const actions = {
    SET_MIN_CON: 'SET_MIN_CON',
    SET_MIN_SUP: 'SET_MIN_SUP',
    SET_NUM_TRANS: 'SET_NUM_TRANS',
    SET_TRANS_TABLE: 'SET_TRANS_TABLE',
    SET_RULES: 'SET_RULES',
    SET_FREQ_ITEMS: 'SET_FREQ_ITEMS',
    setMinCon: (minCon) => (dispatch) => {
        dispatch({ type: actions.SET_MIN_CON, payload: minCon });
    },
    setMinSup: (minSup) => (dispatch) => {
        dispatch({ type: actions.SET_MIN_SUP, payload: minSup });
    },
    setNumTrans: (numTrans) => (dispatch) => {
        dispatch({ type: actions.SET_NUM_TRANS, payload: numTrans });
    },
    setTransTable: (transTable) => (dispatch) => {
        const transTableArr = helpers.toArrayTable(transTable);
        dispatch({ type: actions.SET_TRANS_TABLE, payload: { transTable: transTableArr } });
    },
    setFreqItems: (freqItems) => (dispatch) => {
        dispatch({ type: actions.SET_FREQ_ITEMS, payload: { freqItems } })
    },
    setRules: (rules) => (dispatch) => {
        dispatch({ type: actions.SET_RULES, payload: { rules } })
    }
};

export default actions;