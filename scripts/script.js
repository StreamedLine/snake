//CANVAS OBJECT
	var cvs = document.getElementById('cvs'),
	    ctx = cvs.getContext('2d');

	//SNAKE OBJECT
	var mainSnake = {
	  currentD: false,
	  futureD: false,
	  isDValid: function isDValid(d) {
	    if (!this.currentD) {return true }
	    return !(Math.abs(this.currentD - d) == 2) //opposing directions are 2 apart
	  },
	  headPos: [1, 1, 20, 20], //[x, y, w, h]
	  bodyPos: [[1, 1, 20, 20]],
	  drawPos: function drawPos(xywh) {
	    ctx.fillStyle = '#00afff';
	    ctx.fillRect(xywh[0], xywh[1], xywh[2], xywh[3]);
	  },
	  updatePos: function updatePos() {
	    var snake = this.bodyPos,
	        snkLngth = snake.length - 1,
	        i = snkLngth;
	    for (;i >= 0; i--) {
	      this.drawPos(snake[i]);
	    }
	  },
	  eraseTail: function eraseTail() {
	    var tail = this.bodyPos.shift();
	    ctx.clearRect(tail[0], tail[1], tail[2], tail[3])
	  },
	  atWall: function atWall(X,Y,W,H) {
	    if (X > cvs.offsetWidth-5) {this.headPos[0] = 1; return true }
	    if (X < 1) {this.headPos[0] = cvs.width - W - 1; return true }
	    if (Y > cvs.offsetHeight-5) {this.headPos[1] = 1; return true }
	    if (Y < 1) {this.headPos[1] = cvs.height - H - 1; return true }
	    return false;
	  }
	};
	var virtualBoard = {
	  brdW: cvs.offsetWidth,
	  brdH: cvs.offsetHeight,
	  food: [-3, -3],
	  spotTaken: function(X, Y) {
	    return (mainSnake.bodyPos.some(function(block) {
	      return (X == block[0] && Y == block[1])
	    }));
	  },
	  drawFood: function drawFood(X, Y) {
	    ctx.beginPath();
	    ctx.fillStyle = '#b30000';
	    ctx.arc(X+10, Y+10, 5, 0, Math.PI *2);
	    ctx.fill();
	  },
	  generateFood: function generateFood() {
	    var rndX = (Math.floor(Math.random() * 36) * 21) + 1,
	        rndY = (Math.floor(Math.random() * 25) * 21) + 1,
	        counter = 0;
	    while (this.spotTaken(rndX, rndY)) {
	      rndX = (Math.floor(Math.random() * 36) * 21) + 1,
	      rndY = (Math.floor(Math.random() * 25) * 21) + 1;
	      counter++;
	      if (counter > 9000) {alert('Didn\'t think this would happen but.. YOU WIN!!!'); break}
	    }
	    this.drawFood(rndX, rndY);
	    this.food = [rndX,rndY];
	  },
	  wasEaten: function wasEaten(X, Y) {
	    if (X == this.food[0] && Y == this.food[1]) {
	      txtClrRndmizer();
	      this.addPoints();
	      this.generateFood();
	      this.bonus = 5000;
	      return true;
	    }
	    return false;
	  },
	  points: 0,
	  addPoints: function() {
	    var bonus = document.getElementById('bonus');
	    this.points += 120 + this.bonus;;
	    document.getElementById('score').innerText = this.points;
	    if (this.bonus > 0) {
	      bonus.innerText = '+' + this.bonus + ' !';
	      onInsert();
	    }
	  },
	  bonus: 0
	}

	function snakeManager(dir, food) {
	  var headPos = mainSnake.headPos;
	  
	  if (mainSnake.isDValid(dir) == false) {mainSnake.futureD = mainSnake.currentD }
	  mainSnake.currentD = mainSnake.futureD;
	  dir = mainSnake.currentD;
	  
	  if (mainSnake.atWall(headPos[0], headPos[1], headPos[2], headPos[3]) === false) { //if true function has side effects
	    //[x, y, w ,h]
	    if (dir == 37) { headPos[0] -= headPos[2] + 1 }
	    if (dir == 38) { headPos[1] -= headPos[3] + 1 }
	    if (dir == 39) { headPos[0] += headPos[2] + 1 }
	    if (dir == 40) { headPos[1] += headPos[3] + 1 }
	  }
	  if (virtualBoard.spotTaken(headPos[0], headPos[1])) {initGame(); return };
	  mainSnake.bodyPos.push(headPos.slice());
	  
	  food = virtualBoard.wasEaten(headPos[0], headPos[1]);
	  mainSnake.updatePos();
	  if (!food && mainSnake.bodyPos.length > 5) {mainSnake.eraseTail() }
	}

	function initGame() {
	  ctx.clearRect(0, 0, cvs.width, cvs.height);
	  mainSnake.currentD = 39;
	  mainSnake.futureD = 39;
	  mainSnake.headPos = [1, 1, 20, 20]; //[x, y, w, h]
	  mainSnake.bodyPos = [[1, 1, 20, 20]];
	  virtualBoard.generateFood();
	  virtualBoard.points = 0;
	}

	window.setInterval(function() {
	  if (mainSnake.futureD == false) {return }
	  virtualBoard.bonus = virtualBoard.bonus > 0 ? virtualBoard.bonus - 200 : 0;
	  snakeManager(mainSnake.futureD, true);
	},100);

	//UPDATING DIRECTION BASED ON KEYDOWN
	document.addEventListener('keydown',function(e){
	  var temp = e.keyCode ? e.keyCode : (e.charCode ? e.charCode : (e.which ? e.which : false));
	  temp = temp == 37 ? temp : (temp == 38 ? temp : (temp == 39 ? temp : (temp == 40 ? temp : false) ));
	 
	  mainSnake.futureD = temp;
	});

	function onInsert() {
	  document.getElementById('bonus').style.visibility = 'visible';
	  window.setTimeout(function() {
	      document.getElementById('bonus').style.visibility = 'hidden';
	  }, 1300);
	}

	document.getElementById('start').onclick = function() {
	  initGame();
	}

	function txtClrRndmizer() {
	  document.getElementById('start').style.color = "rgb(" + rndRGB() + "," + rndRGB()  + "," + rndRGB() + ")"; 
	}

	function rndRGB() {
	  return Math.floor(Math.random() * 255);
	}

	document.getElementById('touchCheck').addEventListener('click', function() {
	  if (this.checked) {
	    document.getElementsByClassName('joystick')[0].style.display = 'block';
	  } else {
	    document.getElementsByClassName('joystick')[0].style.display = 'none';
	  }
	});

	function addTouch(el, num) {
	  el.addEventListener('touchstart', function() {
	    mainSnake.futureD = num;
	  });
	}

	addTouch(document.getElementById('left'), 37);
	addTouch(document.getElementById('up'), 38);
	addTouch(document.getElementById('right'), 39);
	addTouch(document.getElementById('down'), 40);
	addTouch(cvs, false); //for pausing game