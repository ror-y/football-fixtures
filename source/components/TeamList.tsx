import React from "react";
import { Text, Box } from "ink";

const TeamList: React.VFC<{ formation: string; names: string[] }> = ({
	formation,
	names,
}) => {
	return (
		<Box flexDirection="column" marginRight={5}>
			{formation && <Text>({formation}):</Text>}
			{names.map((name, idx) => (
				<Text key={idx}>{name}</Text>
			))}
		</Box>
	);
};

export default TeamList;
