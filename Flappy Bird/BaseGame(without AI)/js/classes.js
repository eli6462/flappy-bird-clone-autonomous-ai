
class Ground {
    constructor(height,color){
        this.height = height
        this.width = canvas.width
        this.color = color
        this.position = {
            x:0,
            y:canvas.height - height // the y position is adjusted automataclly in relation to the ground height - so that the ground will always touch the floor
        }
    }
    draw(){
        c.fillStyle = ground.color
        c.fillRect(ground.position.x,ground.position.y,ground.width,ground.height)
    }

}


class Bird {
    constructor(height,width,color,position={},velocity={}){
        this.height = height
        this.width = width
        this.color = color
        this.position = position
        this.velocity = velocity
        this.dead = false
    }
    draw(){
        c.fillStyle = flappy.color
        c.fillRect(flappy.position.x,flappy.position.y,flappy.width,flappy.height)
    }
    update(){
        this.draw()

         // update y axis using velocity
        this.position.y += this.velocity.y

        // gravity function AND stopping the sprite from falling under the ground
        if (this.position.y + this.height + this.velocity.y >= canvas.height -ground.height){
            this.velocity.y = 0;
            //this.position.y = 330;
        }        
        else //the velocity accelarates by the gravity as long as sprite doesn't reach the bottom of the canvas
            this.velocity.y += gravity 
    }
}


class Pipe {
    constructor(width,height,position={},color){
        this.width = width
        this.height = height
        this.position = position
        this.position.y = (canvas.height - ground.height) -this.height // y positon automatically calculated in relation to pipe height
        this.color = color
        this.verticalDeltaDistance = 202.46
    }
    draw(){
        c.fillStyle = this.color
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
    update(){
        this.draw()

        // if the pipe moves out of the canvas(on the left side), spawn it again in right side (the beginning)
        if(this.position.x + this.width <= 0){
            this.position.x = canvas.width + this.width 
            
                       
            //randomize bottom pipe heigth after respawning it, and also adjust position.y
            if (this.constructor.name == 'BottomPipe'){                              
                this.height = generateRandom(62,canvas.height - ground.height - 62 - this.verticalDeltaDistance )
                this.position.y = (canvas.height - ground.height) -this.height
                console.log(this.height)
                
            }

            //adjust upperPipe height accoring to new bottomPipe height
            if (this.constructor.name == 'UpperPipe'){
                this.height = canvas.height - ground.height - correspondingBottomPipe.height - this.verticalDeltaDistance
            }
        }                          

        //update x axis (move to the left)
        this.position.x -= speed
    }

    
    
}

class BottomPipe extends Pipe{
    constructor(width,height,position={},color){
        super(width,height,position,color,position.y)
        this.standbyForCounter = true
    }

    update(plusSpawnDistance = 0){ //plusSpawnDistance parameter is optional
        this.draw() // inherited from father Pipe class

        // respawn
        // if the pipe moves out of the canvas(on the left side), spawn it again in right side (the beginning) - with new height
        if(this.position.x + this.width <= 0){
            this.position.x = plusSpawnDistance // + canvas.width + this.width
                                   
            //randomize bottom pipe height after respawning it                                        
            this.height = generateRandom(62,canvas.height - ground.height - 62 - this.verticalDeltaDistance ) // generateRandom() is a function from the utilities.js file
            // adjust position.y in relation to the height
            this.position.y = (canvas.height - ground.height) -this.height
            //console.log(this.height)
                           
        }                          

        //update x axis (move to the left)
        this.position.x -= speed
    }
    
}

class UpperPipe extends Pipe{
    constructor(width,bottomPipeHeight,position,color,correspondingBottomPipe = {}){
        super(width,color,position)        
        this.correspondingBottomPipe = correspondingBottomPipe
        this.height = canvas.height - ground.height - this.correspondingBottomPipe.height - this.verticalDeltaDistance // the upper pipe height is related to the bottom pipe height
        this.position.y = 0  
 
    }

    update(plusSpawnDistance = 0){
        this.draw() // inherited from father Pipe class

        // respawn
        // if the pipe moves out of the canvas(on the left side), spawn it again in right side (the beginning) - with new height
        if(this.position.x + this.width <= 0){
            this.position.x = plusSpawnDistance // + canvas.width + this.width                                           

            //adjust upperPipe height accoring to new corresponding bottomPipe height            
            this.height = canvas.height - ground.height - this.correspondingBottomPipe.height - this.verticalDeltaDistance            
        }                        

        //update x axis (move to the left)
        this.position.x -= speed
    }
    
}





//document.getElementById('test').innerHTML = 'correct'
//test
c.fillStyle ='red'
c.fillRect(0,0,50,50)