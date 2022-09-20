
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
function collision(bird,other){
    if (
        bird.position.x + bird.width >= other.position.x &&
        bird.position.x <= other.position.x + other.width &&
        bird.position.y + bird.height >= other.position.y &&
        bird.position.y <= other.position.y + other.height
    )
    {
        //console.log('collision')
        bird.dead = true
        speed = 0
        
    }
}

// detect if the bird got out of sky bounds
function outOfSkyBounds(bird){
    if (bird.position.y <= 0){
        bird.dead = true
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


//************************************ */
// Autonomus AI Functions

// Linear interpolation
function lerp(A,B,t){
    return A+(B-A)*t;
}

// check from intersection between 2 lines
function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}