import { AxiosError } from "axios";
import { MatchMethodsImpl, TeamMethodsImpl } from "./types";

export interface ILiveScoreMatchData {
	data: {
		error: AxiosError;
		Stages: IStage[];
	};
}

interface ITeam {
	Ps: { Fn: string; Ln: string }[];
	Fo: string[];
}

export interface ILiveScoreTeamData {
	data: {
		error: AxiosError;
		Lu: [ITeam, ITeam];
	};
}

interface ILiveScoreTeam {
	Nm: string;
	Shrt: {
		Bs: string;
	};
}

export interface ILiveScoreMatch {
	T1: [ILiveScoreTeam];
	T2: [ILiveScoreTeam];
	Eid: string;
	Esd: string;
}

interface IStage {
	Scd: string;
	Ccd: string;
	Events: ILiveScoreMatch[];
}

export default class LiveScoreMatchesApi implements MatchMethodsImpl {
	private matches: ILiveScoreMatch[] | undefined;

	constructor(data: ILiveScoreMatchData["data"]) {
		const found: IStage | undefined = data.Stages.find(
			(stage) => stage.Scd === "premier-league" && stage.Ccd === "england"
		);
		if (found) {
			this.matches = found.Events;
		}
	}

	getMatches() {
		return this.matches;
	}

	getHomeName(match: ILiveScoreMatch) {
		return match.T1[0].Nm;
	}

	getAwayName(match: ILiveScoreMatch) {
		return match.T2[0].Nm;
	}

	getHomeColor(match: ILiveScoreMatch) {
		return match.T1[0].Shrt.Bs;
	}

	getAwayColor(match: ILiveScoreMatch) {
		return match.T2[0].Shrt.Bs;
	}

	getTime(match: ILiveScoreMatch) {
		return match.Esd;
	}

	getId(match: ILiveScoreMatch) {
		return match.Eid;
	}
}

export class LiveScoreTeamsApi implements TeamMethodsImpl {
	private data: ILiveScoreTeamData["data"];
	constructor(data: ILiveScoreTeamData["data"]) {
		this.data = data;
	}

	getHomeNames() {
		return this.data.Lu[0].Ps;
	}

	getAwayNames() {
		return this.data.Lu[1].Ps;
	}

	getHomeFormation() {
		const formationArr = this.data.Lu[0].Fo;
		if (formationArr) {
			return formationArr.join("-");
		}
		return null;
	}

	getAwayFormation() {
		const formationArr = this.data.Lu[1].Fo;
		if (formationArr) {
			return formationArr.join("-");
		}
		return null;
	}
}
