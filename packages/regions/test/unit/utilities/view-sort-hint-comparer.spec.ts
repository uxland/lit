import {viewSortHintComparer} from '../../../src';

describe('When invoking `viewSortHintComparer` function', () => {
  it('should return -1 if neither of two argumens supplies sortHint property', () => {
    expect(viewSortHintComparer(<any>{}, <any>{})).toBe(-1);
  });
  it('it should return -1 if first arg supplies sortHint property but second arg does not', () => {
    expect(viewSortHintComparer({sortHint: '0'}, {})).toBe(-1);
  });
  it('should return 1 if first args does not supply sortHint property but second does', () => {
    expect(viewSortHintComparer({}, {sortHint: '0'})).toBe(1);
  });
  it('should return -1 if first arg sortHint is lower than second arg sortHint', () => {
    expect(viewSortHintComparer({sortHint: '0'}, {sortHint: '001'})).toBe(-1);
    expect(viewSortHintComparer({sortHint: 'a'}, {sortHint: 'b'})).toBe(-1);
  });
  it('should return 0 if both sortHint are equal', () => {
    expect(viewSortHintComparer({sortHint: '1'}, {sortHint: '1'})).toBe(0);
    expect(viewSortHintComparer({sortHint: 'b'}, {sortHint: 'b'})).toBe(0);
  });
  it('should return 1 if first arg sortHint is higher than second arg sortHint', () => {
    expect(viewSortHintComparer({sortHint: '001'}, {sortHint: '0'})).toBe(1);
    expect(viewSortHintComparer({sortHint: 'b'}, {sortHint: 'a'})).toBe(1);
  });
});
