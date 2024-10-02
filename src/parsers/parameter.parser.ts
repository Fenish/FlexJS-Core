import { FUNCTION_PARAMETERS_METADATA_KEY } from '../metadata-keys';
import { FlexRequest, FlexResponse } from '../types';
import { Logger } from '../utils/logger';

export async function parseParameters(
	req: FlexRequest,
	res: FlexResponse,
	route: any
) {
	Logger.debug('Parsing Parameters');
	const parameters = route[FUNCTION_PARAMETERS_METADATA_KEY];

	// sort based on param.data.index
	parameters.sort((a: any, b: any) => {
		return a.data.index - b.data.index;
	});

	const orderedParams: any = [];
	for (const param of parameters) {
		Logger.debug('Parsing parameter: ' + JSON.stringify(param.data));
		if (param.data.callback) {
			const data = param.data.callback(req, res);
			orderedParams.push(data);
		}
	}

	route.parameters = orderedParams;
}
