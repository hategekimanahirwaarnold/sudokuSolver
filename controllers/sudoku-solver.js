const anSol = require('./puzzle-strings');


let translateString = { A: [1, 1], B: [2, 1], C: [3, 1], D: [4, 2], E: [5, 2], F: [6, 2], G: [7, 3], H: [8, 3], I: [9, 3] };
let numberToString = { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'F', 7: 'G', 8: 'H', 9: 'I' };

function rowResult(puzzleString, row, column, value) {
  let numberRow = translateString[row][0];
  let wholeRow = puzzleString.split("").reduce((array, item, index) => {
    if (Math.ceil((index + 1) / 9) === numberRow) {
      array.push(item);
    };
    return array
  }, []);
  if (wholeRow[column - 1] === value) {
    return {
      response: true,
      region: wholeRow,
      inboard: true,
    }
  } else {
    let problem = [];
    let response = wholeRow.some(item => {
      if (item === value) {
        problem.push(item);
      }
      return item === value
    });

    return {
      response: !response,
      region: wholeRow
    }
  }
}
function columnResult(puzzleString, row, column, value) {
  let wholeColumn = puzzleString.split("").reduce((array, item, index) => {
    if ((index + 1) % 9 === column || ((index + 1) % 9 === 0 && column === 9)) {
      array.push(item);
    };
    return array
  }, []);
  let problem = [];
  let response = wholeColumn.some(item => {
    if (item === value) {
      problem.push(item);
    }
    return item === value
  });

  return {
    response: !response,
    region: wholeColumn
  }

}
function regionResult(puzzleString, row, column, value) {
  // 1 get the value whose row and column are sent
  // 2 get all values of the same region from the board
  // check if the value from 1 is not in 2
  // if it is there return false send the row error message 
  let regionRow = translateString[row][1];
  let regionSection = puzzleString.split("").reduce((array, item, index) => {
    if ((Math.ceil((index + 1) / 27) === regionRow)) {
      let col = Math.ceil(column / 3);
      if (col === 1 && ((index + 1) % 9 === 1 || (index + 1) % 9 === 2 || (index + 1) % 9 === 3)) {
        array.push(item);
      } else if (col === 2 && ((index + 1) % 9 === 4 || (index + 1) % 9 === 5 || (index + 1) % 9 === 6)) {
        array.push(item);
      } else if (col === 3 && ((index + 1) % 9 === 7 || (index + 1) % 9 === 8 || (index + 1) % 9 === 0)) {
        array.push(item);
      }
    }
    return array;
  }, []);
  let problem = [];
  let response = regionSection.some(item => {
    if (item === value) {
      problem.push(item);
    }
    return item === value
  });

  return {
    response: !response,
    region: regionSection
  }
}

class SudokuSolver {

  validate(puzzleString) {
    // validate string to be solved
    // destructure sting into arrays
    let element = puzzleString.split('')
    // check if all characters are dots or numbers
    let charAuth = element.every(item => {
      let regex = /\d/;
      if (regex.test(item) || item === ".") {
        return true
      } else {
        return false
      }
    })
    //if are not send error message
    if (!charAuth) {
      return [false, { error: 'Invalid characters in puzzle' }]
    } else {

      // if there are, check if their length is equal to 81
      if (element.length === 81) {
        // send true if everything is okay
        return [true];
      } else {
        //send limited characters error if the length is less than 81.
        return [false, { error: 'Expected puzzle to be 81 characters long' }]
      }


    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    return rowResult(puzzleString, row, column, value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    return columnResult(puzzleString, row, column, value)
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    return regionResult(puzzleString, row, column, value);
  }
  /** 
   *  A method for solving sudoku 
   *  @puzzleString: A string to be solved
   * */
  solve(puzzleString) {
    // Check if sudoku have 81 positions which include numbers or `.` for empty slots
    if (this.validate(puzzleString)[0] === true) {
      let options = [];
      // A recursive function which solves sudoku
      function puzzleRecursion(res, index, currentArr) {
        // if puzzle failed on the last index
        if (res.error) {
          //sort all availabe options in descending order
          let lastFirst = options.sort((a, b) => b[0] - a[0]);
          let bool = true;

          //move back and try other cases
          let nextOpt = lastFirst.reduce((obj, ite, ind) => {
            if (ite[1].status < (ite[1].opt.length - 1) && bool) {
              bool = false
              ite[1].status++;
              obj = ite;
              // all opt.status whose index is greater than current cell id, should be returned to zero
              let tobeUsed = options.slice();
              let newOpt = tobeUsed.filter(iteme => iteme[0] <= ite[0]); //only consider options whose index is less than or equal to the current index
              options = newOpt;
            };
            return obj;
          }, []);
          if (nextOpt[1]) {
            return puzzleRecursion(nextOpt[1].string, nextOpt[0], []);

          } else {
            return { error: 'Puzzle cannot be solved' }
          }
        } else if (index === 82) {
          return res;
        } else {
          let splitted = res.split("");
          let column;
          let numRow = Math.ceil((index) / 9);
          let row = numberToString[numRow];
          column = (index) % 9;
          if (column === 0) {
            column = 9;
          }
          let value = splitted[index - 1];
          if (value !== ".") {
            // console.log("WE ARE TESTING A NUMBER");
            let inboard = rowResult(res, row, column, value).inboard;
            let rowAuth = rowResult(res, row, column, value).response;
            let columnAuth = columnResult(res, row, column, value).response;
            let regionAuth = regionResult(res, row, column, value).response;
            if (rowAuth && columnAuth && regionAuth || inboard) {
              index++;
              return puzzleRecursion(res, index, splitted);
            } else {
              return puzzleRecursion({ error: 'Puzzle cannot be solved' }, index, splitted)
            }
          } else {
            // console.log("WE ARE TESTING A DOT");
            let all = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
            let fromAll = all.reduce((array, ele) => {
              let rowAuth = rowResult(res, row, column, ele).response;
              let columnAuth = columnResult(res, row, column, ele).response;
              let regionAuth = regionResult(res, row, column, ele).response;

              if (rowAuth && columnAuth && regionAuth) {
                array.push(ele)
              }
              return array;
            }, []);
            if (fromAll[0]) {
              if (fromAll.length > 1) {
                let isThere = options.some(it => it[0] == index)
                if (!isThere) {
                  options.push([index, {
                    status: 0,
                    opt: fromAll,
                    string: res
                  }]);
                }
                let filteredOption = options.filter(opt => opt[0] == index);
                let number = filteredOption[0][1].status;
                let chosen = filteredOption[0][1].opt[number];
                splitted[index - 1] = chosen;
              } else {
                splitted[index - 1] = fromAll[0];
              }
              let joined = splitted.join('');
              index++;
              return puzzleRecursion(joined, index, splitted);
            } else {
              return puzzleRecursion({ error: 'Puzzle cannot be solved' }, index, splitted);
            }
          }
        }
      }

      let result = puzzleRecursion(puzzleString, 1, puzzleString.split(""));
      return result
    } else {
      return this.validate(puzzleString)[1];
    }
  }
}
module.exports = SudokuSolver;



