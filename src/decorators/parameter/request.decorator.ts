import { REQUEST_METADATA_KEY } from '@/metadata-keys';
import { FlexRequest } from '@/types';
import { createParameterContext } from '../parameter.registerer';

export function Request() {
	return function (
		target: any,
		propertyKey: string | symbol,
		parameterIndex: number
	) {
		createParameterContext(
			REQUEST_METADATA_KEY,
			target,
			propertyKey,
			parameterIndex,
			undefined,
			callBack
		);
	};

	function callBack(req: FlexRequest) {
		return req;
	}
}
