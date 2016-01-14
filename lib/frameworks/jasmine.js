/**
 * Execute the Runner's test cases through Jasmine.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @param done A callback for when tests are finished.
 */
exports.run = function(runner, specs, done, theACVResetter) { /* ACV OJO 201410262213 to reset info held from previous protractor Runner and jasmine executions in same node js process. */
  var minijn = require('minijasminenode');



    if( theACVResetter && ( typeof theACVResetter == "function")) { /* ACV OJO 201410262213 to reset info held from previous protractor Runner and jasmine executions in same node js process. */
        theACVResetter( "jasmine.js.run", jasmine, "jasmine.currentEnv_");
    }


    require('jasminewd');
  /* global jasmine */

  var RunnerReporter = function(emitter) {
    this.emitter = emitter;
  };

  RunnerReporter.prototype.reportRunnerStarting = function() {};
  RunnerReporter.prototype.reportRunnerResults = function() {};
  RunnerReporter.prototype.reportSuiteResults = function() {};
  RunnerReporter.prototype.reportSpecStarting = function() {};
  RunnerReporter.prototype.reportSpecResults = function(spec) {
    if (spec.results().passed()) {
      this.emitter.emit('testPass');
    } else {
      this.emitter.emit('testFail');
    }
  };
  RunnerReporter.prototype.log = function() {};

    if( theACVResetter && ( typeof theACVResetter == "function")) { /* ACV OJO 201410262213 to reset info held from previous protractor Runner and jasmine executions in same node js process. */
        theACVResetter( "jasmine.js.run", jasmine, "jasmine.subReporters_");
    }


    if( theACVResetter && ( typeof theACVResetter == "function")) { /* ACV OJO 201410262213 to reset info held from previous protractor Runner and jasmine executions in same node js process. */
        theACVResetter( "jasmine.js.run", minijn, "minijn.pResetSpecFiles");
    }



    // On timeout, the flow should be reset. This will prevent webdriver tasks
  // from overflowing into the next test and causing it to fail or timeout
  // as well. This is done in the reporter instead of an afterEach block
  // to ensure that it runs after any afterEach() blocks with webdriver tasks
  // get to complete first.
  jasmine.getEnv().addReporter(new RunnerReporter(runner));

  runner.runTestPreparers().then(function() {
    var jasmineNodeOpts = runner.getConfig().jasmineNodeOpts;
    var originalOnComplete = runner.getConfig().onComplete;
    jasmineNodeOpts.onComplete = function(jasmineRunner, log) {
      if (originalOnComplete) {
        originalOnComplete(jasmineRunner, log);
      }
      done(jasmineRunner.results());
    };

    minijn.addSpecs(specs);
    minijn.executeSpecs(jasmineNodeOpts);
  });
};
