const { fakerEN_US, fakerIT, fakerES } = require("@faker-js/faker");
const ErrInserter = require("./ErrInserter");

class DataGenerator {
  generate(params) {
    let errInserter = new ErrInserter(Number(params.seed));
    let fakers = {
      US: fakerEN_US,
      IT: fakerIT,
      ESP: fakerES,
    };
    let phone_codes = {
      US: "+1 ",
      IT: "",
      ESP: "+34 ",
    };
    let phone_code = phone_codes[params.region];
    let faker = fakers[params.region];

    if (!faker) {
      throw new Error("Wrong region inserted!");
    }
    faker.seed(Number(params.seed) + Number(params.page));

    const { mongodbObjectId: fakerId } = faker.database;
    const { fullName: fakerFullName } = faker.person;
    const { state, city, street, buildingNumber, secondaryAddress } =
      faker.location;
    const { number } = faker.phone;

    let data = [];
    for (let i = 0; i < params.quantity; i++) {
      let addressFormats = [
        `${state()}, ${city()}, ${street()}, ${buildingNumber()}`,
        `${city()}, ${street()}, ${buildingNumber()}, ${secondaryAddress()}`,
      ];

      const id = fakerId();
      const fullName = fakerFullName();
      const address = addressFormats[faker.number.int(1)];
      const phone = phone_code + number();

      const [newName, newAdress, newPhone] = errInserter.applyErrors(
        [fullName, address, phone],
        params.errorNum
      );

      const userData = {
        id,
        fullName: newName,
        address: newAdress,
        phone: newPhone,
      };
      data.push(userData);
    }
    return data;
  }
}

module.exports = new DataGenerator();
