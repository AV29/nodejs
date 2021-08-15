import { expect } from 'chai';
import checkAuth from '../middlewares/checkAuth.js';

it('should throw an error if no authorization header is present', () => {
    const req = {
        get: function() {
            return null;
        }
    };

    expect(checkAuth.bind(this, req, {}, () => {})).to.throw('Test Error')
});