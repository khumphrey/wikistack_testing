var expect = require('chai').expect;
var chai = require('chai');

var spies = require('chai-spies');
chai.use(spies);
describe('BS tests while learning mocha', function() {
    var posNum, negNum;
    beforeEach(function() {

    });
    it('sums 2+2', function() {
        expect(2 + 2).to.equal(4);
    })

    it('1000ms timeout is about 1 second', function(done) {
        var start = new Date();
        setTimeout(function() {
            var duration = new Date() - start;
            expect(duration).to.be.closeTo(1000, 50);
            done();
        }, 1000);
    });
    it('expect forEach to call on each element', function() {
        var arr = [1, 2, 3, 4]


            var eachFunc = function(index) {
                console.log(index);
            }
   
        var each = chai.spy(eachFunc);

        arr.forEach(each)
        expect(each).to.have.been.called(4);
    })
});