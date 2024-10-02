import { REQUEST_METADATA_KEY } from '@/metadata-keys';
import { FlexRequest } from '@/types';
import { createParameterContext } from '../parameter.registerer';

export function Request() {
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

	function callBack(req: FlexRequest) {
		return req;
	}
}
