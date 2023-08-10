const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let puzzle =  [
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
    '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
  ];
let invPuzzle = '1.5..2.84..63.12.7.2..5.....h..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
let shortPuzzle = '1.2.3.3.4.4....';
let cannotSolve = '5.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
suite('Functional Tests', () => {
    // #1
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
        // this.timeout(10000)

        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: puzzle[0]})
            .end(function (err, res) {
                let data = res.body;
                assert.equal(200, res.status);
                assert.property(data, "solution");
                assert.equal(data.solution, puzzle[1]);
            });

        done();
    });
    // #2
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
        // this.timeout(10000)

        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send()
            .end(function (err, res) {
                let data = res.body;
                assert.equal(data.error, 'Required field missing');
            });

        done();
    });
    // #3
    test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
        // this.timeout(10000)

        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({ puzzle: invPuzzle })
            .end(function (err, res) {
                let data = res.body;
                assert.equal(data.error, 'Invalid characters in puzzle');
            });

        done();
    });
    // #4
    test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
        // this.timeout(10000)

        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({ puzzle: shortPuzzle })
            .end(function (err, res) {
                let data = res.body;
                assert.equal(data.error, 'Expected puzzle to be 81 characters long');
            });

        done();
    });

    // #5
    test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
        // this.timeout(10000)

        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({ puzzle: cannotSolve})
            .end(function (err, res) {
                let data = res.body;
                assert.equal(data.error, 'Puzzle cannot be solved' );
            });

        done();
    });

    // #6
    test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
        // this.timeout(10000)

        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({ puzzle: puzzle[0], coordinate: "A1", value: "1"})
            .end(function (err, res) {
                let data = res.body;
                assert.equal(data.valid, true);
            });

        done();
    });

    // #7
    test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
        // this.timeout(10000)

        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({ puzzle: puzzle[0], coordinate: "B2", value: "5"})
            .end(function (err, res) {
                let data = res.body;
                assert.equal(data.conflict.length, 1);
            });

        done();
    });

    // #8
    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
        // this.timeout(10000)

        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({ puzzle: puzzle[0], coordinate: "A1", value: "5"})
            .end(function (err, res) {
                let data = res.body;
                assert.equal(data.conflict.length, 2);
            });

        done();
    });


    // #9
    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
        // this.timeout(10000)

        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({ puzzle: puzzle[0], coordinate: "B2", value: "6"})
            .end(function (err, res) {
                let data = res.body;
                assert.equal(data.conflict.length, 3);
            });

        done();
    });

    // #10
    test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
        // this.timeout(10000)

        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({ puzzle: puzzle[0], value: "1"})
            .end(function (err, res) {
                let data = res.body;
                assert.equal(data.error, 'Required field(s) missing' );
            });

        done();
    });


    // #11
    test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
        // this.timeout(10000)

        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({ puzzle: invPuzzle, coordinate: "A1", value: "1"})
            .end(function (err, res) {
                let data = res.body;
                assert.equal(data.error, 'Invalid characters in puzzle' );
            });

        done();
    });

    // #12
    test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
        // this.timeout(10000)

        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({ puzzle: shortPuzzle, coordinate: "A1", value: "1"})
            .end(function (err, res) {
                let data = res.body;
                assert.equal(data.error, 'Expected puzzle to be 81 characters long' );
            });

        done();
    });


    // #13
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
        // this.timeout(10000)

        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({ puzzle: puzzle[0], coordinate: "43", value: "1"})
            .end(function (err, res) {
                let data = res.body;
                assert.equal(data.error, 'Invalid coordinate' );
            });

        done();
    });


    // #14
    test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
        // this.timeout(10000)

        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({ puzzle: puzzle[0], coordinate: "A1", value: "asd"})
            .end(function (err, res) {
                let data = res.body;
                assert.equal(data.error, 'Invalid value');
            });

        done();
    });









    // End of unit tests
});

