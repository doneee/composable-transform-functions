export type PrimitiveTypes = string|number|boolean|null|undefined;
export type TransformFn = (input: PrimitiveTypes|PrimitiveTypes[], context?: TransformContext) =>
	PrimitiveTypes|PrimitiveTypes[];

export interface TransformContext {
	[key: string]: PrimitiveTypes|TransformContext|PrimitiveTypes[]|TransformContext[];
}

export const toLowerCase: TransformFn = (input): string =>
	!nullOrUndefined(input) ? String(input).toLowerCase() : '';

export const toUpperCase: TransformFn = (input): string =>
	!nullOrUndefined(input) ? String(input).toUpperCase() : '';

export const toString: TransformFn = (input): string => String(input);

export const toNumber: TransformFn = (input): number => Number(input);

export const splitString = (separator: string): TransformFn =>
	(value) => typeof value === 'string' ? value.split(separator) : [];

export const truthy: TransformFn = (value): boolean => !!value;

export const falsey: TransformFn = (value): boolean => !value;

export const nullOrUndefined: TransformFn = (value): boolean =>
	value === null || value === undefined;

export const mapTransform = (fn: Function): TransformFn =>
	(values, context?: any) =>
		Array.isArray(values) ? values.map((value) => fn(value, context)) : [];

export const applyTransforms = (
	value: PrimitiveTypes|PrimitiveTypes[],
	transforms: TransformFn[],
	context?: TransformContext,
)  => transforms.reduce((v, fn) => fn(v, context), value);
