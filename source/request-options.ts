import { AxiosRequestConfig } from "axios";

import dateFormat from "dateformat";

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

export const fixuresOptions: AxiosRequestConfig = {
	method: "GET",
	url: `${process.env.LIVESCORE_URL}/matches/v2/list-by-date`,
	params: {
		...sharedParams,
		Date: date,
	},
	headers: {
		...sharedHeaders,
		useQueryString: true,
	},
};

export const matchOptions = (matchId: string): AxiosRequestConfig => ({
	method: "GET",
	url: `${process.env.LIVESCORE_URL}/matches/v2/detail`,
	params: { ...sharedParams, Eid: matchId, LiveTable: "false" },
	headers: {
		...sharedHeaders,
	},
});
