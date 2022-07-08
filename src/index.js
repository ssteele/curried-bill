import {
    states,
} from './constants/index.js';
import {
    defaultStateId,
    setAmount,
    setDiscount,
    setTax,
    setTip,
    state,
} from './state.js';
import './style.css'

// handle input fields
const onChange = (id) => (handler) => document.getElementById(id).addEventListener(('change'), handler);
const onChangeAmountInput = onChange('input-amount');
const onChangeStateSelect = onChange('select-state');
const onChangeTipInput = onChange('input-tip');
const onChangeDiscountInput = onChange('input-discount');

// update dom element: html
const updateElHtml = (id) => (content) => document.getElementById(id).innerHTML = content;
const updateStateSelect = updateElHtml('select-state');

// update dom element: text
const updateElText = (id) => (content) => document.getElementById(id).innerText = content;
const updateItemizedAmount = updateElText('itemized-amount');
const updateItemizedTax = updateElText('itemized-tax');
const updateItemizedTip = updateElText('itemized-tip');
const updateItemizedDiscount = updateElText('itemized-discount');
const updateTotal = updateElText('total');

const curry = (f) => {
    return function curried(...args) {
        if (args.length >= f.length) {
            return f.apply(this, args);
        } else {
            return function (...args2) {
                return curried.apply(this, args.concat(args2));
            }
        }
    };
}

const mulTax = (tax) => (amount) => amount * (1 + (tax / 100));
const addTip = (tip) => (amount) => (amount * (1 + (tip / 100))) - amount;
const subDiscount = (discount) => (amount) => amount - discount;
const bill = (amount, tax, tip, discount) => tax(discount(amount)) + tip(amount);
const curriedBill = curry(bill);

const hasRequiredFields = ({amount}) => {
    if (null === amount) {
        return false;
    }
    return true;
}

const calculate = (state = {}) => {
    const { amount, tax, tip, discount } = state;
    const calcTax = mulTax(tax);
    const calcTip = addTip(tip);
    const calcDiscount = subDiscount(discount);

    let total = 0;
    if (hasRequiredFields(state)) {
        total = curriedBill(amount)(calcTax)(calcTip)(calcDiscount);
    }

    return {
        amount,
        tax: calcTax(calcDiscount(amount)) - calcDiscount(amount),
        tip: calcTip(amount),
        discount,
        total,
    };
}

// state select
const renderStateSelect = (states) => {
    const stateOptions = states.map((i) => {
        let selected = '';
        if (defaultStateId === i.id) {
            selected = 'selected';
        }
        return `<option ${selected} value="${i.id}">${i.name} (${i.salesTax})</option>`;
    });
    updateStateSelect(`
        <option value="">-- State tax --</option>
        ${stateOptions}
    `);
};

// handle amount input
onChangeAmountInput((e) => {
    setAmount(e?.target?.value);

    const { amount, tax, tip, total } = calculate(state);
    updateItemizedAmount(`$${amount.toFixed(2)}`);
    updateItemizedTax(`$${tax.toFixed(2)}`);
    updateItemizedTip(`$${tip.toFixed(2)}`);
    updateTotal(`$${total.toFixed(2)}`);
});

// handle state select
onChangeStateSelect((e) => {
    const stateId = e?.target?.value;
    const { salesTax } = states.find((e) => stateId === e.id);
    setTax(salesTax);

    const { tax, total } = calculate(state);
    updateItemizedTax(`$${tax.toFixed(2)}`);
    updateTotal(`$${total.toFixed(2)}`);
});

// handle tip input
onChangeTipInput((e) => {
    setTip(e?.target?.value);

    const { tip, total } = calculate(state);
    updateItemizedTip(`$${tip.toFixed(2)}`);
    updateTotal(`$${total.toFixed(2)}`);
});

// handle discount input
onChangeDiscountInput((e) => {
    setDiscount(e?.target?.value);

    const { tax, discount, total } = calculate(state);
    updateItemizedTax(`$${tax.toFixed(2)}`);
    updateItemizedDiscount(`- $${discount.toFixed(2)}`);
    updateTotal(`$${total.toFixed(2)}`);
});

// initialize
renderStateSelect(states);
