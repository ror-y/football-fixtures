import React, { useState, useEffect } from "react";
import { ILiveScoreTeamData } from "../apis/livescore";
import { TeamMethodsImpl } from "../apis/types";
import axios from "axios";
import { matchOptions } from "../request-options";
import { LiveScoreTeamsApi } from "../apis/livescore";
import { Text, Box } from "ink";

const Teams: React.VFC<{ matchId: string }> = ({ matchId }) => {
  const [homeNames, setHomeNames] = useState();
  const [awayNames, setAwayNames] = useState();

  const [homeFormation, setHomeFormation] = useState<string | null>();
  const [awayFormation, setAwayFormation] = useState<string | null>();

  const [api, setApi] = useState<TeamMethodsImpl>();

  // const getNames = (obj) => {
  // 	return obj.map((player) =>
  // 		player.Pon === "SUBSTITUTE_PLAYER" || player.Pon === "COACH"
  // 			? ""
  // 			: player.Snm
  // 	);
  // };

  useEffect(() => {
    (async () => {
      const { data }: ILiveScoreTeamData = await axios.request(
        matchOptions(matchId)
      );
      if (data.error) throw new Error(data.error.code);

      const api = new LiveScoreTeamsApi(data);
      setApi(api);

      // setHomeNames(getNames(api.getHomeNames()));
      // setAwayNames(getNames(api.getAwayNames()));

      const homeFormation = api.getHomeFormation();
      const awayFormation = api.getAwayFormation();

      setHomeFormation(homeFormation);
      setAwayFormation(awayFormation);
    })();
  }, []);

  return !homeNames || !awayNames ? null : (
    <Box flexDirection="column">
      <Box>
        {/* <TeamList formation={homeFormation} names={homeNames} />
				<TeamList formation={awayFormation} names={awayNames} /> */}
      </Box>
      <Box marginTop={2}>
        <Text>Press Backspace or ESC to go back</Text>
      </Box>
    </Box>
  );
};
export default Teams;
