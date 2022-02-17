import { expect } from 'chai';

import applyTransforms, { Transforms as t, TransformFn } from '../src/index';

describe('transform functions', () => {
	describe('toLowerCase', () => {
		it('transforms string', () => {
			expect(applyTransforms('TeST', [t.toLowerCase])).to.equal('test');
		});

		it('converts numbers', () => {
			expect(applyTransforms(3, [t.toLowerCase])).to.equal('3');
		});

		it('empty string on null or undefined', () => {
			expect(applyTransforms(null, [t.toLowerCase])).to.equal('');
			expect(applyTransforms(undefined, [t.toLowerCase])).to.equal('');
		});
	});
	
	describe('toUpperCase', () => {
		it('transforms string', () => {
			expect(applyTransforms('TeST', [t.toUpperCase])).to.equal('TEST');
		});

		it('converts numbers', () => {
			expect(applyTransforms(3, [t.toUpperCase])).to.equal('3');
		});

		it('returns an empty string with null or undefined', () => {
			expect(applyTransforms(null, [t.toUpperCase])).to.equal('');
			expect(applyTransforms(undefined, [t.toUpperCase])).to.equal('');
		});
	});

	describe('toString', () => {
		it('transforms numbers', () => {
			expect(applyTransforms(1234, [t.toString])).to.equal('1234');
			expect(applyTransforms(1234.5, [t.toString])).to.equal('1234.5');
		});

		it('empty string on null or undefined', () => {
			expect(applyTransforms(null, [t.toString])).to.equal('');
			expect(applyTransforms(undefined, [t.toString])).to.equal('');
		});
	});

	describe('toNumber', () => {
		it('transforms number like strings', () => {
			expect(applyTransforms('1234', [t.toNumber])).to.equal(1234);
			expect(applyTransforms('1234.5', [t.toNumber])).to.equal(1234.5);
		});

		it('NaN on invalid strings', () => {
			expect(applyTransforms('test', [t.toNumber])).is.NaN;
		});

		it('NaN on null or undefined', () => {
			expect(applyTransforms(null, [t.toNumber])).is.NaN;
			expect(applyTransforms(undefined, [t.toNumber])).is.NaN;
		});
	});

	describe('splitString', () => {
		it('splits strings', () => {
			expect(applyTransforms('1,2,3,4', [t.splitString(',')])).to.deep.equal(['1', '2', '3', '4']);
		});

		it('empty array on numbers', () => {
			expect(applyTransforms(3141516, [t.splitString('1')])).to.deep.equal([]);
		});

		it('empty array on null or undefined', () => {
			expect(applyTransforms(null, [t.splitString('?')])).to.deep.equal([]);;
			expect(applyTransforms(undefined, [t.splitString('?')])).to.deep.equal([]);;
		});
	});

	describe('truthy', () => {
		it('non empty strings true', () => {
			expect(applyTransforms('asdf', [t.truthy])).to.true;
		});

		it('empty strings false', () => {
			expect(applyTransforms('', [t.truthy])).to.false;
		});

		it('non zero number true', () => {
			expect(applyTransforms(5, [t.truthy])).to.true;
			expect(applyTransforms(-15, [t.truthy])).to.true;
		});

		it('zero number false', () => {
			expect(applyTransforms(0, [t.truthy])).to.false;
		});

		it('null or undefined false', () => {
			expect(applyTransforms(null, [t.truthy])).to.false;
			expect(applyTransforms(undefined, [t.truthy])).to.false;
		});
	});

	describe('nullOrUndefined', () => {
		it('null or undefined true', () => {
			expect(applyTransforms(null, [t.nullOrUndefined])).to.true;
			expect(applyTransforms(undefined, [t.nullOrUndefined])).to.true;
		});

		it('not null or undefined false', () => {
			expect(applyTransforms('', [t.nullOrUndefined])).to.false;
			expect(applyTransforms('test', [t.nullOrUndefined])).to.false;
			expect(applyTransforms(20, [t.nullOrUndefined])).to.false;
			expect(applyTransforms(0, [t.nullOrUndefined])).to.false;
			expect(applyTransforms(true, [t.nullOrUndefined])).to.false;
			expect(applyTransforms(false, [t.nullOrUndefined])).to.false;
			expect(applyTransforms([], [t.nullOrUndefined])).to.false;
		});
	});

	describe('mapTransform', () => {
		it('transforms items', () => {
			expect(applyTransforms(['a', 'b', 'c'], [t.mapTransform(t.toUpperCase)]))
				.to.deep.equal(['A', 'B', 'C']);
		});

		it('empty array when no array is passed', () => {
			expect(applyTransforms('asdf', [t.mapTransform(t.toUpperCase)]))
				.to.deep.equal([]);
		});
	});

	describe('joinStringArray', () => {
		it('transforms items', () => {
			expect(applyTransforms(['a', 'b', 'c'], [t.joinStringArray(',')])).to.equal('a,b,c');
		});

		it('empty string when no array is passed', () => {
			expect(applyTransforms('asdf', [t.joinStringArray(',')])).to.equal('');
		});
	});
});

describe('applyTransforms', () => {
	it('multiple transforms', () => {
		expect(applyTransforms('asdf', [t.toUpperCase, t.splitString('')]))
			.to.deep.equal(['A', 'S', 'D', 'F']);
	});

	it('no transforms passed', () => {
		expect(applyTransforms('asdf', [])).to.equal('asdf');
	});

	it('non functions passed', () => {
		// @ts-ignore
		expect(applyTransforms('asdf', ['string'])).to.equal('asdf');
	});

	it('custom transforms', () => {
		const myCustomTransform: TransformFn = (value) => typeof value === 'string' ? value.length : 0;
			expect(applyTransforms('asdf', [myCustomTransform]))
				.to.equal(4);
	});

	it('context', () => {
		const myCustomTransform: TransformFn = (value, context) => `${context?.prefix}${value}`;
			expect(applyTransforms('asdf', [myCustomTransform], {prefix: 'some '}))
				.to.equal('some asdf');
	});
});
