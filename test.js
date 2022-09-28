const { faker } = require("@faker-js/faker");

faker.setLocale("ru");

console.log(
  faker.address.cityName() +
    ", " +
    faker.address.country() +
    ", " +
    faker.address.street()
);
