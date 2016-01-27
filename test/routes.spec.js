var mocha = require('mocha');
var expect = require('chai').expect;
var chai = require('chai');
var Routes = require('../routes/wiki');
var Page = require('../models').Page;




var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);


describe('http requests', function() {

    describe('GET /', function() {
        it('gets 200 on index', function(done) {
            agent
                .get('/')
                .expect(200, done)
        })
    })

    describe('GET /wiki/:urlTitle', function() {
    	beforeEach(function(done) {
    		Page.create({
    			title:'hey there',
    			content: 'ho there'
    		}, done);
    	});
    	afterEach(function(done) {
            Page.remove({}, done);
        })
        it('gets 404 on page that does not exist', function(done) {
        	agent
                .get('/wiki/crazypants')
                .expect(404, done)
        });
        it('gets 200 on page that does exist', function(done) {
        	agent
                .get('/wiki/hey_there')
                .expect(200, done)
        });
    });

    describe('GET /wiki/search', function() {
        it('gets 200', function(done) {
        	agent
                .get('/wiki/search')
                .expect(200, done)
        });
    });

    describe('GET /wiki/:urlTitle/similar', function() {
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
        it('gets 404 for page that doesn\'t exist', function(done) {
        	agent
                .get('/wiki/crazypants/similar')
                .expect(404, done)
        });
        it('gets 200 for similar page', function(done) {
        	agent
                .get('/wiki/title/similar')
                .expect(200, done)
        });
    });


    describe('GET /wiki/add', function() {
        it('gets 200', function(done) {
        	agent
                .get('/wiki/add')
                .expect(200, done)
        });
    });


    describe('POST /wiki/add', function() {
        it('creates a page in db', function(done) {
        	agent
                .post('/wiki/')
                .send({name: "namesy",
            			content: "contentedly",
            			title: "titlify",
            			email: "email@gmail.com",
            			tags: 'blah blah'})
                 .expect(302, done)
        });
    });

});
