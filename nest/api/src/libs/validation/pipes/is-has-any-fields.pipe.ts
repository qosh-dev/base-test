import {
    ArgumentMetadata,
    type PipeTransform,
    UnprocessableEntityException,
} from '@nestjs/common';

export class IsHasAnyFieldsPipe implements PipeTransform {
	transform(value: Record<string, string>, _metadata: ArgumentMetadata) {
		const filters = Object.values(value).filter((f) => typeof f !== 'undefined');
		if (!filters.length) {
			throw new UnprocessableEntityException('Fields not specified');
		}
		return value;
	}
}
