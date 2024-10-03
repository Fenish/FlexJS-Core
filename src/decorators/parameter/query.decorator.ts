import { QUERY_METADATA_KEY } from '@/metadata-keys';
import { FlexRequest } from '@/types';
import { createParameterContext } from '../parameter.registerer';

export function Query(key?: string) {
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
		createParameterContext(QUERY_METADATA_KEY, data, target, propertyKey);
	};

	function callBack(req: FlexRequest) {
		const queries = req.query;
		return key ? queries[key] : queries;
	}
}
