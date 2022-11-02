const originalString = "ab=tl*cd=ls*ef=dd";
const rulesMap = {
    "t": 1,
    "l": "s",
    "s": 3,
    "d": 4,
    "k": 9,
    "*": "\n",
}
const tokensMap = {
    "ab": "val1",
    "cd": "val2",
    "ef": "val3",
    "-d": "k",
}

lint(originalString, tokensMap, rulesMap);

/*
let val1=13
let val2=33
let val3=99
 */

function lint(string, tokens, rules) {
    function getCode(val, rules, tokens) {
        if (!rules[val] && !tokens[val]) return val;

        return getCode(tokens[val] || rules[val], rules, tokens);
    }

    function compareArrays(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }

    let result = '';
    const keyTokens = Object.keys(tokens);
    const newTokens = keyTokens
        .reduce((acc, curr) =>
            ({...acc, [curr.replaceAll('-', '')]: tokens[curr]}), {}
        );

    let buffer = [];
    const hash = {};

    const array = string.split('');

    for (let i = 0; i < array.length; i++) {
        const currentSymbol = array[i];
        buffer.push(currentSymbol);
        const substringToken = keyTokens
            .find(
                t => compareArrays(t.split('').slice(0, buffer.length), buffer)
        );

        if (substringToken && buffer.length === substringToken.length) {
            result += hash[substringToken] ? (newTokens[substringToken]) : ('let ' + newTokens[substringToken]);
            hash[substringToken] = true;
            buffer = [];
        }

        if (!substringToken || i === array.length - 1) {
            result += rules[currentSymbol]
                ? buffer.map(b => getCode(b, rules, newTokens)).join('')
                : (currentSymbol);
            buffer = [];
        }

    }
    return result;
}