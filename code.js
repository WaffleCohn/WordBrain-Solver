function dictionaryContains(str)
{
	var len = str.length;
	
	var words = dictionary[len];

	var wordUpper = str.toUpperCase();

	for (var word in words)
	{
		if (words[word] === wordUpper)
			return true;
	}

	return false;
}

function dictionaryHasPrefix(str, len)
{
	var words = dictionary[len];
	
	for (i=0; i<words.length; i++)
	{
		var word = words[i];
		var prefix = word.substring(0, str.length);
		
		if (prefix === str)
			return true;
	}

	return false;
}

var grid = new Array();

function solve() 
{
	var boardSize = document.getElementById("size").value,
		wordLength = document.getElementById("length").value;

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

	console.log(grid);

	for (var i=0; i < boardSize; i++)
	{
		for (var j=0; j < boardSize; j++)
		{
			console.log("letter: " + grid[i][j]);
			if (grid[i][j])
				permute("", grid, wordLength, i, j, []);
		}
	}
}

var output = document.getElementById("output");

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

var printCount = 0;
var solutions = new Array();

function print(str, points)
{
	console.log(str);

	printCount++;

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
}

function highlight(points, on)
{
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









