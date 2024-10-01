import {
	BODY_METADATA_KEY,
	FUNCTION_PARAMETERS_METADATA_KEY,
} from '@/metadata-keys';
import { FlexRequest } from '@/types';
import { Logger } from '@/utils/logger';

export async function parseParameters(req: FlexRequest, route: any) {
	Logger.debug('Parsing Parameters');
	const parameters = route[FUNCTION_PARAMETERS_METADATA_KEY];

	const orderedParams: any = [];
	for (const param of parameters) {
		Logger.debug('Parsing parameter: ' + JSON.stringify(param.data));
		if (param.type === BODY_METADATA_KEY) {
			const result = parseBody(req, param.data);
			orderedParams.push(result);
		}
	}

	route.parameters = orderedParams;
}

function parseBody(req: FlexRequest, data: any) {
	const body = req.body;
	if (data.key) {
		return body[data.key];
	} else {
		return body;
	}
}
