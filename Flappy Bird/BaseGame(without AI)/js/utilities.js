
//roll random number in a specific range
function generateRandom(min, max ) {

    // find diff
    let difference = max - min;

    // generate random number 
    let rand = Math.random();

    // multiply with difference 
    rand = Math.floor( rand * difference);

    // add with min value 
    rand = rand + min;

    return rand;
}

//detect collision between bird and pipe
function collision(bird,pipe){
    if (
        bird.position.x + bird.width >= pipe.position.x &&
        bird.position.x <= pipe.position.x + pipe.width &&
        bird.position.y + bird.height >= pipe.position.y &&
        bird.position.y <= pipe.position.y + pipe.height
    )
    {
        //console.log('collision')
        flappy.dead = true
        speed = 0
        
    }
}

// count number of pipes passed (update the pipesPassedCounter var from index.js)
function pipeCounter(bird,bottomPipes=[]){
    /*
    for(var pipe in bottomPipes){
        if(bird.position.x + bird.width > pipe.)
    }
    */

    for(var i = 0; i < bottomPipes.length; i++){
        //console.log(bottomPipes[i])
        if(bottomPipes[i].standbyForCounter == true) // if it's the correct pipe in turn (to be passed by the bird)
            if(bird.position.x + bird.width > bottomPipes[i].position.x + 5){ //if the birds rightmost edge passed the leftmost Beginning of the pipe
                pipesPassedCounter++
                console.log('pipe passed')
                bottomPipes[i].standbyForCounter = false
                if((i+1)>=bottomPipes.length) // if it's the last pipe, send the first into standby
                    bottomPipes[0].standbyForCounter = true                              
                else // else send the next pipe in line into standby
                    bottomPipes[i+1].standbyForCounter = true
            }
    }
}