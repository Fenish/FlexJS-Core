import { RESPONSE_METADATA_KEY } from '@/metadata-keys';
import { FlexRequest, FlexResponse } from '@/types';
import { createParameterContext } from '../parameter.registerer';

export function Response() {
	return function (
		target: any,
		propertyKey: string | symbol,
		parameterIndex: number
	) {
		createParameterContext(
			RESPONSE_METADATA_KEY,
			target,
			propertyKey,
			parameterIndex,
			undefined,
			callBack
		);
	};

	function callBack(req: FlexRequest, res: FlexResponse) {
		return res;
	}
}
