const unirest = require("unirest");
const chalk = require("chalk");
const dateFormat = require("dateformat");
const figlet = require("figlet");
require("dotenv").config();

const log = console.log;

const now = new Date();
now.setDate(now.getDate() + 1);
const date = dateFormat(now, "yyyymmdd");

const req = unirest(
  "GET",
  "https://livescore6.p.rapidapi.com/matches/v2/list-by-date"
);

req.query({
  Category: "soccer",
  Date: date,
});

req.headers({
  "x-rapidapi-key": process.env.API_KEY,
  "x-rapidapi-host": "livescore6.p.rapidapi.com",
  useQueryString: true,
});

const getTime = (timeStr) => {
  const date = timeStr.toString().substring(0, 8);
  const time = timeStr.toString().substring(8, 12);

  const hour = time.substring(0, 2);
  const min = time.substring(2, 4);
  const hourNum = Number(hour);
  const computedHour = hourNum + 17;
  return `${computedHour}.${min}`;
};

req.end(function (res) {
  if (res.error) throw new Error(res.error);

  const premierLeagueObject = res.body.Stages.find(
    (stage) => stage.Scd === "premier-league" && stage.Ccd === "england"
  );

  log(
    figlet.textSync("PL Games", {
      font: "colossal",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
    })
  );

  if (!premierLeagueObject) {
    log("No PL Games today.");
    log("\n");
    return;
  }

  const matches = premierLeagueObject.Events;

  log("\n");

  log("⚽️ Today's Premier League Fixures ⚽️");
  log("\n");

  matches.forEach((match) => {
    const home = match.T1[0];
    const away = match.T2[0];

    const time = getTime(match.Esd);

    const [homePrimaryColour, homeSecondaryColour] = [
      home.Shrt.StC,
      home.Shrt.Bs,
    ];
    const [awayPrimaryColour, awaySecondaryColour] = [
      away.Shrt.StC,
      away.Shrt.Bs,
    ];

    const blob = "█";

    const [homeBlob1, homeBlob2] = [
      chalk.hex(`#${homePrimaryColour}`)(blob),
      chalk.hex(`#${homeSecondaryColour}`)(blob),
    ];
    const [awayBlob1, awayBlob2] = [
      chalk.hex(`#${awayPrimaryColour}`)(blob),
      chalk.hex(`#${awaySecondaryColour}`)(blob),
    ];

    log(
      `${time}   ${homeBlob1} ${homeBlob2} ${home.Nm} vs ${away.Nm} ${awayBlob1} ${awayBlob2}`
    );

    log("\n");
  });
});
