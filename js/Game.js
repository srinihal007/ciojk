class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
    this.leftkeyactive = false;
    this.blast = false;

  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;
    car1.addImage("blast",blastImg)

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;
    car2.addImage("blast",blastImg)

    cars = [car1, car2];

    fuels = new Group();
    powerCoins = new Group();
    obstacles = new Group();

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    // Adding fuel sprite in the game
    this.addSprites(fuels, 4, fuelImage, 0.02);

    // Adding coin sprite in the game
    this.addSprites(powerCoins, 18, powerCoinImage, 0.09);
    //adding obstacles spritesin the game
    this.addSprites(obstacles,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions);
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale,positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;
      if(positions.length > 0) {
        x = positions[i].x
        y = positions[i].y
        spriteImage = positions[i].image
      }
else {
  x = random(width / 2 + 150, width / 2 - 150);
  y = random(-height * 4.5, height - 400);
}
     

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }
  handleFuel(index) {
cars[index - 1 ].overlap(fuels,function(collecter,collected){

  player.fuel = 185
  //collected is the sprite in the group collectables which trigger the event.
  collected.remove() 
}) 
if(player.fuel > 0 && this.playerMoving) {
  player.fuel = player.fuel - 0.3;
}
if (player.fuel <= 0 ) {
  gameState = 2
  this.gameOver()

}
  }
  handlePowerCoins(index) {
    cars[index - 1].overlap(powerCoins,function(collecter,collected){
      player.score += 5
      collected.remove()
    })

  }
  gameOver() {
    swal({
      title:`Game Over`,
      text:"Whoops! Better luck next time!!",
      imageUrl:"https://i.pinimg.com/236x/d4/cf/43/d4cf43182b1b795cf5715a6d2bf59645--minions-emoticons-funny-emoticons.jpg",
      imageSize:"200x200",
      confirmButtonText:"Thanks For Playing"
    })
    
  }


  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Leaderboard");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getCarsAtEnd()

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);


      this.showFuelBar()
      this.showLife()

      this.showLeaderboard();

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        //saving the vallue of player.life in a temprorary variable 
        var currentLife = allPlayers[plr].life

        if (currentLife <= 0) {
          cars[index - 1].changeImage("blast")

        }

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index == player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);





  this.handleFuel(index)
  this.handlePowerCoins(index)
  this.handleObstacleCollision(index)
  this.handleCarsCollision(index)

if(player.life <= 0) {
  this.blast = true;
  this.playerMoving = false;
}

          // Changing camera position in y direction
          camera.position.y = cars[index - 1].position.y;
    
        }
      }
      if(this.playerMoving) {
        player.positionY = player.positionY + 2
        player.update()
      }

      // handling keyboard events
      this.handlePlayerControls();
      const finishLine = height *6 - 100
      if(player.positionY>finishLine) {
        gameState = 2
        player.rank = player.rank +1
        Player.updateCarsAtEnd(player.rank)
        player.update()
        this.showRank()
      }

      drawSprites();
    }
  }
  handleCarsCollision(index) {
    if(index == 1) {
      if(cars[index - 1].collide(cars[1])) {
        if(this.leftkeyactive) {
          player.positionX = player.positionX + 100
        }
        else {
          player.positionX = player.positionX - 100
        }

        //reducing player life every time it collides with other players car
        if(player.life > 0) {
          player.life = player.life - 185/4
        }
        //updating the changd values of the player's values in the database
        player.update()
      }
    }
    if(index == 2) {
      if(cars[index - 1].collide(cars[0])) {
        if(this.leftkeyactive) {
          player.positionX = player.positionX + 100
        }
        else {
          player.positionX = player.positionX - 100
        }
        if(player.life > 0) {
          player.life = player.life - 185/4
        }
        player.update()
      }
    }
  }
  handleObstacleCollision(index) {
if(cars[index - 1].collide(obstacles)) {
  if( this.leftkeyactive) {
    player.positionX = player.positionX + 100
  }
  else {
player.positionX = player.positionX - 100

  }
if (player.life > 0) {
player.life = player.life - (185/4)
}
player.update()
}
  }
  
showRank() {
  swal({
    title:`Awesome!${"\n"}Rank${"\n"}${player.rank}`,
    text:"You Have Reached The Finish Line Successfully",
    imageUrl:"https://media.istockphoto.com/photos/golden-trophy-winner-cup-on-white-background-picture-id492761448?k=6&m=492761448&s=170667a&w=0&h=DhiKT1-KIXetYs4DNbDsvFmWNcr7LLIyWfVnSK574tg=",
    imageSize:"200x200",
    confirmButtonText:"okay"
  })

}
showLife() {
push()
image(lifeImage,width/2-130,height-player.positionY-400,20,20)
fill("white")
rect(width/2 - 100,height-player.positionY-400,185,20)
fill("red")
rect(width/2 - 100,height-player.positionY-400,player.life,20)
noStroke()
pop()
}
showFuelBar() {
  push()
  image(fuelImage,width/2-130,height-player.positionY-100,20,20)
  fill("white")
  rect(width/2 - 100,height-player.positionY-100,185,20)
  fill("yellow")
  rect(width/2 - 100,height-player.positionY-100,player.fuel,20)
  noStroke()
  pop()
  }


  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        CarsAtEnd: 0
      });
      window.location.reload();
    });
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
    if(!this.blast) {

    
    if (keyIsDown(UP_ARROW)) {
      this.playerMoving = true
      player.positionY += 10;
      player.update();
    }

    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      this.leftkeyactive = true
      player.positionX -= 5;
      player.update();
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
      this.leftkeyactive = false;
      player.positionX += 5;
      player.update();
    }
  }
}
end() {
  console.log("gameOver")
}
}
