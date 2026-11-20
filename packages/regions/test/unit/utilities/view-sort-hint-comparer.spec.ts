import {expect} from '@open-wc/testing';
import {viewSortHintComparer} from '../../../src';

describe('When invoking `viewSortHintComparer` function', () => {
  it('should return -1 if neither of two argumens supplies sortHint property', () => {
    expect(viewSortHintComparer(<any>{}, <any>{})).to.equal(-1);
  });
  it('it should return -1 if first arg supplies sortHint property but second arg does not', () => {
    expect(viewSortHintComparer({sortHint: '0'}, {})).to.equal(-1);
  });
  it('should return 1 if first args does not supply sortHint property but second does', () => {
    expect(viewSortHintComparer({}, {sortHint: '0'})).to.equal(1);
  });
  it('should return -1 if first arg sortHint is lower than second arg sortHint', () => {
    expect(viewSortHintComparer({sortHint: '0'}, {sortHint: '001'})).to.equal(-1);
    expect(viewSortHintComparer({sortHint: 'a'}, {sortHint: 'b'})).to.equal(-1);
  });
  it('should return 0 if both sortHint are equal', () => {
    expect(viewSortHintComparer({sortHint: '1'}, {sortHint: '1'})).to.equal(0);
    expect(viewSortHintComparer({sortHint: 'b'}, {sortHint: 'b'})).to.equal(0);
  });
  it('should return 1 if first arg sortHint is higher than second arg sortHint', () => {
    expect(viewSortHintComparer({sortHint: '001'}, {sortHint: '0'})).to.equal(1);
    expect(viewSortHintComparer({sortHint: 'b'}, {sortHint: 'a'})).to.equal(1);
  });
});
