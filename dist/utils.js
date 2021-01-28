"use strict";
const chalk = require("chalk");
const getTime = (timeStr) => {
    const time = timeStr.toString().substring(8, 12);
    const hour = time.substring(0, 2);
    const min = time.substring(2, 4);
    const hourNum = Number(hour);
    const computedHour = hourNum + 17;
    return `${computedHour}.${min}`;
};
const getShirtColours = (obj) => [obj.Shrt.Bs];
const getBlobs = (primaryColour) => {
    const blob = "█";
    return [chalk.hex(`#${primaryColour}`)(blob)];
};
module.exports = { getTime, getShirtColours, getBlobs };
