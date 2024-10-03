import { QUERY_METADATA_KEY } from '@/metadata-keys';
import { FlexRequest } from '@/types';
import { createParameterContext } from '../parameter.registerer';

export function Query(key?: string) {
	return function (
		target: any,
		propertyKey: string | symbol,
		parameterIndex: number
	) {
		createParameterContext(
			QUERY_METADATA_KEY,
			target,
			propertyKey,
			parameterIndex,
			key,
			callBack
		);
	};

	function callBack(req: FlexRequest) {
		const queries = req.query;
		return key ? queries[key] : queries;
	}
}
