const { faker } = require("@faker-js/faker");

module.exports = class ErrInserter {
  constructor(seed) {
    this.seed = seed;
    this.faker = faker;
    this.faker.seed(seed);
  }

  getRandomIndex(str) {
    return this.faker.number.int(100) % str.length;
  }
  deleteChar(str) {
    const randIndex = this.getRandomIndex(str);
    let arr = str.split("");
    arr.splice(randIndex, 1);
    return arr.join("");
  }
  addChar(str) {
    const randIndex = this.getRandomIndex(str);
    let arr = str.split("");
    arr.splice(randIndex, 0, this.faker.helpers.fromRegExp(/[A-z]{1}/));
    return arr.join("");
  }
  switchChars(str) {
    let randIndex = this.getRandomIndex(str);
    randIndex = randIndex === str.length - 1 ? --randIndex : randIndex;
    const char = str[randIndex];
    let arr = str.split("");
    arr.splice(randIndex, 1, str[randIndex + 1]);
    arr.splice(randIndex + 1, 1, char);
    return arr.join("");
  }
  errors = [this.deleteChar, this.addChar, this.switchChars];

  addOneError(str) {
    let randomIndex = this.faker.number.int(2);
    return this.errors[randomIndex].call(this, str);
  }

  applyErrors(row, errNum) {
    let newRow = row.slice();
    let count = Math.floor(errNum);
    let end = errNum % 1;
    if (end > this.faker.number.float()) count++;
    for (let i = 1; i <= count; i++) {
      let randIndex = this.faker.number.int(2);
      newRow[randIndex] = this.addOneError(newRow[randIndex]);
    }
    return newRow;
  }
};
