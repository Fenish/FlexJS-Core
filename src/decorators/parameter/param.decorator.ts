import { PARAM_METADATA_KEY } from '@/metadata-keys';
import { FlexRequest } from '@/types';
import { createParameterContext } from '../parameter.registerer';

export function Param(key?: string) {
	return function (
		target: any,
		propertyKey: string | symbol,
		parameterIndex: number
	) {
		createParameterContext(
			PARAM_METADATA_KEY,
			target,
			propertyKey,
			parameterIndex,
			key,
			callBack
		);
	};

	function callBack(req: FlexRequest) {
		const params = req.params;
		return key ? params[key] : params;
	}
}
