import test from 'node:test';
import assert from 'node:assert/strict';
import { pointerToCanvas } from '../src/engine/input.js';
const canvas = (width, height) => ({ width: 800, height: 600, getBoundingClientRect: () => ({ left: 10, top: 20, width, height }) });
test('Portrait letterboxing maps visible edges and ignores top/bottom margins', () => {
  const c = canvas(400, 500);
  assert.deepEqual(pointerToCanvas(c, { clientX: 10, clientY: 120 }), { x: 0, y: 0 });
  assert.deepEqual(pointerToCanvas(c, { clientX: 410, clientY: 420 }), { x: 800, y: 600 });
  assert.equal(pointerToCanvas(c, { clientX: 210, clientY: 40 }), null);
  assert.equal(pointerToCanvas(c, { clientX: 210, clientY: 500 }), null);
});
test('Landscape letterboxing maps visible edges and ignores side margins', () => {
  const c = canvas(1000, 600);
  assert.deepEqual(pointerToCanvas(c, { clientX: 110, clientY: 20 }), { x: 0, y: 0 });
  assert.deepEqual(pointerToCanvas(c, { clientX: 910, clientY: 620 }), { x: 800, y: 600 });
  assert.equal(pointerToCanvas(c, { clientX: 30, clientY: 300 }), null);
  assert.equal(pointerToCanvas(c, { clientX: 990, clientY: 300 }), null);
});
test('Hidden canvas does not produce coordinates', () => {
  assert.equal(pointerToCanvas(canvas(0, 0), { clientX: 10, clientY: 20 }), null);
});
