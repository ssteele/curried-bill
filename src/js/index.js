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
const stateSelectEl = document.getElementById('state-select');
const amountInputEl = document.getElementById('amount');
const tipInputEl = document.getElementById('tip');
const discountInputEl = document.getElementById('discount');
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

const addTax = (tax) => (amount) => amount * (1 + (tax / 100));
const addTip = (tip) => (amount) => (amount * (1 + (tip / 100))) - amount;
const subDiscount = (discount) => (amount) => amount - discount;
const bill = (tax, amount, tip, discount) => (tax(discount(amount)) + tip(amount)).toFixed(2);
const curriedBill = curry(bill);

const hasRequiredFields = ({tax, amount}) => {
    if (null === tax || null === amount) {
        return false;
    }

    return true;
}

const calculate = (state = {}) => {
    console.log('state:', state);
    if (!hasRequiredFields(state)) {
        return;
    }

    const amount = state?.amount;
    const tax = addTax(state?.tax);
    const tip = addTip(state?.tip);
    const discount = subDiscount(state?.discount);

    const total = curriedBill(tax)(amount)(tip)(discount);
    console.log('total:', total);
    totalOutputEl.innerText = total;
}

// handle state select
stateSelectEl.addEventListener('change', (e) => {
    const stateId = e?.target?.value;
    const { salesTax } = states.find((e) => stateId === e.id);
    setTax(salesTax);
    calculate(state);
});

// handle amount input
amountInputEl.addEventListener('change', (e) => {
    const amount = e?.target?.value;
    setAmount(amount);
    calculate(state);
});

// handle tip input
tipInputEl.addEventListener('change', (e) => {
    const tip = e?.target?.value;
    setTip(tip);
    calculate(state);
});

// handle discount input
discountInputEl.addEventListener('change', (e) => {
    const discount = e?.target?.value;
    setDiscount(discount);
    calculate(state);
});
