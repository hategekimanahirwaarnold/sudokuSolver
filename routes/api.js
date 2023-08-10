'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      //  get posted string
      // console.log("check request: ", req.body);
      let puzzleString = req.body.puzzle;
      let co = req.body.coordinate;
      let coord = req.body.coordinate + "";
      let coordinate = coord.split("");
      let value = req.body.value;
      //  get posted string
      // console.log("request: ", req.body)
      //if puzzle is empty send error message
      if (!puzzleString || !co || !value) {
        res.json({ error: 'Required field(s) missing' });
      } else {
        // send the string to be validated by sudokuSolver
        let authPuz = solver.validate(puzzleString);
        // console.log(authPuz);
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
                  // console.log("valid row: ", result)
                  return true
                } else {
                  // console.log("invalid row", result);
                  return false
                }
              } else {
                // console.log("invalid row", result);
                return false
              }
            }
            function validateColumn(input) {
              let regex = /[\d]/;
              if (regex.test(input)) {
                // console.log("column is number")
                if (input > 0 && input < 10) {
                  return true
                } else {
                  // console.log("invalid column");
                  return false
                }
              } else {
                // console.log("column is not a number");
                return false
              }
            }
            if (!value || !validateColumn(value)) {
              // console.log("invalid value")
              res.json({ error: 'Invalid value' })
            } else if (validateRow(row) && validateColumn(column)) {
              // console.log("row: ", row, "column: ", column);

              let inboard = solver.checkRowPlacement(puzzleString, row.toUpperCase(), column, value).inboard;
              if (inboard) {
                // console.log("Already given in board: ", true);
                res.json({ valid: true });
              } else {

                let authRow = solver.checkRowPlacement(puzzleString, row.toUpperCase(), column, value).response;
                let authColumn = solver.checkColPlacement(puzzleString, row.toUpperCase(), column, value).response;
                let authRegion = solver.checkRegionPlacement(puzzleString, row.toUpperCase(), column, value).response;

                if (authRow && authRegion && authColumn) {
                  // console.log("checking is valid: ", true);
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
                  // console.log("puzzle: ", puzzleString, "response: ", response, "row: ", authRow.region, "column: ", authColumn.region, "region: ", authRegion.region);
                  // console.log("conflicts :", response)
                  res.json(response)
                }
              }
            } else {
              // console.log("invalid coordinate")
              res.json({ error: 'Invalid coordinate' });
            }
          }

        } else {
          res.json(authPuz[1]);
        }
        // if there are errors send different responses according to different errors
        // send a solved puzzle if there are no errors
      }

    });

  app.route('/api/solve')
    .post((req, res) => {
      //  get posted string
      // console.log("request: ", req.body);
      let puzzle = req.body.puzzle;
      //if puzzle is empty send error message
      if (!puzzle) {
        res.json({ error: 'Required field missing' });
      } else {
        // send the string to be validated by sudokuSolver
        let authPuz = solver.validate(puzzle);
        // console.log(authPuz);
        if (authPuz[0]) {
          let fromSolv = solver.solve(puzzle);
          // console.log("from solver: ", fromSolv);
          if (fromSolv.error) {
            res.json( { error: 'Puzzle cannot be solved' } );
          } else {
          res.json({ solution: fromSolv });
          }
        } else {
          res.json(authPuz[1]);
        }
        // if there are errors send different responses according to different errors
        // send a solved puzzle if there are no errors
      }
    });
};
