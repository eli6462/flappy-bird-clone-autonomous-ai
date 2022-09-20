
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

class Sensor{
    constructor(bird){
        this.bird=bird;
        this.rayCount=5;
        this.rayLength=150;
        this.raySpread=(Math.PI/2);

        this.rays=[];
        this.readings=[];
    }
    update(ground,pipes=[]){
        this.#castRays();
        this.draw();
        /*
        this.readings=[];
        for(let i=0;i<this.rays.length;i++){
            this.readings.push(
                this.#getReading(
                    this.rays[i],
                    roadBorders,
                    traffic
                )
            );
        }
        */
    }

    #getReading(ray,ground,pipes){
        let touches=[];
        
        // intersection with the ground        
        const touch=getIntersection(
            ray[0],
            ray[1],
            roadBorders[i][0],
            roadBorders[i][1]
        );
        if(touch){
            touches.push(touch);
        }
        

        for(let i=0;i<traffic.length;i++){
            const poly=traffic[i].polygon;
            for(let j=0;j<poly.length;j++){
                const value=getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j+1)%poly.length]
                );
                if(value){
                    touches.push(value);
                }
            }
        }

        if(touches.length==0){
            return null;
        }else{
            const offsets=touches.map(e=>e.offset);
            const minOffset=Math.min(...offsets);
            return touches.find(e=>e.offset==minOffset);
        }
    }

    #castRays(){
        this.rays=[];
        for(let i=0;i<this.rayCount;i++){
            const rayAngle=lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount==1?0.5:i/(this.rayCount-1)
            ) 
            - Math.PI/2
            ;

            const start={
                x:this.bird.position.x + this.bird.width,
                y:this.bird.position.y + (this.bird.height/2)
            };
            const end={
                x:start.x - Math.sin(rayAngle)*this.rayLength,                    
                y:start.y - Math.cos(rayAngle)*this.rayLength                    
            };
            this.rays.push([start,end]);
        }
    }

    // called inside the update function 
    // - because it has to be syncronally called after the #castrays function (that is called inside update fucntion),
    // the #castRays function initiates the rays array with rays, which are used in the draw function
    draw(){
        for(let i=0;i<this.rayCount;i++){
            let end=this.rays[i][1];
            if(this.readings[i]){
                end=this.readings[i];
            }

            c.beginPath();
            c.lineWidth=2;
            c.strokeStyle="yellow";
            c.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            c.lineTo(
                end.x,
                end.y
            );
            c.stroke();
            /*
            // draw black part
            c.beginPath();
            c.lineWidth=2;
            c.strokeStyle="black";
            c.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            c.lineTo(
                end.x,
                end.y
            );
            c.stroke();
            */
        }
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

        this.sensor = new Sensor(this);
    }
    draw(){
        c.fillStyle = flappy.color
        c.fillRect(flappy.position.x,flappy.position.y,flappy.width,flappy.height)
        //if(this.sensor === undefined) {return}
        //this.sensor.draw();
    }
    update(){
        this.draw()
        // update the sensor
        this.sensor.update(ground,[])

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
//c.fillStyle ='red'
//c.fillRect(0,0,50,50)