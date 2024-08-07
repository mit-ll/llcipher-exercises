function egcdButtonClick() {
    let a = document.getElementById('egcd_a').value;
    let b = document.getElementById('egcd_b').value;
    let res = extendedGCDHelper(BigInt(a), BigInt(b));
    document.getElementById('gcd_result').value = res[0];
    document.getElementById('gcd_inverse_a_result').value = res[1];
    document.getElementById('gcd_inverse_b_result').value = res[2];
    return false;
}

function modexpButtonClick() {
    let a = document.getElementById('modular_exponent_a').value;
    let b = document.getElementById('modular_exponent_b').value;
    let n = document.getElementById('modular_exponent_n').value;
    document.getElementById('modular_exponent_result').value = modExp(BigInt(a), BigInt(b), BigInt(n));
    return false;
}

function modinvButtonClick() {
    let a = document.getElementById('modular_inversion_a').value;
    let n = document.getElementById('modular_inversion_n').value;
    document.getElementById('modular_inversion_result').value = modinv(BigInt(a), BigInt(n));
    return false;
}

function modprodButtonClick() {
    let a = document.getElementById('modular_product_a').value;
    let b = document.getElementById('modular_product_b').value;
    let n = document.getElementById('modular_product_n').value;
    document.getElementById('modular_product_result').value = modprod(BigInt(a), BigInt(b), BigInt(n));
    return false;
}

function modsumButtonClick() {
    let a = document.getElementById('modular_sum_a').value;
    let b = document.getElementById('modular_sum_b').value;
    let n = document.getElementById('modular_sum_n').value;
    document.getElementById('modular_sum_result').value = modsum(BigInt(a), BigInt(b), BigInt(n));
    return false;
}

function textToNumberButtonClick() {
    let txt = document.getElementById('conversion_text').value;
    document.getElementById('conversion_number').value = textToNumber(txt);
    return false;
}

function numberToTextButtonClick() {
    let n = document.getElementById('conversion_number').value;
    document.getElementById('conversion_text').value = numberToText(BigInt(n));
    return false;
}

function rootButtonClick() {
    let r = document.getElementById('rth_root_r').value;
    let a = document.getElementById('rth_root_a').value;
    document.getElementById('rth_root_result').value = root(BigInt(r), BigInt(a));
    return false;
}

function prodButtonClick() {
    let a = document.getElementById('product_a').value;
    let b = document.getElementById('product_b').value;
    document.getElementById('product_result').value = BigInt(a)*BigInt(b);
    return false;
}