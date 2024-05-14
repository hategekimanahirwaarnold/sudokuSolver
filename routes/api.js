'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      //  get posted string
      let puzzleString = req.body.puzzle;
      let co = req.body.coordinate;
      let coord = req.body.coordinate + "";
      let coordinate = coord.split("");
      let value = req.body.value;
      //if puzzle is empty send error message
      if (!puzzleString || !co || !value) {
        res.json({ error: 'Required field(s) missing' });
      } else {
        // send the string to be validated by sudokuSolver
        let authPuz = solver.validate(puzzleString);
        if (authPuz[0]) {
          if (coordinate.length !== 2) {
            res.json({ error: 'Invalid coordinate' });
          } else {
            let row = coordinate[0];
            let column = coordinate[1] * 1;
            function validateRow(input) {
              if (typeof input == 'string') {
                let regex = /[a-i]/i;
                let result = regex.test(input);
                if (result) {
                  return true
                } else {
                  return false
                }
              } else {
                return false
              }
            }
            function validateColumn(input) {
              let regex = /[\d]/;
              if (regex.test(input)) {
                if (input > 0 && input < 10) {
                  return true
                } else {
                  return false
                }
              } else {
                return false
              }
            }
            if (!value || !validateColumn(value)) {
              res.json({ error: 'Invalid value' })
            } else if (validateRow(row) && validateColumn(column)) {

              let inboard = solver.checkRowPlacement(puzzleString, row.toUpperCase(), column, value).inboard;
              if (inboard) {
                res.json({ valid: true });
              } else {

                let authRow = solver.checkRowPlacement(puzzleString, row.toUpperCase(), column, value).response;
                let authColumn = solver.checkColPlacement(puzzleString, row.toUpperCase(), column, value).response;
                let authRegion = solver.checkRegionPlacement(puzzleString, row.toUpperCase(), column, value).response;

                if (authRow && authRegion && authColumn) {
                  res.json({ valid: true });
                } else {
                  let response = { valid: false, conflict: [] };
                  if (!authRow) {
                    response.conflict.push("row");
                  } if (!authColumn) {
                    response.conflict.push("column");
                  } if (!authRegion) {
                    response.conflict.push("region");
                  }
                  res.json(response)
                }
              }
            } else {
              res.json({ error: 'Invalid coordinate' });
            }
          }

        } else {
          res.json(authPuz[1]);
        }
      }

    });

  app.route('/api/solve')
    .post((req, res) => {
      //  get posted string
      let puzzle = req.body.puzzle;
      //if puzzle is empty send error message
      if (!puzzle) {
        res.json({ error: 'Required field missing' });
      } else {
        // send the string to be validated by sudokuSolver
        let authPuz = solver.validate(puzzle);
        if (authPuz[0]) {
          let fromSolv = solver.solve(puzzle);
          if (fromSolv.error) {
            res.json( { error: 'Puzzle cannot be solved' } );
          } else {
          res.json({ solution: fromSolv });
          }
        } else {
          res.json(authPuz[1]);
        }
      }
    });
};
