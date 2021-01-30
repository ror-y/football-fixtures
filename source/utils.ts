const chalk = require("chalk");

export const getTime = (time: string) => {
	const timeStr = time.toString().substring(8, 12);
	const hour = timeStr.substring(0, 2);
	const min = timeStr.substring(2, 4);
	const hourNum = Number(hour);
	const computedHour = hourNum + 17;
	return `${computedHour}.${min}`;
};

export const getBlobs = (primaryColour: string) => {
	const blob = "█";
	return [chalk.hex(`#${primaryColour}`)(blob)];
};
