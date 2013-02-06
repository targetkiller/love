var canvas = document.getElementById('love');
var ctx = canvas.getContext('2d');
ctx.globalCompositeOperation = 'lighter';


var img = new Image;
img.src = './images/mg.gif';

var bgImg = new Image;
bgImg.src = './images/bg.jpg';

$(function() {
	canvas.height = $(window).height();
	canvas.width = $(window).width();
	
	
	var love = new loveObject();
	
	bgImg.onload = function() {
		love.init();
	};
	
});

var loveObject = function() {
	this.start = {x:0, y:0}; // 起始点 坐标
	this.proportion = 1/10; // 点比例
	this.point = []; // 坐标点数据
	
	this.offsets = []; // 偏移量数据
	
	this.speed = 70;
	this.moveParam = 70;
	
	this.init = function() {
		this.start.x = Math.max(0, (canvas.width-1000)/2 );
		this.start.y = Math.max(0, (canvas.height-580)/2 );
		
		this.drawFont();
		this.point = this.getCanvasData();
		
		var _this = this;
		
		for(var i = 0, l = this.point.length; i < l; i++) {
			this.offsets.push(new ofs());
		}
		
		this.move();
		
		setInterval(function() {
			_this.update();
			_this.drawElement();
		}, _this.speed);
		
		setTimeout(function() {
			_this.line();
		}, 10000);
	};
	
	
	this.move = function() {
		var _this = this;
		var moveTime = 0
		
		canvas.onmousemove = function(e) {
			_this.moveCheck(e.pageX, e.pageY);
		}
	};
	
	this.moveCheck = function(ofsX, ofsY) {
		
		for(var i = 0, l = this.point.length; i < l; i++) {
			if( Math.abs(this.point[i].x - ofsX) < 25 && Math.abs(this.point[i].y - ofsY) < 15) {
				this.offsets[i].move = 30;
			}
		}
	};
	
	this.line = function() {
		var _this = this;
		var i = 0, l = moveLine.length;
		
		setInterval(function() {
			i++;
			if(i >= l) i = 0;
			
			var sx = _this.start.x - 220;
			var sy = _this.start.y - 97.5 
			
			_this.moveCheck(moveLine[i].x+sx, moveLine[i].y+sy);
		}, 80);
		
	};
	
}

loveObject.prototype.drawFont = function() {
	/*
	ctx.fillStyle = "#333";
	ctx.font='italic 400px Lucida Handwriting,Microsoft Yahei,sans-serif ';
  ctx.textBaseline='top';
  ctx.fillText('Love', this.start.x, this.start.y);
  */
  
  ctx.drawImage(bgImg, this.start.x, this.start.y);
};

// 获取 画布 数据
loveObject.prototype.getCanvasData = function() {
	var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	
	var newData = [];
	
	for(var i = 0, l = imgData.data.length; i < l; i += 4/this.proportion) {
		if(imgData.data[i] > 10 && imgData.data[i] < 200) {
			newData.push(new point(i/4));
		}
	}
	
	// ctx.fillRect(newData[0].x, newData[0].y, 100, 100);
	// console.log(newData);
	
	return newData;
};

// 绘制元素
loveObject.prototype.drawElement = function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	for(var i = 0, l = this.point.length; i < l; i++) {
		ctx.fillStyle = 'rgba(255,81,168,'+this.offsets[i].alpha+')';
		ctx.drawImage(img, this.point[i].x+this.offsets[i].x, this.point[i].y+this.offsets[i].y, 24*this.point[i].r, 24*this.point[i].r);
	}
};

// 更新元素 坐标
loveObject.prototype.update = function() {
	
	for(var i = 0, l = this.offsets.length; i < l; i++) {
		
		if(this.offsets[i].alpha < 1) {
			this.offsets[i].alpha *= Math.floor( Math.random() * 1.299 ) + 1.01;
			
			if(this.offsets[i].alpha > 1) this.offsets[i].alpha = 1;
			
			this.offsets[i].x = Math.random()*5+2;
			this.offsets[i].y = Math.random()*5+2;
			
		} else {
			if(i%this.moveParam == 0) {
				this.offsets[i].x += this.offsets[i].xSpeed * ( Math.random()*3 + 1 );
				this.offsets[i].y += this.offsets[i].ySpeed * ( Math.random()*3 + 1 );
				
				if( 
					(this.offsets[i].x + this.point[i].x) > canvas.width || (this.offsets[i].x + this.point[i].x) < 0 ||
					(this.offsets[i].y + this.point[i].y) > canvas.height || (this.offsets[i].y + this.point[i].y) < 0 
				) {
					this.offsets[i].x = 0;
					this.offsets[i].y = 0;
					this.offsets[i].alpha = 0.01;
				}
				
			} else if(this.offsets[i].move > 0) {
				this.offsets[i].x = this.offsets[i].xSpeed*(Math.random()*5+2);
				this.offsets[i].y = this.offsets[i].ySpeed*(Math.random()*5+2);
				
				this.offsets[i].move--;
			} else {
				this.offsets[i].x = 0;
				this.offsets[i].y = 0;
			}
		}
	}
	
};


var point = function(n) {
	this.x = n % canvas.width;
	this.y = Math.floor(n / canvas.width);
	
	this.w = Math.random()*6 + 4;
	this.h = this.w;
	
	this.r = this.w / 10;
}

var ofs = function() {
	var rx = Math.random() - 0.5, ry = Math.random() - 0.5;
	
	this.xSpeed = Math.abs(rx)/rx;
	this.ySpeed = Math.abs(ry)/ry;
	
	this.x = 0;
	this.y = 0;
	
	this.move = 0;
	this.alpha = 0.01;
	this.alphaSpeed = Math.floor( Math.random() * 1.599 ) + 1.01;
}