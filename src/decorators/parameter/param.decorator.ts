import { PARAM_METADATA_KEY } from '@/metadata-keys';
import { FlexRequest } from '@/types';
import { createParameterContext } from '../parameter.registerer';

export function Param(key?: string) {
	return function (
		target: any,
		propertyKey: string | symbol,
		parameterIndex: number
	) {
		const data = {
			index: parameterIndex,
			key: key,
			callback: callBack,
		};
		createParameterContext(PARAM_METADATA_KEY, data, target, propertyKey);
	};

	function callBack(req: FlexRequest) {
		const params = req.params;
		return key ? params[key] : params;
	}
}
