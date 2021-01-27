const axios = require("axios").default;
const requestOptions = require("./request-options");
const utils = require("./utils");

const { fixuresOptions, matchOptions } = requestOptions;
const { getTime, getShirtColours, getBlobs, title } = utils;

const log = console.log;

(async () => {
  const { data: fixturesData, error: fixturesError } = await axios.request(
    fixuresOptions
  );

  if (fixturesError) throw new Error(fixturesError);

  const premierLeagueObject = fixturesData.Stages.find(
    (stage) => stage.Scd === "premier-league" && stage.Ccd === "england"
  );

  log(title);

  if (!premierLeagueObject) {
    log("No PL Games today.");
    log("\n");
    return;
  }

  const matches = premierLeagueObject.Events;

  log("\n");

  log("⚽️ Today's Premier League Fixures ⚽️");
  log("\n");

  const matchId = matches[0].Eid;
  const { data: matchData, error: matchError } = await axios.request(
    matchOptions(matchId)
  );

  log(" FN ", matchData.Lu[0].Ps[0].Fn);
  if (matchError) throw new Error(matchError);

  matches.forEach((match) => {
    const home = match.T1[0];
    const away = match.T2[0];

    const time = getTime(match.Esd);

    const [homePrimaryColour, homeSecondaryColour] = getShirtColours(home);
    const [awayPrimaryColour, awaySecondaryColour] = getShirtColours(away);

    const [homeBlob1, homeBlob2] = getBlobs(
      homePrimaryColour,
      homeSecondaryColour
    );
    const [awayBlob1, awayBlob2] = getBlobs(
      awayPrimaryColour,
      awaySecondaryColour
    );

    log(
      `${time}   ${homeBlob1} ${homeBlob2} ${home.Nm} vs ${away.Nm} ${awayBlob1} ${awayBlob2}`
    );

    log("\n");
  });
})();
