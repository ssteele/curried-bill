// mutable state
export const state = {
    amount: null,
    discount: 0,
    tax: null,
    tip: 0,
};

export const setTax = (tax = 0) => {
    state.tax = 0;
    const floatedTax = parseFloat(tax);
    if (!isNaN(floatedTax) && floatedTax >= 0) {
        state.tax = floatedTax;
    }
    return state.tax;
};

export const setAmount = (amount = 0) => {
    state.amount = 0;
    const floatedAmount = parseFloat(amount);
    if (!isNaN(floatedAmount) && floatedAmount >= 0) {
        state.amount = floatedAmount;
    }
    return state.amount;
};

export const setTip = (tip = 0) => {
    state.tip = 0;
    const floatedTip = parseFloat(tip);
    if (!isNaN(floatedTip) && floatedTip >= 0) {
        state.tip = floatedTip;
    }
    return state.tip;
};

export const setDiscount = (discount = 0) => {
    state.discount = 0;
    const floatedDiscount = parseFloat(discount);
    if (!isNaN(floatedDiscount) && floatedDiscount >= 0) {
        state.discount = floatedDiscount;
    }
    return state.discount;
};
