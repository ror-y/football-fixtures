import React from "react";
import { MatchMethodsImpl } from "../apis/types";
import { ILiveScoreMatch } from "../apis/livescore";
import SelectInput from "ink-select-input";
import { getTime, getBlobs } from "../utils";

const Form: React.VFC<{
	api: MatchMethodsImpl;
	matches: ILiveScoreMatch[];
	handleSelect: (select: { label: string; value: string }) => void;
}> = ({ api, matches, handleSelect }) => {
	return (
		<SelectInput
			items={matches.map((match) => {
				const time = getTime(api.getTime(match));

				const homeColour = api.getHomeColor(match);
				const awayColour = api.getAwayColor(match);

				const [homeBlob] = getBlobs(homeColour);
				const [awayBlob] = getBlobs(awayColour);

				return {
					label: `${time} ${homeBlob}${" "}${api.getHomeName(
						match
					)} vs ${api.getAwayName(match)} ${awayBlob}`,
					value: api.getId(match),
				};
			})}
			onSelect={handleSelect}
		/>
	);
};

export default Form;
