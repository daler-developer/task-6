import seedrandom from "seedrandom";
import * as randomData from "./randomData";
import useStore from "./store";
import { faker } from "@faker-js/faker";

const englandChars = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
const russianChars = [
  "а",
  "б",
  "в",
  "г",
  "д",
  "е",
  "ё",
  "ж",
  "з",
  "и",
  "й",
  "ж",
  "з",
  "и",
  "й",
  "к",
  "л",
  "м",
  "н",
  "о",
  "п",
  "р",
  "с",
  "т",
  "у",
  "ф",
  "х",
  "ц",
  "ч",
  "ш",
  "щ",
  "Ъ",
  "ы",
  "ь",
  "э",
  "ю",
  "я",
];
const uzbekChars = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
const digits = ["0", "1", "2", "3", "4", "6", "7", "8", "9"];

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getExactNumberOfErrors = (inaccurateNumErrors) => {
  let result = Math.trunc(inaccurateNumErrors);

  if (Math.random() <= inaccurateNumErrors - Math.trunc(inaccurateNumErrors)) {
    result++;
  }

  return result;
};

const getValueWithRemovedChar = (value) => {
  const position = randomIntFromInterval(0, value.length - 1);

  return value.slice(0, position) + value.slice(position + 1);
};

const getValueWithAddedChar = ({ field, value }) => {
  const { region } = useStore.getState();

  const randomPosition = randomIntFromInterval(0, value.length - 1);
  let randomLetter;

  switch (field) {
    case "id":
    case "phoneNumber":
      randomLetter = digits[randomIntFromInterval(0, digits.length - 1)];
      break;
    case "fullName":
    case "address":
      if (region === "russia") {
        randomLetter =
          russianChars[randomIntFromInterval(0, russianChars.length - 1)];
      } else if (region === "england") {
        randomLetter =
          englandChars[randomIntFromInterval(0, englandChars.length - 1)];
      } else if (region === "uzbekistan") {
        randomLetter =
          uzbekChars[randomIntFromInterval(0, uzbekChars.length - 1)];
      }
      break;
  }

  return (
    value.slice(0, randomPosition) + randomLetter + value.slice(randomPosition)
  );
};

const getValueWithSwapChars = (value) => {
  const randomPosition = randomIntFromInterval(0, value.length - 2);

  if (value.length >= 2) {
    return (
      value.slice(0, randomPosition) +
      value[randomPosition + 1] +
      value[randomPosition] +
      value.slice(randomPosition + 2)
    );
  }

  return value;
};

const makeErrorsInRecord = ({ record, numErrors }) => {
  for (let i = 0; i < numErrors; i++) {
    const field =
      Object.keys(record)[
        randomIntFromInterval(0, Object.keys(record).length - 1)
      ];
    // const field = "id";

    const errorType = ["remove", "add", "swap"][randomIntFromInterval(0, 2)];
    // const errorType = "add";

    switch (errorType) {
      case "remove":
        record[field] = getValueWithRemovedChar(record[field]);
        break;
      case "add":
        record[field] = getValueWithAddedChar({ field, value: record[field] });
        break;
      case "swap":
        record[field] = getValueWithSwapChars(record[field]);
        break;
    }
  }
};

export const getRandomData = () => {
  const { region, page, seed, inaccurateNumErrors } = useStore.getState();

  seedrandom(seed + String(page), { global: true });

  const numberOfRows = page === 1 ? 20 : 10;

  let data = [];

  for (let i = 0; i < numberOfRows; i++) {
    const record = {};

    const randomId =
      randomData.ids[region][
        randomIntFromInterval(0, randomData.ids[region].length - 1)
      ];
    const randomnName =
      randomData.names[region][
        randomIntFromInterval(0, randomData.names[region].length - 1)
      ];
    const randomSurname =
      randomData.surnames[region][
        randomIntFromInterval(0, randomData.surnames[region].length - 1)
      ];
    const randomMiddleName =
      randomData.middleNamas[region][
        randomIntFromInterval(0, randomData.middleNamas[region].length - 1)
      ];
    const randomPhoneNumber =
      randomData.phoneNumbers[region][
        randomIntFromInterval(0, randomData.phoneNumbers[region].length - 1)
      ];
    const randomAddress =
      randomData.addresses[region][
        randomIntFromInterval(0, randomData.addresses[region].length - 1)
      ];

    record.id = randomId;
    record.fullName = `${randomnName} ${randomSurname} ${randomMiddleName}`;
    record.phoneNumber = randomPhoneNumber;
    record.address = randomAddress;

    const numErrors = getExactNumberOfErrors(inaccurateNumErrors);

    makeErrorsInRecord({ record, numErrors });

    data.push(record);
  }

  return data;
};
