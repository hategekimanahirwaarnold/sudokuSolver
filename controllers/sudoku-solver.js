const anSol = require('./puzzle-strings');


let translateString = { A: [1, 1], B: [2, 1], C: [3, 1], D: [4, 2], E: [5, 2], F: [6, 2], G: [7, 3], H: [8, 3], I: [9, 3] };
let numberToString = { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'F', 7: 'G', 8: 'H', 9: 'I' };

function rowResult(puzzleString, row, column, value) {
  let numberRow = translateString[row][0];
  // console.log("numberRow: ", numberRow);
  let wholeRow = puzzleString.split("").reduce((array, item, index) => {
    if (Math.ceil((index + 1) / 9) === numberRow) {
      array.push(item);
    };
    return array
  }, []);
  // console.log("filtered numbers for row: ", wholeRow);
  // console.log("finding the inboard using wholerow.column", wholeRow[column-1])
  if (wholeRow[column - 1] === value) {
    // console.log("the value is equal to the one given in the board");
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
    //  console.log("checkRowPlacement response:", response, "value: ", value, "problem: ", problem);

    return {
      response: !response,
      region: wholeRow
    }
  }

  // 1 get the value whose row and column are sent
  // 2 get all values of the same row from the board
  // check if the value from 1 is not in 2
  // if it is there return false send the row error message
  // if it is not there return true

}
function columnResult(puzzleString, row, column, value) {
  // 1 get the value whose row and column are sent
  // 2 get all values of the same row from the board
  // check if the value from 1 is not in 2
  // if it is there return false send the row error message
  // if it is not there return true


  let wholeColumn = puzzleString.split("").reduce((array, item, index) => {
    if ((index + 1) % 9 === column || ((index + 1) % 9 === 0 && column === 9)) {
      array.push(item);
    };
    return array
  }, []);
  // console.log("filtered columns: ", wholeColumn);
  let problem = [];
  let response = wholeColumn.some(item => {
    if (item === value) {
      problem.push(item);
    }
    return item === value
  });
  // console.log("checkColumn Placement response:", response, "value: ", value, "problem: ", problem);

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
  //  console.log("filtered region: ", regionSection);
  let problem = [];
  let response = regionSection.some(item => {
    if (item === value) {
      problem.push(item);
    }
    return item === value
  });
  //  console.log("Region response:", response, "value: ", value, "problem: ", problem);

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

  solve(puzzleString) {
    if (this.validate(puzzleString)[0] === true) {
      //if it can be solved send the solution
      // a recurrent relation and analyze an input at a particular index one by one
      // if an input is a number and has a valid position return the puzzleString with nothing changed
      // if an input is not a number, loop over some posible numbers that could be in that position and pick the first one that holds
      // if you find a number that holds replace the position of the puzzle with that particular number
      // if you don't find a number which holds return an error message that the puzzle can't be solved.
      let options = [];
      function puzzleRecursion(res, index, currentArr) {
        // console.log("experimental puzzle", res, "index: ", index, "currentArr: ", currentArr);
        if (res.error) {
          // console.log("Puzzle cannot be solved", index, "current array: ", currentArr)
          //move back and try other cases
          let lastFirst = options.sort((a, b) => b[0] - a[0]);
          // check the status of the first elt
          let bool = true;
          let nextOpt = lastFirst.reduce((obj, ite, ind) => {
            if (ite[1].status < (ite[1].opt.length - 1) && bool) {
              bool = false
              ite[1].status++;
              obj = ite;
              // all opt.status whose index is greater than ind should be returned to zero
              let tobeUsed = options.slice();
              let newOpt = tobeUsed.filter(iteme => iteme[0] <= ite[0]);
              // console.log("tobe used", tobeUsed, "newOpto", newOpt, "index: ", ite[0]);
              options = newOpt;
            };
            return obj
          }, []);
          if (nextOpt[1]) {
            // console.log("next opt: ", nextOpt);
            // console.log("new Options: ", options);
            return puzzleRecursion(nextOpt[1].string, nextOpt[0], []);

          } else {
            return { error: 'Puzzle cannot be solved' }
          }
          //if it is greater than the length of opt move to the next elt
          // if it is less than opt.length increase status and return  puzzleRecursion
          // if all status are == to their opt.length, return error: puzzle can't be solved
          // console.log("lastFirst", lastFirst);
        } else if (index === 82) {
          // console.log("the final response is:", res);
          return res
        } else {
          let splitted = res.split("");
          let column;
          let numRow = Math.ceil((index) / 9);
          let row = numberToString[numRow];
          if ((index) % 9 === 0) {
            column = 9
          } else {
            column = (index) % 9;
          }
          let value = splitted[index - 1]
          // console.log("row: ", row, "column: ",  column , "splitted: ", splitted , "value: ", value);
          if (value !== ".") {
            // console.log("WE ARE TESTING A NUMBER")
            let inboard = rowResult(res, row, column, value).inboard;
            let rowAuth = rowResult(res, row, column, value).response;
            let columnAuth = columnResult(res, row, column, value).response;
            let regionAuth = regionResult(res, row, column, value).response;
            if (rowAuth && columnAuth && regionAuth || inboard) {
              index++
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
                // console.log("element: ", ele, "can replace a dot");
                array.push(ele)
              }
              return array;
            }, []);
            if (fromAll[0]) {
              if (fromAll.length > 1) {
                //find the option with that index
                //if it is already there update its object
                //if it's not there create a new object and push it to options
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
              index++
              return puzzleRecursion(joined, index, splitted);
            } else {
              return puzzleRecursion({ error: 'Puzzle cannot be solved' }, index, splitted);
            }
          }
          //at the end increment the index and return the current index
        }
      }

      let result = puzzleRecursion(puzzleString, 1, puzzleString.split(""));
      // console.log("result from solver: ", result);
      return result
    } else {
      return this.validate(puzzleString)[1];
    }
  }
}
module.exports = SudokuSolver;



