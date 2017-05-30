"use strict";

var maze = new Maze();
var mazeGen;

function setup() {
	createCanvas(maze.width+10, maze.height+10);
	
	mazeGen = new DFSMazeGenerator(maze, maze.getCell(0, 0));
}

function draw() {
	mazeGen.step();
	maze.draw();
	mazeGen.draw();
}