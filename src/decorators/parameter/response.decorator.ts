import { REQUEST_METADATA_KEY } from '@/metadata-keys';
import { FlexRequest, FlexResponse } from '@/types';
import { createParameterContext } from '../parameter.registerer';

export function Response() {
	return function (
		target: any,
		propertyKey: string | symbol,
		parameterIndex: number
	) {
		const data = {
			index: parameterIndex,
			callback: callBack,
		};
		createParameterContext(REQUEST_METADATA_KEY, data, target, propertyKey);
	};

	function callBack(req: FlexRequest, res: FlexResponse) {
		return res;
	}
}
