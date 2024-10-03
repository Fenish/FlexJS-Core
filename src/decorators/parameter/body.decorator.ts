import { BODY_METADATA_KEY } from '@/metadata-keys';
import { FlexRequest } from '@/types';
import { createParameterContext } from '../parameter.registerer';

export function Body(key?: string) {
	return function (
		target: any,
		propertyKey: string | symbol,
		parameterIndex: number
	) {
		createParameterContext(
			BODY_METADATA_KEY,
			target,
			propertyKey,
			parameterIndex,
			key,
			callBack
		);
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
