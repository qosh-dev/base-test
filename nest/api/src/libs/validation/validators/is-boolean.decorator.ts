import { applyDecorators, UnprocessableEntityException } from '@nestjs/common';
import { Transform } from 'class-transformer';

export const IsBoolean = () =>
	applyDecorators(
		Transform((t) => {
			if (t.value === 'true' || t.value === true) {
				return true;
			}
			if (t.value === 'false' || t.value === false) {
				return false;
			}
			throw new UnprocessableEntityException(`${t.key} must be boolean`);
		}),
	);
