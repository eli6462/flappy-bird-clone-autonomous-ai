
//canvas
const canvas = document.getElementById('gameCanvas');
const c = canvas.getContext('2d'); 
// canvas parameters
canvas.width = 576; 
canvas.height = 852;
// canvas background
c.fillStyle = '#92d9f7'
c.fillRect(0,0,canvas.width,canvas.height);
 
// gravity
const gravity = 0.7;
// game speed
var speed = 5;
// horizontal distance between pipes
const horizontalDeltaDistance = 221
// pipes passed counter
var pipesPassedCounter = 0

//ground
const ground = new Ground(138.3,'#cc9a68')

//bird
const flappy = new Bird(55,62,'yellow',{x:233,y:357},{x:0,y:0}) 

//pipes
//first pipe set
const bottomPipe1 = new BottomPipe(93,300,{x:570},'green')
const upperPipe1 = new UpperPipe(93,300,{x:570},'green',bottomPipe1)
//second pipe set
const bottomPipe2 = new BottomPipe(93,300,{x:570+93+horizontalDeltaDistance},'green')
const upperPipe2 = new UpperPipe(93,300,{x:570+93+horizontalDeltaDistance},'green',bottomPipe2)
//third pipe set
const bottomPipe3 = new BottomPipe(93,300,{x:570+((93+horizontalDeltaDistance)*2)},'green')
const upperPipe3 = new UpperPipe(93,300,{x:570+((93+horizontalDeltaDistance)*2)},'green',bottomPipe3)

//animation
function animate(){
    window.requestAnimationFrame(animate);

    c.fillStyle = '#92d9f7';
    c.fillRect(0,0,canvas.width,canvas.height); // delete all sprites by drawing a black screen (refresh)

    ground.draw()

    // first pipe set
    bottomPipe1.update(bottomPipe3.position.x + 93 + horizontalDeltaDistance)    
    upperPipe1.update(upperPipe3.position.x + 93 + horizontalDeltaDistance)
    //second pipe set
    bottomPipe2.update(bottomPipe1.position.x + 93 + horizontalDeltaDistance)
    upperPipe2.update(upperPipe1.position.x + 93 + horizontalDeltaDistance)
    //third pipe set
    bottomPipe3.update(bottomPipe2.position.x + 93 + horizontalDeltaDistance)
    upperPipe3.update(upperPipe2.position.x + 93 + horizontalDeltaDistance)

    //the bird
    flappy.update() 

    //detect collision between bird and pipes 
    collision(flappy,bottomPipe1)
    collision(flappy,upperPipe1)
    collision(flappy,bottomPipe2)
    collision(flappy,upperPipe2)
    collision(flappy,bottomPipe3)
    collision(flappy,upperPipe3)    

    //pipes passed counter
    pipeCounter(flappy,[bottomPipe1,bottomPipe2,bottomPipe3])
    document.getElementById('pipesPassedCounter').innerHTML = pipesPassedCounter //print counter
    
}
//caling animation function
animate()


//event listener for game control thru keyboad input
window.addEventListener('keydown',(event)=>{
    switch(event.key){
        case ' ':
            if (flappy.dead == false)
                flappy.velocity.y = -9.;
            break;
    }
})