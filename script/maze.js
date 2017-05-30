"use strict";

const NeighborMapping = [[0, -1], [-1, 0], [0, 1], [1, 0]];
const Colors = {
	background : [150, 150, 150],
	maze : [200, 50, 50],
	dfsCursor : [200, 150, 50]
}

function Cell(x, y, side) {
	this.walls = [true, true, true, true];
	this.x = x;
	this.y = y;
	this.side = side;
	
	this.draw = (fillColor) => {
		if (fillColor) {
			fill(fillColor);
			noStroke();
			rect(this.x*this.side, this.y*this.side, this.side, this.side);
		}
		
		strokeWeight(4);
		stroke(50);
		if (this.walls[0]) {
			line(this.x*this.side, this.y*this.side, (this.x+1)*this.side, this.y*this.side);
		}
		if (this.walls[1]) {
			line(this.x*this.side, this.y*this.side, this.x*this.side, (this.y+1)*this.side);
		}
		if (this.walls[2]) {
			line(this.x*this.side, (this.y+1)*this.side, (this.x+1)*this.side, (this.y+1)*this.side);
		}
		if (this.walls[3]) {
			line((this.x+1)*this.side, this.y*this.side, (this.x+1)*this.side, (this.y+1)*this.side);
		}
	}
};

function Maze() {
	this.width = 600;
	this.height = 600;
	this.side = 30;
	this.gridwidth = Math.floor(this.width/this.side);
	this.gridheight = Math.floor(this.height/this.side);
	
	this.cells = [];
		
	for (let yi = 0; yi < this.gridheight; yi++) {
		for (let xi = 0; xi < this.gridwidth; xi++) {
			this.cells.push(new Cell(xi, yi, this.side));
		}	
	}
	
	this.getCell = (x, y) => {
		if (x < 0 || x >= this.gridwidth || y < 0 || y >= this.gridheight) {
			return null;
		}
		return this.cells[x + this.gridwidth*y];
	}
	
	this.draw = () => {
		fill(Colors.background);
		rect(0, 0, this.width, this.height);
		
		noFill();
		stroke(1);
		
		for (let xi = 0; xi < this.gridwidth; xi++) {
			for (let yi = 0; yi < this.gridheight; yi++) {
				let cell = this.getCell(xi, yi);
				
				let color = null;
				
				if (cell.visited) {
					color = Colors.maze;
				}
				
				cell.draw(color);
			}	
		}
	};
}

function DFSMazeGenerator(maze, startCell) {
	this.maze = maze;
	this.queue = [startCell];
	
	this.step = () => {
		if (this.queue.length > 0) {
			let cell = this.queue.pop();
			cell.visited = true;
			let neighbors = this.getNeighbors(cell).filter(c => !c.visited);
			if (neighbors.length>0) {
				this.queue.push(cell);
				let nextNeighbor = neighbors[Math.floor(Math.random()*neighbors.length)];
				if (cell.x < nextNeighbor.x) {
					cell.walls[3] = false;
					nextNeighbor.walls[1] = false;
				} else if (cell.x > nextNeighbor.x) {
					cell.walls[1] = false;
					nextNeighbor.walls[3] = false;
				}
				else if (cell.y < nextNeighbor.y) {
					cell.walls[2] = false;
					nextNeighbor.walls[0] = false;
				} else if (cell.y > nextNeighbor.y) {
					cell.walls[0] = false;
					nextNeighbor.walls[2] = false;
				}
				this.queue.push(nextNeighbor);
			}
			return true;
		} else {
			return false;
		}
	};
	
	this.getNeighbors = (cell) => {
		let ret = [];
		for (let i=0;i<NeighborMapping.length;i++) {
			let d = NeighborMapping[i];
			let neighCell = maze.getCell(cell.x + d[0], cell.y + d[1]);
			if (neighCell) {
				ret.push(neighCell);
			}
		}
		return ret;
	};
	
	this.draw = () => {
		if (this.queue.length>0) {
			let cell = this.queue[this.queue.length-1];
			cell.draw(Colors.dfsCursor);
		}
	}
}