const chai = require('chai');
const assert = chai.assert;
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;
let puzzle =  [
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
    '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
  ];
let invPuzzle = '1.5..2.84..63.12.7.2..5.....h..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
let shortPuzzle = '1.2.3.3.4.4....';
suite('UnitTests', function () {
    //beginning of tests
    // #1
    test('Logic handles a valid puzzle string of 81 characters',  function (done) {
      assert.equal(solver.validate(puzzle[0])[0], true);
      done();
    });
    // #2
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)',  function (done) {
      assert.equal(solver.validate(invPuzzle)[0], false);
      done();
    });
     // #3
    test('Logic handles a puzzle string that is not 81 characters in length',  function (done) {
      assert.equal(solver.validate(shortPuzzle)[0], false);
      done();
    });
    // #4
    test('Logic handles a valid row placement',  function (done) {
      assert.equal(solver.checkRowPlacement(puzzle[0], "A", '1', '1').response, true);
      done();
    });
    // #5
    test('Logic handles an invalid row placement',  function (done) {
      assert.equal(solver.checkRowPlacement(puzzle[0], "A", '1', '5').response, false);
      done();
    });
    // #6
    test('Logic handles a valid column placement',  function (done) {
      assert.equal(solver.checkColPlacement(puzzle[0], "A", '1', '1').response, true);
      done();
    });
    // #7
    test('Logic handles an invalid column placement',  function (done) {
      assert.equal(solver.checkRowPlacement(puzzle[0], "A", '1', '8').response, false);
      done();
    });
    // #8
    test('Logic handles a valid region (3x3 grid) placement',  function (done) {
      assert.equal(solver.checkRegionPlacement(puzzle[0], "A", '1', '3').response, true);
      done();
    });
    // #9
    test('Logic handles an invalid region (3x3 grid) placement',  function (done) {
      assert.equal(solver.checkRegionPlacement(puzzle[0], "A", '1', '6').response, false);
      done();
    });
    // #10
    test('Valid puzzle strings pass the solver',  function (done) {
      assert.equal(solver.solve(puzzle[0]), puzzle[1]);
      done();
    });
    // #11
    test('Invalid puzzle strings fail the solver',  function (done) {
      assert.property(solver.solve(invPuzzle), "error");
      done();
    });
    // #12
    test('Solver returns the expected solution for an incomplete puzzle',  function (done) {
      assert.property(solver.solve(shortPuzzle), "error");
      done();
    });
    //end of tests
});
