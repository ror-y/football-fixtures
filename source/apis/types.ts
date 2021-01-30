import { ILiveScoreMatch } from "./livescore";

export interface MatchMethodsImpl {
	getMatches(): ILiveScoreMatch[] | undefined;

	getHomeName(match: ILiveScoreMatch): string;

	getAwayName(match: ILiveScoreMatch): string;

	getHomeColor(match: ILiveScoreMatch): string;

	getAwayColor(match: ILiveScoreMatch): string;

	getTime(match: ILiveScoreMatch): string;

	getId(match: ILiveScoreMatch): string;
}

export interface TeamMethodsImpl {
	getHomeNames(): any[];

	getAwayNames(): any[];

	getHomeFormation(): string | null;

	getAwayFormation(): string | null;
}
