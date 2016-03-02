function dictionaryContains(str)
{
	var len = str.length;
	
	var words = dictionary[len];

	var wordUpper = str.toUpperCase();

	// Linear Search
	/*for (var word in words)
	{
		if (words[word] === wordUpper)
			return true;
	}*/

	// Binary Search
	var low = 0,
		high = words.length-1;

	while (low <= high)
	{
		var middle = Math.floor((low + high) / 2);

		if (words[middle] === wordUpper)
			return true;
		else if (wordUpper < words[middle])
			high = middle - 1;
		else
			low = middle + 1;
	}

	return false;
}

function dictionaryHasPrefix(str, len)
{
	var words = dictionary[len];
	
	// Linear Search
	/*for (i=0; i<words.length; i++)
	{
		var word = words[i];
		var prefix = word.substring(0, str.length);
		
		if (prefix === str)
			return true;
	}*/

	// Binary Search
	var low = 0,
		high = words.length-1;

	while (low <= high)
	{
		var middle = Math.floor((low + high) / 2),
			prefix = words[middle].substring(0, str.length);

		if (prefix === str)
			return true;
		else if (str < prefix)
			high = middle - 1;
		else
			low = middle + 1;
	}

	return false;
}

var grid = new Array();

function solve() 
{
	var boardSize = document.getElementById("size").value,
		//wordLength = document.getElementById("length").value,
		lengths = document.getElementById("sizesContainer").getElementsByClassName("length"),
		solveButton = document.getElementById("solveButton"),
		resetButton = document.getElementById("resetButton"),
		output = document.getElementById("answerContainer"),
		wordLengths = new Array();

	//solveButton.style.display = "none";
	//resetButton.style.display = "inline";

	output.innerHTML = "";

	var sum = 0;
	for (var i=0; i < lengths.length; i++)
	{
		sum += parseInt(lengths[i].value);
		wordLengths.push(parseInt(lengths[i].value));
	}

	if (sum != (boardSize * boardSize))
	{
		alert("Please enter valid word lengths, " + sum + " != " + (boardSize*boardSize));
		return;
	}

	grid = new Array();

	var rows = document.getElementsByTagName("tr");

	for (var i=0; i < rows.length; i++)
	{
		var cols = rows[i].getElementsByTagName("td");
		var letters = new Array();

		for (var j=0; j < cols.length; j++)
		{
			var inputs = cols[j].getElementsByTagName("input");
			
			if (inputs[0].value == "")
				letters.push(false);
			else
				letters.push(inputs[0].value);
		}

		grid.push(letters);
	}


	for (var i=0; i < boardSize; i++)
	{

		for (var j=0; j < boardSize; j++)
		{
			console.log("letter: " + grid[i][j]);
			if (grid[i][j])
			{
				//permute("", grid, wordLength, i, j, []);
					
				var str = new Array();
					
				for (var k=0; k < wordLengths.length; k++)
					str.push("");

				var wordGrids = new Array();
				wordGrids.push(grid);

				permute2(str, grid, wordLengths, i, j, null, 0, wordGrids);
			}
		}
	}

	solveButton.disabled = false;
}

//var output = document.getElementById("output");

// str[], grid[], len[], row, col, points[], word, wordGrids[]
function permute2(str, grid, len, row, col, points, word, wordGrids)
{
	//console.log(word + ": " + str + " " + len);
	//console.log(wordGrids);
	var newStr = new Array();

	for (var i=0; i < str.length; i++)
	{
		newStr.push(str[i]);
	}

	newStr[word] += grid[row][col];

	var newPoints = new Array();

	for (var i=0; i < len.length; i++)
	{
		newPoints.push(new Array());
	}

	if (points != null && points != [])
	{
		//console.log(points + " " + (points != null) + " " + (points != []));
		for (var i=0; i < len.length; i++)
		{
			for (var j=0; j < points[i].length; j++)
			{
				newPoints[i].push(points[i][j]);
			}
		}
	}

	newPoints[word].push([row, col]);

	var newGrid = new Array();

	for (var i=0; i < grid.length; i++)
	{
		var newRow = new Array();

		for (var j=0; j < grid.length; j++)
		{
			newRow.push(grid[i][j]);
		}

		newGrid.push(newRow);
	}

	newGrid[row][col] = false;

	var newWordGrid = new Array();

	for (var i=0; i <= word; i++)
	{
		var newWordRow = new Array();

		for (var j=0; j < grid.length; j++)
		{
			var newRow = new Array();

			for (var k=0; k < grid.length; k++)
			{
				newRow.push(wordGrids[i][j][k]);
			}

			newWordRow.push(newRow);
		}

		newWordGrid.push(newWordRow);
	}

	if (newStr[word].length == len[word])
	{
		if (word == len.length-1) // last word
		{
			if (dictionaryContains(newStr[word]))
			{
				// display answer
				var ans = "";
				for (i=0; i < newStr.length; i++)
					ans += newStr[i] + (i < newStr.length-1 ? ", " : "");

				//console.log("The answer is:");
				console.log(ans);
				print(newStr, newPoints, newWordGrid);
				//alert(ans);
			}
		}
		else
		{
			if (dictionaryContains(newStr[word]))
			{
				//console.log(newStr[word]);
				//console.log("original: " + newGrid);
				//console.log("points to remove: " + newPoints);
				/*for (var i=0; i < newPoints.length; i++)
				{
					newGrid[newPoints[i][0]][newPoints[i][1]] = false;
				}
				console.log("pre-cascade: " + newGrid);*/

				newGrid = cascade(newGrid);
				//console.log("after cascade: " + newGrid);
				var newGrid2 = new Array();
				for (var i=0; i < grid.length; i++)
				{
					var newRow = new Array();
					for (var j=0; j < grid.length; j++)
					{
						newRow.push(newGrid[i][j]);
					}
					newGrid2.push(newRow);
				}

				newWordGrid.push(newGrid2);

				//console.log(newGrid2);
				for (var i=0; i < grid.length; i++)
				{
					for (var j=0; j < grid.length; j++)
					{
						if (newGrid2[i][j])
							permute2(newStr, newGrid2, len, i, j, newPoints, word+1, newWordGrid);
					}
				}
			}
		}
	}
	else if (dictionaryHasPrefix(str[word], len[word]))
	{
		//console.log(str[word] + " is a prefix");
		var right = (col < grid.length-1);
		var left = (col > 0);
		var up = (row > 0);
		var down = (row < grid.length-1);

		if (right)
		{
			if (grid[row][col+1])
				permute2(newStr, newGrid, len, row, col+1, newPoints, word, newWordGrid);
		}

		if (left)
		{
			if (grid[row][col-1])
				permute2(newStr, newGrid, len, row, col-1, newPoints, word, newWordGrid);
		}

		if (up)
		{
			if (grid[row-1][col])
				permute2(newStr, newGrid, len, row-1, col, newPoints, word, newWordGrid);
		}

		if (down)
		{
			if (grid[row+1][col])
				permute2(newStr, newGrid, len, row+1, col, newPoints, word, newWordGrid);
		}

		if (up && right)
		{
			if (grid[row-1][col+1])
				permute2(newStr, newGrid, len, row-1, col+1, newPoints, word, newWordGrid);
		}

		if (up && left)
		{
			if (grid[row-1][col-1])
				permute2(newStr, newGrid, len, row-1, col-1, newPoints, word, newWordGrid);
		}

		if (down && right)
		{
			if (grid[row+1][col+1])
				permute2(newStr, newGrid, len, row+1, col+1, newPoints, word, newWordGrid);
		}

		if (down && left)
		{
			if (grid[row+1][col-1])
				permute2(newStr, newGrid, len, row+1, col-1, newPoints, word, newWordGrid);
		}
	}
}

function cascade(grid)
{
	var newGrid = new Array();

	for (i=0; i < grid.length; i++)
	{
		newGrid[i] = new Array();
	}

	for (col=0; col < grid.length; col++)
	{
		var lowPt = grid.length-1;

		for (row=grid.length-1; row >= 0; row--)
		{
			if (grid[row][col])
			{
				newGrid[lowPt][col] = grid[row][col];
				lowPt--;
			}
		}
	}

	return newGrid;
}

function permute(str, grid, len, row, col, points)
{
	str += grid[row][col];

	var newPoints = new Array();
	
	if (points != null)
	{
		for (var i=0; i < points.length; i++)
		{	
			newPoints.push(points[i]);
		}
	}

	newPoints.push([row, col]);

	//console.log("permutation: " + str);
	if (str.length == len)
	{
		if (dictionaryContains(str))
			print(str, newPoints);
	}
	else if (!dictionaryHasPrefix(str, len))
	{
		
	}
	else
	{
		var newGrid = new Array();

		for (var i=0; i < grid.length; i++)
		{
			var newRow = new Array();

			for (var j=0; j < grid.length; j++)
			{
				newRow.push(grid[i][j]);
			}

			newGrid.push(newRow);
		}

		//console.log(grid);
		//console.log(newGrid + " " + row + " " + col + " " + grid.length);

		newGrid[row][col] = false;

		var right = (col < grid.length-1);
		var left = (col > 0);
		var up = (row > 0);
		var down = (row < grid.length-1);

		if (right)
		{
			if (grid[row][col+1])
				permute(str, newGrid, len, row, col+1, newPoints);
		}

		if (left)
		{
			if (grid[row][col-1])
				permute(str, newGrid, len, row, col-1, newPoints);
		}

		if (up)
		{
			if (grid[row-1][col])
				permute(str, newGrid, len, row-1, col, newPoints);
		}

		if (down)
		{
			if (grid[row+1][col])
				permute(str, newGrid, len, row+1, col, newPoints);
		}

		if (up && right)
		{
			if (grid[row-1][col+1])
				permute(str, newGrid, len, row-1, col+1, newPoints);
		}

		if (up && left)
		{
			if (grid[row-1][col-1])
				permute(str, newGrid, len, row-1, col-1, newPoints);
		}

		if (down && right)
		{
			if (grid[row+1][col+1])
				permute(str, newGrid, len, row+1, col+1, newPoints);
		}

		if (down && left)
		{
			if (grid[row+1][col-1])
				permute(str, newGrid, len, row+1, col-1, newPoints);
		}
	}
}

//var printCount = 0;
//var solutions = new Array();

// str[], points[], wordGrids[]
function print(str, points, wordGrids)
{
	console.log("" + wordGrids);

	var output = document.getElementById("answerContainer"),
		els = "";

	var gridStrs = new Array();

	for (var i=0; i < wordGrids.length; i++)
	{
		var gridStr = "[";

		for (var j=0; j < wordGrids[i].length; j++)
		{
			var rowStr = "[";

			for (var k=0; k < wordGrids[i][j].length; k++)
			{
				if (wordGrids[i][j][k])
					rowStr += "'" + wordGrids[i][j][k] + "', ";
				else
					rowStr += "null, "
			}

			rowStr = rowStr.substring(0, rowStr.length-2) + "], ";
			//rowStr += "], ";

			gridStr += rowStr;
		}

		gridStr = gridStr.substring(0, gridStr.length-2) + "]";
		//gridStr += "]";
		console.log(gridStr);
		gridStrs.push(gridStr);
	}

	for (var i=0; i < str.length; i++)
	{
		els += '<span class="output" onmouseover="highlight(' + gridStrs[i] + ', [' + points[i] +'], true);" onmouseout="highlight(' + gridStrs[0] + ', [' + points[i] + '], false);">' + str[i] + '</span>\n';
	}

	output.innerHTML += '<div class="answer-set">\n' + els + '</div>';

	output.style.display = "block";



	/*printCount++;

	solutions.push([str, points]);

	var singleOutput = document.getElementById("singleOutput"),
		output1 = document.getElementById("outputBox"),
		output2 = document.getElementById("outputBox2");

	
	if (printCount == 1)
	{
		singleOutput.innerHTML += '<p class="output" onmouseover="highlight([' + points +'], true);" onmouseout="highlight([' + points + '], false);">' + str + '</p>';
	}
	else if (printCount == 2)
	{
		singleOutput.innerHTML = "";
		output1.innerHTML += '<p class="output" onmouseover="highlight([' + solutions[0][1] +'], true);" onmouseout="highlight([' + solutions[0][1] + '], false);">' + solutions[0][0] + '</p>';
		output2.innerHTML += '<p class="output" onmouseover="highlight([' + points +'], true);" onmouseout="highlight([' + points + '], false);">' + str + '</p>';
	}
	else if (printCount % 2 == 1)
	{
		output1.innerHTML += '<p class="output" onmouseover="highlight([' + points +'], true);" onmouseout="highlight([' + points + '], false);">' + str + '</p>';
	}
	else
	{
		output2.innerHTML += '<p class="output" onmouseover="highlight([' + points +'], true);" onmouseout="highlight([' + points + '], false);">' + str + '</p>';
	}
	
	//outputBox.innerHTML += '<p class="output" onmouseover="highlight();">' + str + '</p>';
	*/
}

function highlight(wordGrid, points, on)
{
	displayGrid(wordGrid);

	// background = #777, color = orange
	for (var i=0; i < points.length; i+=2)
	{
		var row = points[i], col = points[i+1];

		var grid = new Array(),
			rows = document.getElementsByTagName("tr");
		for (var j=0; j < rows.length; j++)
		{
			grid.push(rows[j].getElementsByTagName("td"));
		}

		grid[row][col].style.background = on ? "#777" : "white";
		grid[row][col].style.color = on ? "orange" : "black";

		grid[row][col].getElementsByTagName("input")[0].style.background = on ? "#777" : "white";
	}
}

/*
function submitWord(points)
{
	// clear choices
	var singleOutput = document.getElementById("singleOutput"),
		output1 = document.getElementById("outputBox"),
		output2 = document.getElementById("outputBox2");

	singleOutput.innerHTML = "";
	output1.innerHTML = "";
	output2.innerHTML = "";

	// cascade blocks
	for (var i=0; i < points.length; i+=2)
	{
		var row = points[i], col = points[i+1];
		console.log(row + ", " + col);
		grid[row][col] = false;
		console.log(grid[row][col]);
		console.log(grid);
	}

	console.log(grid);

	for (var col=0; col < grid.length; col++)
	{
		for (var row = grid.length-1; row >= 0 ;row--)
		{
			if (!grid[row][col])
			{
				for (var i=row; i > 0; i--)
				{
					grid[row][col] = grid[row-1][col];
				}
			}
		}
	}

	console.log(grid);
}
*/

function addWord()
{
	var sizesContainer = document.getElementById("sizesContainer"),
		sizes = sizesContainer.getElementsByClassName("length");

	if (sizes.length < 4)
	{
		sizesContainer = document.getElementById("sizesRow1");
		sizesContainer.innerHTML += '<input type="text" class="length text-centered aligner-item" size="1" maxlength="1" onkeypress="return formatBoardSize(event, this);" value="4" />';
	}
	else if (sizes.length < 8)
	{
		sizesContainer = document.getElementById("sizesRow2");
		sizesContainer.innerHTML += '<input type="text" class="length text-centered aligner-item" size="1" maxlength="1" onkeypress="return formatBoardSize(event, this);" value="4" />';
	}
}

function removeWord()
{
	var sizesContainer = document.getElementById("sizesContainer"),
		sizes = sizesContainer.getElementsByClassName("length"),
		els;

	if (sizes.length == 1)
		return;

	if (sizes.length < 5)
	{
		sizesContainer = document.getElementById("sizesRow1");
		els = sizesContainer.getElementsByClassName("length");
		els[els.length-1].remove();
	}
	else if (sizes.length < 9)
	{
		sizesContainer = document.getElementById("sizesRow2");
		els = sizesContainer.getElementsByClassName("length");
		els[els.length-1].remove();
	}

}

function displayGrid(grid)
{
	var table = document.getElementById("table"),
		rows = table.getElementsByTagName("tr");

	for (var i=0; i < rows.length; i++)
	{
		var cols = rows[i].getElementsByTagName("input");

		for (var j=0; j < cols.length; j++)
		{
			if (grid[i][j])
				cols[j].value = grid[i][j];
			else
				cols[j].value = "";
		}
	}
}

function reset()
{
	var defaultGrid = [["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""]],
		output = document.getElementById("answerContainer"),
		sizesRow1 = document.getElementById("sizesRow1"),
		sizesRow2 = document.getElementById("sizesRow2"),
		gridSize = document.getElementById("size"),
		solveButton = document.getElementById("solveButton");

	resetTable(4);
	displayGrid(defaultGrid);

	sizesRow1.innerHTML = '<input type="text" class="length text-centered aligner-item" size="1" maxlength="1" onkeypress="return formatBoardSize(event, this);" value="4" />\n<input type="text" class="length text-centered aligner-item" size="1" maxlength="1" onkeypress="return formatBoardSize(event, this);" value="4" />\n<input type="text" class="length text-centered aligner-item" size="1" maxlength="1" onkeypress="return formatBoardSize(event, this);" value="8" />';
	sizesRow2.innerHTML = '';

	gridSize.value = 4;

	output.innerHTML = "";
	output.style.display = "none";

	solveButton.style.display = "inline";
	solveButton.disabled = false;
}









