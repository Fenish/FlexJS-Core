import { BODY_METADATA_KEY } from '@/metadata-keys';
import { FlexRequest } from '@/types';
import { createParameterContext } from '../parameter.registerer';

export function Body(key?: string) {
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
		createParameterContext(BODY_METADATA_KEY, data, target, propertyKey);
	};

	function callBack(req: FlexRequest) {
		const body = req.body;

		if (key) {
			return body[key];
		} else {
			return body;
		}
	}
}
