  let puzzle = puzzleString.split("");
    let response = puzzle.reduce((arr, item, index) => {
      let column;
      let numRow = Math.ceil((index + 1) / 9);
      let row = numberToString[numRow];
      if ((index + 1) % 9 === 0) {
        column = 9
      } else {
        column = (index + 1) % 9;
      }
      console.log("row: ", row, "column: ", column);
      if (item !== ".") {
        console.log("WE ARE TESTING A NUMBER")
        let rowAuth = this.checkRowPlacement(puzzleString, row, column, item).response;
        let columnAuth = this.checkColPlacement(puzzleString, row, column, item).response;
        let regionAuth = this.checkRegionPlacement(puzzleString, row, column, item).response;
        if (rowAuth && columnAuth && regionAuth) {
          arr.push(item);
          console.log("element: ", item, "worked out!")
          return arr;
        } else {
          return { error: 'Puzzle cannot be solved' }
        }
      } else {
        console.log("WE ARE TESTING A DOT");
        let all = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let fromAll = all.reduce( (array, ele, ind) => {
          let rowAuth = this.checkRowPlacement(puzzleString, row, column, ele).response;
          let columnAuth = this.checkColPlacement(puzzleString, row, column, ele).response;
          let regionAuth = this.checkRegionPlacement(puzzleString, row, column, ele).response;
          if (rowAuth && columnAuth && regionAuth) {
            console.log("element: ", ele, "can replace a dot");
            array.push(ele);
            return array
          }
        }, []);
        console.log("from all digits, the one worked out are: ", fromAll, "array, ", arr);
        if (fromAll[0]) {
          item = fromAll[0];
          arr.push(item);
          return arr;
        } else {
          return { error: 'Puzzle cannot be solved' }
        }
      }

    }, []);
    if (!response.error) {
      let solvedPuzzle = response.join("");
      return solvedPuzzle;
    } else {
      return response
    }
  