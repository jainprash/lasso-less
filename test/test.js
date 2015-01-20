'use strict';
var chai = require('chai');
chai.config.includeStack = true;
require('chai').should();
var expect = require('chai').expect;
var nodePath = require('path');
var fs = require('fs');

var lessPlugin = require('../'); // Load this module just to make sure it works
var optimizer = require('optimizer');

describe('optimizer-less' , function() {

    beforeEach(function(done) {
        for (var k in require.cache) {
            if (require.cache.hasOwnProperty(k)) {
                delete require.cache[k];
            }
        }
        done();
    });

    it('should render a complex less dependency', function(done) {

        var pageOptimizer = optimizer.create({
                fileWriter: {
                    fingerprintsEnabled: false,
                    outputDir: nodePath.join(__dirname, 'static')
                },
                bundlingEnabled: true,
                plugins: [
                    {
                        plugin: lessPlugin,
                        config: {

                        }
                    }
                ]
            });

        pageOptimizer.optimizePage({
                name: 'testPage',
                dependencies: [
                    nodePath.join(__dirname, 'fixtures/complex.less')
                ]
            },
            function(err, optimizedPage) {
                if (err) {
                    return done(err);
                }

                var actual = fs.readFileSync(nodePath.join(__dirname, 'static/testPage.css'), 'utf8');
                var expected = fs.readFileSync(nodePath.join(__dirname, 'fixtures/complex.less.expected.css'), 'utf8');
                fs.writeFileSync(nodePath.join(__dirname, 'fixtures/complex.less.actual.css'), actual, 'utf8');
                expect(actual).to.equal(expected);
                done();
            });
    });


    it('should render a node module less dependency', function(done) {

        var pageOptimizer = optimizer.create({
                fileWriter: {
                    fingerprintsEnabled: false,
                    outputDir: nodePath.join(__dirname, 'static')
                },
                bundlingEnabled: true,
                plugins: [
                    {
                        plugin: lessPlugin,
                        config: {

                        }
                    }
                ]
            });

        pageOptimizer.optimizePage({
                name: 'testPage',
                dependencies: [
                    "require: installed/style.less"
                ],
                from: nodePath.join(__dirname, 'fixtures')
            },
            function(err, optimizedPage) {
                if (err) {
                    return done(err);
                }

                var actual = fs.readFileSync(nodePath.join(__dirname, 'static/testPage.css'), 'utf8');
                fs.writeFileSync(nodePath.join(__dirname, 'fixtures/installed.less.actual.css'), actual, 'utf8');
                var expected = fs.readFileSync(nodePath.join(__dirname, 'fixtures/installed.less.expected.css'), 'utf8');
                expect(actual).to.equal(expected);
                done();
            });

    });

    it('should handle errors', function(done) {

        var pageOptimizer = optimizer.create({
                fileWriter: {
                    fingerprintsEnabled: false,
                    outputDir: nodePath.join(__dirname, 'static')
                },
                bundlingEnabled: true,
                plugins: [
                    {
                        plugin: lessPlugin,
                        config: {

                        }
                    }
                ]
            });

        pageOptimizer.optimizePage({
                name: 'testPage',
                dependencies: [
                    nodePath.join(__dirname, 'fixtures/error.less')
                ]
            },
            function(err, optimizedPage) {
                expect(!!err).to.equal(true);
                done();
            });
    });

});
