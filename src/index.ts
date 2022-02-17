export type PrimitiveTypes = string|number|boolean|null|undefined;
export type TransformFn = (input: PrimitiveTypes|PrimitiveTypes[], context?: TransformContext) =>
	PrimitiveTypes|PrimitiveTypes[];

export interface TransformContext {
	[key: string]: PrimitiveTypes|TransformContext|PrimitiveTypes[]|TransformContext[];
}

/**
	* Converts a string to lowercase
*/
export const toLowerCase: TransformFn = (input): string =>
	!nullOrUndefined(input) ? String(input).toLowerCase() : '';

/**
	* Converts a string to uppercase
*/
export const toUpperCase: TransformFn = (input): string =>
	!nullOrUndefined(input) ? String(input).toUpperCase() : '';

/**
	* Converts a primitive type to a string
*/
export const toString: TransformFn = (input): string =>
	!nullOrUndefined(input) ? String(input) : '';

/**
	* Converts a primitive type to a number
*/
export const toNumber: TransformFn = (input): number =>
	!nullOrUndefined(input) ? Number(input) : Number.NaN;

/**
	* Splits a string by a separator into an array of strings
*/
export const splitString = (separator: string): TransformFn =>
	(value) => typeof value === 'string' ? value.split(separator) : [];

/**
	* Joins an array of strings into a single string with a separator
*/
export const joinStringArray = (separator: string): TransformFn =>
	(value) => Array.isArray(value) ? value.join(separator) : '';

/**
	* Returns whether a value is truthy
*/
export const truthy: TransformFn = (value): boolean => !!value;

/**
	* Returns whether a value is null or undefined
*/
export const nullOrUndefined: TransformFn = (value): boolean =>
	value === null || value === undefined;

/**
	* Applies a transform to an array of values.
	* Returns an empty array if input value is not an array
*/
export const mapTransform = (fn: Function): TransformFn =>
	(values, context?: any) =>
		Array.isArray(values) ? values.map((value) => fn(value, context)) : [];

export const Transforms = {
	toLowerCase,
	toUpperCase,
	toString,
	toNumber,
	splitString,
	joinStringArray,
	truthy,
	nullOrUndefined,
	mapTransform,
};

/**
	* Applies an array of transforms to the target value
*/
export const applyTransforms = (
	value: PrimitiveTypes|PrimitiveTypes[],
	transforms: TransformFn[],
	context?: TransformContext,
)  => transforms.reduce((v, fn) => typeof fn === 'function' ? fn(v, context) : value, value);

export default applyTransforms;
