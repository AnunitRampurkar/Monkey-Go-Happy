//Create Global Variables:

var gameState = 1;
var PLAY = 1
var END = 0;
var WIN = 2;

var monkey, monkey_running, monkeyImage, monkeyImage2;
var banana, bananaImage, obstacle, obstacleImage;
var jungle, jungleImage;
var bananaGroup, obstacleGroup;
var score;

//-------------------------------------------------------------------------

function preload() {

  //Load running animation for monkey:
  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png")

  //Load an image to change the animation to collided:
  monkeyImage = loadAnimation("sprite_7.png");

  //Load an image to change the animation after jump:
  monkeyImage2 = loadAnimation("sprite_0.png");

  //Load images for sprites:
  bananaImage = loadImage("banana.png");
  obstaceImage = loadImage("obstacle.png");

  //Load an image for ground:
  jungleImage = loadImage("jungle.jpg");
}

//-------------------------------------------------------------------------

function setup() {

  //Create canvas:
  createCanvas(600, 400);

  //Create background sprite:
  jungle = createSprite(0, 200, 800, 800);
  jungle.addImage(jungleImage);
  jungle.velocityX = -4;
  jungle.scale = 1;

  //Create Monkey sprites:
  monkey = createSprite(80, 230, 20, 20);
  monkey.addAnimation("moving", monkey_running);
  monkey.addAnimation("collided", monkeyImage);
  monkey.addAnimation("jumping", monkeyImage2);
  monkey.scale = 0.10;

  //Create invisible ground:
  ground = createSprite(400, 380, 900, 10);
  ground.velocityX = -5;
  //console.log(ground.x);

  //Create groups:
  bananaGroup = new Group();
  obstacleGroup = new Group();

  //Define score:
  score = 0;

  console.warn("😊Made by Anunit Rampurkar😊");

}

//-------------------------------------------------------------------------

function draw() {

//Create background:
  background("lightGreen");

//Collide the monkey with ground:
  monkey.collide(ground);

//Give gravity to monkey:
  monkey.velocityY = monkey.velocityY + 0.8;

//Make the ground infinite & invisible:
  ground.x = ground.width / 2;
  ground.visible = false;

//Make the jungle infinite:
  if (jungle.x < 100) {
    jungle.x = jungle.width / 2;
  }

  if (gameState === PLAY) {

    //Make the monkey jump:
    if (keyDown("space") && monkey.y >= 300) {
      monkey.velocityY = -20;
      monkey.changeAnimation("jumping", monkeyImage2);
    }

    if (keyWentUp("space")) {
      monkey.changeAnimation("moving", monkey_running);
    }

//Spawn the bananas & obsatcles:
    Banana();
    Obstacles();
    
//Increase the velocity of jungle w.r.t. time:
    jungle.velocityX = -(4 + score/5);

//Change the size of monkey after touching obstacles group:
    if (monkey.isTouching(bananaGroup)) {
      //monkey.scale = monkey.scale+0.02;
      bananaGroup.destroyEach();
      
//Increase the score:
      score = score + 2;
    }

//Change the size of monkey after touching obstacles group:
    if (monkey.isTouching(obstacleGroup)) {
      monkey.scale = monkey.scale-0.005;
      obstacleGroup.destroyEach();

//Decrease the score:
      score = score - 2;
    }

//Increase the size of monkey on the multiples of 10:
    if (score === 10) {
      monkey.scale = 0.13;
    } else if (score === 20) {
      monkey.scale = 0.16;
    } else if (score === 30) {
      monkey.scale = 0.19;
    } else if (score === 40) {
      monkey.scale = 0.23;
    }
    
    if(score === 50) {
      gameState = WIN;
      
      bananaGroup.destroyEach();
      obstacleGroup.destroyEach();
      
      monkey.y = 350;
      monkey.changeAnimation("moving", monkey_running);
      monkey.velocityX = 10;
      monkey.lifetime = 200;
    }
    
    if(score<0 || monkey.scale<0.09) {
      gameState = END;
      
      bananaGroup.destroyEach();
      obstacleGroup.destroyEach();
      
      monkey.y = 350;
      monkey.changeAnimation("collided", monkeyImage);
      monkey.velocityX = 10;
      monkey.lifetime = 200;
    }
  }
  
  if(gameState === WIN) {
    
    jungle.visible = false;
    
    stroke("black");
    strokeWeight(4);
    textSize(60);
    fill("cyan");
    text("You Win", 190, 210);
  }
  
  if(gameState === END) {
    
    jungle.visible = false;
    
    stroke("black");
    strokeWeight(4);
    textSize(60);
    fill("cyan");
    text("You Lose", 180, 210);
  }

//console.log(frameCount);

//Draw the sprites:
  drawSprites();
  
//Score:
  stroke("black");
  strokeWeight(4);
  textSize(20);
  fill("white");
  //score = Math.round(frameCount/frameRate());
  text("Score: " + score, 490, 50);
  
  if(score<0) {
    stroke("black");
    strokeWeight(4);
    textSize(30);
    fill("red");
    text("(Score)", 255, 250);
  }
}

//-------------------------------------------------------------------------

function Banana() {

  //Make the banana spawn after every 80 frames;
  if (frameCount % 80 === 0) {
    banana = createSprite(650, 50, 20, 20);
    banana.addImage(bananaImage);
    banana.scale = 0.15;
    
//Increase the velocity of bananas w.r.t. time:
    banana.velocityX = -(4 + score/5);

//Give random Y position to bananas:
    banana.y = Math.round(random(110, 265));

//Set a collider for banana:
    banana.setCollider("rectangle", 0, 0, 480, 250);

//Give lifetime:
    banana.lifetime = 180;

//Make the depth of monkey more than the banana:
    banana.depth = monkey.depth;
    monkey.depth = monkey.depth + 2;

//Add banana in its group:
    bananaGroup.add(banana);

//console.log(banana.y);

//banana.debug = true;
  }
}

//-------------------------------------------------------------------------

function Obstacles() {
  if (frameCount % 200 === 0) {
    obstacle = createSprite(630, 350, 20, 20);
    obstacle.addImage(obstaceImage);
    obstacle.scale = 0.12;
    
//Increase the velocity of obstacles w.r.t. time:
    obstacle.velocityX = -(4 + score/5);

//Set a collider for obstacle:
    obstacle.setCollider("circle", 0, 0, 150);

    obstacleGroup.add(obstacle);

//Give lifetime:
    obstacle.lifetime = 170;

//obstacle.debug = true;
  }
}