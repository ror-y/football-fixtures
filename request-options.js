const dateFormat = require("dateformat");

const now = new Date();
now.setDate(now.getDate() + 1);
const date = dateFormat(now, "yyyymmdd");

require("dotenv").config();

const sharedParams = {
  Category: "soccer",
};

const sharedHeaders = {
  "x-rapidapi-key": process.env.API_KEY,
  "x-rapidapi-host": "livescore6.p.rapidapi.com",
};

const fixuresOptions = {
  method: "GET",
  url: "https://livescore6.p.rapidapi.com/matches/v2/list-by-date",
  params: {
    ...sharedParams,
    Date: date,
  },
  headers: {
    ...sharedHeaders,
    useQueryString: true,
  },
};

const matchOptions = (matchId) => ({
  method: "GET",
  url: "https://livescore6.p.rapidapi.com/matches/v2/detail",
  params: { ...sharedParams, Eid: matchId, LiveTable: "false" },
  headers: {
    ...sharedHeaders,
  },
});

module.exports = { fixuresOptions, matchOptions };
