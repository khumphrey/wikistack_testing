var mocha = require('mocha');
var expect = require('chai').expect;
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);
var Page = require('../models').Page;



describe('Page model', function() {
    describe('Validations', function() {
        var newPage;
        beforeEach(function() {
            newPage = new Page();
        });

        it('errors without title', function(done) {
            newPage.save()
                .then(null, function(err) {
                    expect(err.errors).to.have.property('title');
                    done();
                })
        });
        it('errors without content', function(done) {
            newPage.save()
                .then(null, function(err) {
                    expect(err.errors).to.have.property('content');
                    done();
                })
        });
    });

    describe('Statics', function() {
        beforeEach(function(done) {
            Page.create({
                    title: 'I am a title',
                    content: 'blah',
                    tags: ['hi', 'unicorn']
                }, done) //create takes an object and a callback that accepts an error and another input; 
                //by using done, we are only looking at the error (even though multiple objects are passed)
        });
        afterEach(function(done) {
            Page.remove({}, done);
        })
        describe('findByTag', function() {
            it('gets pages with the search tag', function(done) {
                Page.findByTag('unicorn') //this returns an array of documents
                    .then(function(page) {
                        expect(page.length).to.equal(1);
                        done();
                    }).then(null, done);
            });
            it('does not get pages without the search tag', function(done) {
                Page.findByTag() //this returns an array of documents
                    .then(function(page) {
                        expect(page.length).to.equal(0);
                        done();
                    }).then(null, done);
            });
        });
    });

    describe('Methods', function() {
        beforeEach(function(done) {
            Page.create({
                    title: 'title',
                    content: 'blah',
                    tags: ['hi', 'bike']
                })
                .then(function() {
                    Page.create({
                        title: '2title',
                        content: 'blah',
                        tags: ['hi', 'unicorn']
                    })
                })
                .then(function() {
                    Page.create({
                        title: '3title',
                        content: 'blah',
                        tags: ['dgxfchvj', 'dxgfchgjvh']
                    })
                })
                .then(function() {
                    done();
                })
        });

        afterEach(function(done) {
            Page.remove({}, done);
        })
        describe('findSimilar', function() {
            it('never gets itself', function(done) {
                Page.find({
                        title: 'title'
                    })
                    .then(function(pages) {
                        return pages[0].findSimilar();
                    })
                    .then(function(stuff) {
                        expect(stuff[0].title).to.not.equal('title');
                        done();
                    })
            });
            it('gets other pages with any common tags', function() {
                Page.find({
                        title: 'title'
                    })
                    .then(function(pages) {
                        return pages[0].findSimilar();
                    })
                    .then(function(stuff) {
                        expect(stuff[0].title).to.equal('2title');
                        done();
                    })
            });
            it('does not get other pages without any common tags', function() {
                Page.find({
                        title: 'title'
                    })
                    .then(function(pages) {
                        return pages[0].findSimilar();
                    })
                    .then(function(stuff) {
                        expect(stuff[0].title).to.not.equal('3title');
                        done();
                    })
            });
        });
    });

    describe('Virtuals', function() {
        describe('route', function() {
            var newPage;
            beforeEach(function() {
            	newPage = new Page({
            		title: 'title space',
                    urlTitle: 'title_space',
                    content: 'blah'
            	}); //with new page, this doesn't save to the db, so it doesn't go by validations yet
            });
            it('returns the url_name prepended by "/wiki/"', function(done) {
            	expect(newPage.route).to.equal('/wiki/title_space');
            	done();
            });
        });
    });

    describe('Hooks', function() {
    	          var newPage;
            beforeEach(function(done) {
            	Page.create({
            		title: 'title space',
                    content: 'blah'
            	})
            	.then(function(page) {
            		newPage = page;
            	})
            	.then(function() {
            		done();
            	})
            });
        it('it sets urlTitle based on title before validating', function(done) {
        	expect(newPage.urlTitle).to.equal('title_space');
        	done()
        });
    });

});
