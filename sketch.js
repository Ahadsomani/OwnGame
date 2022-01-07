/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var lion, lion_running, lion_collided;
var beef1 , beef2 , beef3 , beef
var jungle, invisiblejungle;

var obstaclesGroup, obstacle1;

var score=5;

var gameOver, restart;

function preload(){
  lion_running =   loadAnimation("lion1.png","lion2.png","lion3.png","lion4.png");
  lion_collided = loadAnimation("lion1.png");
  jungleImage = loadImage("background.jpg");
  beef1 = loadImage("beef.png");
  beef2 = loadImage("beef2.png");
  beef3 = loadImage("beef3.png");
  obstacle1 = loadImage("obstacle1 (2).png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jumpSound = loadSound("jump.wav");
  collidedSound = loadSound("collided.wav");
}

function setup() {
  createCanvas(530,275);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=1
  jungle.x = width /3;

  lion = createSprite(50,100,20,50);
  lion.addAnimation("running", lion_running);
  lion.addAnimation("collided", lion_collided);
  lion.scale = 0.15;
  lion.setCollider("circle",0,0,300)
    
  invisibleGround = createSprite(200,230,1600,10);
  invisibleGround.visible = false;

  gameOver = createSprite(400,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(550,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  
  beefGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background(255);
  
  lion.x=camera.position.x-270;
   
  if (gameState===PLAY){

    jungle.velocityX=-3

    if(jungle.x<100)
    {
       jungle.x=400
    }
   console.log(lion.y)
    if(keyDown("space")&& lion.y>120) {
      jumpSound.play();
      lion.velocityY = -16;
    }
  
    lion.velocityY = lion.velocityY + 0.8
    spawnbeef();
    spawnObstacles();

    lion.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(lion)){
      collidedSound.play();
      score = score - 5;
    }
    if(beefGroup.isTouching(lion)){
      score = score + 5;
      beefGroup.destroyEach();
    }
    if(score=0){
      gameState = END
    }

  }
  else if (gameState === END) {
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    lion.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    beefGroup.setVelocityXEach(0);

    lion.changeAnimation("collided",lion_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    beefGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
        reset();
    }
  }

  else if (gameState === WIN) {
    jungle.velocityX = 0;
    lion.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    beefGroup.setVelocityXEach(0);

    lion.changeAnimation("collided",lion_collided);

    obstaclesGroup.setLifetimeEach(-1);
    beefGroup.setLifetimeEach(-1);
  }
  
  
  drawSprites();

  textSize(20);
  stroke(3);
  fill("black")
  text("health: "+ score, 400,50);
  
  if(score >= 5){
    lion.visible = false;
    textSize(25);
    stroke(3);
    fill("red");
    text("Congragulations!! You made your health full!! ", 90,200);
    gameState = WIN;
  }
}

function spawnShrubs() {
 
  if (frameCount % 150 === 0) {

    var beef = createSprite(camera.position.x+500,230,40,10);

    beef.velocityX = -(6 + 3*score/100)
    beef.scale = 0.6;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: beef.addImage(beef1);
              break;
      case 2: beef.addImage(beef2);
              break;
      case 3: beef.addImage(beef3);
              break;
      default: break;
    }
       
    beef.scale = 0.05;
    beef.lifetime = 400;
    
    beef.setCollider("rectangle",0,0,beef.width/2,beef.height/2)
    beefGroup.add(beef);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+400,230,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100)
    obstacle.scale = 0.13;      

    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
    
  }
}


function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  lion.visible = true;
  lion.changeAnimation("running",lion_running);
  obstaclesGroup.destroyEach();
  beefGroup.destroyEach();
  score = 0;
}

