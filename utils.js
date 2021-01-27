const chalk = require("chalk");
const figlet = require("figlet");

const getTime = (timeStr) => {
  const time = timeStr.toString().substring(8, 12);
  const hour = time.substring(0, 2);
  const min = time.substring(2, 4);
  const hourNum = Number(hour);
  const computedHour = hourNum + 17;
  return `${computedHour}.${min}`;
};

const getShirtColours = (obj) => [obj.Shrt.StC, obj.Shrt.Bs];

const getBlobs = (primaryColour, secondaryColour) => {
  const blob = "█";
  return [
    chalk.hex(`#${primaryColour}`)(blob),
    chalk.hex(`#${secondaryColour}`)(blob),
  ];
};

const title = figlet.textSync("PL Games", {
  font: "colossal",
  horizontalLayout: "default",
  verticalLayout: "default",
  width: 80,
});
module.exports = { getTime, getShirtColours, getBlobs, title };
