import {
    states,
} from './constants/index.js';
import {
    setAmount,
    setDiscount,
    setTax,
    setTip,
    state,
} from './state.js';

// dom elements registry
const amountInputEl = document.getElementById('amount');
const stateSelectEl = document.getElementById('state');
const tipInputEl = document.getElementById('tip');
const discountInputEl = document.getElementById('discount');
const itemizedAmountEl = document.getElementById('itemized-amount');
const itemizedTaxEl = document.getElementById('itemized-tax');
const itemizedTipEl = document.getElementById('itemized-tip');
const itemizedDiscountEl = document.getElementById('itemized-discount');
const totalOutputEl = document.getElementById('total');

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
        return `<option value="${i.id}">${i.name} (${i.salesTax})</option>`;
    });
    stateSelectEl.innerHTML = `
        <option value="">-- State tax --</option>
        ${stateOptions}
    `;
};

// handle amount input
amountInputEl.addEventListener('change', (e) => {
    setAmount(e?.target?.value);

    const { amount, total } = calculate(state);
    itemizedAmountEl.innerText = `$${amount.toFixed(2)}`;
    totalOutputEl.innerText =  `$${total.toFixed(2)}`;
});

// handle state select
stateSelectEl.addEventListener('change', (e) => {
    const stateId = e?.target?.value;
    const { salesTax } = states.find((e) => stateId === e.id);
    setTax(salesTax);

    const { tax, total } = calculate(state);
    itemizedTaxEl.innerText = `$${tax.toFixed(2)}`;
    totalOutputEl.innerText =  `$${total.toFixed(2)}`;
});

// handle tip input
tipInputEl.addEventListener('change', (e) => {
    setTip(e?.target?.value);

    const { tip, total } = calculate(state);
    itemizedTipEl.innerText = `$${tip.toFixed(2)}`;
    totalOutputEl.innerText =  `$${total.toFixed(2)}`;
});

// handle discount input
discountInputEl.addEventListener('change', (e) => {
    setDiscount(e?.target?.value);

    const { tax, discount, total } = calculate(state);
    itemizedTaxEl.innerText = `$${tax.toFixed(2)}`;
    itemizedDiscountEl.innerText = `- $${discount.toFixed(2)}`;
    totalOutputEl.innerText =  `$${total.toFixed(2)}`;
});

// initialize
renderStateSelect(states);
