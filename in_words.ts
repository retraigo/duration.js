const digits = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];
const teens = [
  "",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const tens = [
  "",
  "ten",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];
const tenPowers = {
  int: [
    "{ones}",
    "{tens}",
    "{ones} hundred and",
    "{ones} thousand,",
    "{tens}",
    "{ones} hundred and",
    "{ones} million,",
    "{tens}",
    "{ones} hundred and",
    "{ones} billion,",
    "{tens}",
    "{ones} hundred and",
    "{ones} trillion,",
    "{tens}",
    "{ones} hundred and",
    "{ones} thousand,",
    "{tens}",
  ],
  in: [
    "{ones}",
    "{tens}",
    "{ones} hundred and",
    "{ones} thousand,",
    "{tens}",
    "{ones} lakh,",
    "{tens}",
    "{ones} crore,",
    "{tens}",
    "{ones} hundred and",
    "{ones} thousand,",
    "{tens}",
    "{ones} lakh,",
    "{tens}",
    "{ones} crore,",
    "{tens}",
  ],
};

/**
 * Get the right template for the digit.
 * @param {number} i - Number's place to parse.
 * @param {boolean} indian - Whether to use Indian system. 
 * @returns 
 */
function getTenPower(i: number, indian = false) {
  const arr = indian ? tenPowers.in : tenPowers.int;
  i = i % arr.length;
  return arr[i];
}

/**
 * Parse a number into an english word string.
 * @param {number} n - The number to parse.
 * @param {boolean} indian  - Whether to use Indian system. 
 * @returns {string} The number in words.
 */
export default function (n: number, indian = false): string {
  if (n === 0) return "zero";
  const digitNumbers: number[] = n.toString().split("").map((x) => Number(x))
    .reverse();
  const digitStrings: string[] = [];
  for (let i = 0; i < digitNumbers.length; ++i) {
    if (getTenPower(i + 1, indian)?.startsWith("{tens}")) {
      if (digitNumbers[i + 1] === 1) {
        digitStrings.push(
          `${teens[digitNumbers[i]]} ${
            getTenPower(i, indian).replace(/\{ones\}\s?/, "")
          }`,
        );
        ++i;
        continue;
      }
    }
    digitStrings.push(
      getTenPower(i, indian).replace(
        "{ones}",
        digits[digitNumbers[i]],
      ).replace("{tens}", tens[digitNumbers[i]]),
    );
    console.log((i - digitNumbers.length ))
  }
  return digitStrings.reverse().join(" ");
};
