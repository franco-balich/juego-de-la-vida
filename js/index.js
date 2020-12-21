var canvas= document.getElementById('canvas');
var control = document.getElementById("control");
var ctx;
var fps=10;
var ejecucion=false;
var canvasX=700;
var canvasY=700;
var unico=0;
var tileX, tileY;

//Variables relacionadas con el tablero de juego
var tablero;
var filas=50;
var columnas =50;

var blanco='#FFFFFF';
var negro='#000000';
var intervalo;

function creaArray2D(f,c){
    var obj = new Array(f);
    for(y=0; y<f;y++){
        obj[y]= new Array(c);
    }
    return obj;
}

function inicializa(){
    
    const   btnEjecutar=document.getElementById('ejecutar'),
            btnParar=document.getElementById('parar'),
            btnrandom=document.getElementById('random'),
            btnReset=document.getElementById('reiniciar');
    //Asociamos el canvas
    canvas = document.getElementById('canvas');
    ctx=canvas.getContext('2d');

    //Ajustamos el tamaño del canvas
    canvas.width = canvasX;
    canvas.height = canvasY;

    //Caluclamos el tamaño de las celulas
    tileX = Math.floor(canvasX/filas);
    tileY= Math.floor(canvasY/columnas);

    //Creamos el tablero
    tablero = creaArray2D(filas,columnas);

    //Inicializamos el tablero
    inicializaTablero(tablero);

    canvas.addEventListener("click",function(e){
        var coor = showCoords(e);
        
        console.log(coor);
        var columna= Math.floor(coor[0]/tileX);
        var fila= Math.floor(coor[1]/tileY)+1;
        tablero[fila][columna].alternarEstado();

    });
    
    //Ejecutamos el bucle principal
    principal();

    btnEjecutar.addEventListener("click",function(e){
        ejecucion=1;
    });
    btnParar.addEventListener("click",function(e){
        ejecucion=0;
    });
    btnrandom.addEventListener("click",function(e){
        inicializaTableroRandom(tablero);
    });

    btnReset.addEventListener("click",function(e){
        inicializaTableroReset(tablero);
    });
    intervalo=setInterval(()=>{principal()},1000/fps);
    
};



//Agente o Maquina de Turing
var Agente = function(x,y,estado){
    this.x=x;
    this.y=y;
    this.estado=estado;
    this.estadoProx= this.estado;

    this.vecinos=[];

    this.addVecinos = function(){
        var xVecino;
        var yVecino;
        
        for(i=-1;i<2;i++){
            for(j=-1; j<2; j++){
                xVecino=(this.x+j+columnas)%columnas;
                yVecino=(this.y+i + filas)%filas;

                if(i!=0 || j!=0){
                    this.vecinos.push(tablero[yVecino][xVecino]);
                }
            }
        }
    };
    this.dibuja=function(){
        var color;
        if(this.estado==1){
            color=blanco;
        }
        else{
            color=negro;
        }
        ctx.fillStyle =color;
        ctx.fillRect(this.x*tileX, this.y*tileY,tileX,tileY)
        ctx.strokeStyle ="#555555";
        ctx.strokeRect(this.x*tileX, this.y*tileY,tileX,tileY);

        console.log(this.estado);
        console.log("aa");
    };
    //Leyes de conwey
    this.nuevoCiclo=function(){
        var suma=0;
        //Calcularom la cantidad de vecinos
        for(i=0;i<this.vecinos.length;i++){
            suma+=this.vecinos[i].estado;
        }
        //Aplicamos las reglas

        this.estadoProx=this.estado;
        //Muerte
        if(suma<2||suma>3){
            this.estadoProx=0;
        }
        //Nacimiento
        if(suma==3){
            this.estadoProx=1;
        }
    } 
    this.mutacion = function(){
        this.estado=this.estadoProx;
    }
    this.alternarEstado=function(){
        if(this.estado==1){
            this.estado=0;
        }
        else{
            this.estado=1;
        }
        this.dibuja();
    }
}


function inicializaTablero(obj){
    var estado;
    for(y=0;y<filas;y++){
        for(x=0;x<columnas;x++){
            estado=0;
            obj[y][x]= new Agente(x,y,estado);
        }
    }
    for(y=0; y<filas; y++){
        for(x=0; x<columnas; x++){
          obj[y][x].addVecinos();
        }
      }
}
function inicializaTableroRandom(obj){
    var estado;
    for(y=0;y<filas;y++){
        for(x=0;x<columnas;x++){
            estado=Math.floor(Math.random()*2);
            obj[y][x]= new Agente(x,y,estado);
        }
    }
    for(y=0; y<filas; y++){
        for(x=0; x<columnas; x++){
          obj[y][x].addVecinos();
        }
      }
}
function inicializaTableroReset(obj){
    var estado;
    for(y=0;y<filas;y++){
        for(x=0;x<columnas;x++){
            estado=0;
            obj[y][x]= new Agente(x,y,estado);
        }
    }
    for(y=0; y<filas; y++){
        for(x=0; x<columnas; x++){
          obj[y][x].addVecinos();
        }
      }
}

function showCoords(event) {
    var x = event.pageX-20;
    var y = event.pageY-40;
    return coor = [x,y];
  }
function dibujaTablero(obj){
    
    //Dibuja los agentes
    for(y=0;y<filas;y++){
        for(x=0;x<columnas;x++){
            obj[y][x].dibuja();
        }
    }
    //Calcula el siguiente ciclo
    for(y=0;y<filas;y++){
        for(x=0;x<columnas;x++){
            obj[y][x].nuevoCiclo();
        }
    }
    //Aplica la mutacion
    for(y=0;y<filas;y++){
        for(x=0;x<columnas;x++){
            obj[y][x].mutacion();
        }
    }
}

function borrarCanvas(){
    canvas.width=canvas.width;
    canvas.height=canvas.height;
}
function principal(){
    if(unico==0){
        borrarCanvas();
        dibujaTablero(tablero);
        unico=1;
    }
    if(ejecucion==1){
        borrarCanvas();
        dibujaTablero(tablero);
        console.log("Fotograma")
    }
}
