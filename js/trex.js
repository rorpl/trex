(function () {

    const FPS = 200;

    const PROB_NUVEM = 4;
    const PROB_CACT = 3;
    const PROB_B_CACT = 2;
    const PROB_PASSARO = 1;

    var gameLoop;
    var deserto;
    var dino;

    var nuvens = [];
    var cactos = [];
    var bigCactos = [];
    var passaros = [];

    const CORRENDO = 0;
    const SUBINDO = 1;
    const DESCENDO = 2;
    const AGACHADO = 3;
    
    let rcount = 0;

    function getRndIntNumber( ini , fim){
        return Math.floor(Math.random()*(fim - ini) + ini);
    }

    function Deserto () {
        this.element = document.createElement("div");
        this.element.className = "deserto";
        document.body.appendChild(this.element);

        this.chao = document.createElement("div");
        this.chao.className = "chao";
        this.chao.style.backgroundPositionX = "0px";
        this.element.appendChild(this.chao);
    }

    Deserto.prototype.mover = function() {
        this.chao.style.backgroundPositionX = (parseInt(this.chao.style.backgroundPositionX) - 1) + "px";
    }

    function Dino () {
        this.sprites = {
            'correr1':'-766px',
            'correr2':'-810px',
            'pulando':'-678px',
            'agachado': '-941px',
            'agachado2':'-1000px'
        };
        this.status = 0; 
        this.alturaMaxima = "100px";
        this.element = document.createElement("div");
        this.element.className = "dino";
        this.element.style.backgroundPositionX = this.sprites.correr1;
        this.element.style.bottom = "0px";
        deserto.element.appendChild(this.element);
    }   

    function Nuvem () {
        this.element = document.createElement("div");
        this.element.className = "nuvem";
        
        this.element.style.right = "0px";
        this.element.style.top = Math.floor(Math.random()*120) + "px";
        deserto.element.appendChild(this.element);
    }

    function Cacto(){
        this.element = document.createElement("div");
        this.element.className = "cacto";
        this.element.style.right = "10px";
        this.element.style.bottom = "0px";
        deserto.element.appendChild(this.element);
    }

    Cacto.prototype.mover = function(){
        this.element.style.right = (parseInt(this.element.style.right) + 1) + "px";
    }

    function BigCacto(){
        this.element = document.createElement("div");
        this.element.className = "bigCacto";
        this.element.style.right = "10px";
        this.element.style.bottom = "0px";
        deserto.element.appendChild(this.element);
    }

    BigCacto.prototype.mover = function(){
        this.element.style.right = (parseInt(this.element.style.right) + 1) + "px";
    }

    function Passaro(){
        this.element = document.createElement("div");
        this.element.className = "passaro";
        this.element.style.right = "10px";
        this.element.style.bottom = "45px";

        let x = getRndIntNumber(0 , 4);

        if( x == 0){
            this.element.style.bottom = "10px";
        }
        else if( x == 1){
            this.element.style.bottom = "40px";
        }
        else{
            this.element.style.bottom = "55px";
        }

        deserto.element.appendChild(this.element);
    }

    Passaro.prototype.mover = function(){
        this.element.style.right = (parseInt(this.element.style.right) + 1) + "px";
    }

    Dino.prototype.correr = function () {
        if (this.status == CORRENDO) {
            this.element.style.backgroundPositionX = (this.element.style.backgroundPositionX == this.sprites.correr1)?this.sprites.correr2:this.sprites.correr1;
        }
        else if (this.status == SUBINDO ) {
            this.element.style.backgroundPositionX = this.sprites.pulando;
            this.element.style.bottom = (parseInt(this.element.style.bottom) + 1) + "px";
            if (this.element.style.bottom == this.alturaMaxima) this.status = 2;
        }
        else if (this.status == DESCENDO) {
            this.element.style.bottom = (parseInt(this.element.style.bottom) - 1) + "px";
            if (this.element.style.bottom == "0px") this.status = 0;
        }
        else if( this.status == AGACHADO){
            this.element.style.backgroundPositionX = (this.element.style.backgroundPositionX == this.sprites.agachado)?this.sprites.agachado2:this.sprites.agachado;
        }
    }

    Nuvem.prototype.mover = function () {
        this.element.style.right = (parseInt(this.element.style.right) + 1) + "px";
        
    }

    function run () {
        dino.correr();
        deserto.mover();
        if (getRndIntNumber(0 , 1500) <= PROB_NUVEM) {
            nuvens.push(new Nuvem());
        }

        if(getRndIntNumber(0 , 2000) <= PROB_CACT){
            cactos.push( new Cacto());
        }

        if(getRndIntNumber(0 , 2000) <= PROB_B_CACT){
            bigCactos.push( new BigCacto());
        }

        if(getRndIntNumber(0 , 1000) <= PROB_PASSARO){
            passaros.push( new Passaro());
        }

        nuvens.forEach( (n , i) => {
            n.mover();
        });

        cactos.forEach( ( c , i) =>{
            c.mover();
        });

        bigCactos.forEach( ( bc , i) =>{
            bc.mover();
        });

        passaros.forEach( ( p , i)=>{
            p.mover();
        });

        cleanAssets();

        rcount++;
        if( rcount % 3000 == 0){
            cleanAssets();
            rcount = 0;
        }
        //Em caso de game over
        //clearInterval(gameLoop);
    }

    window.addEventListener("keydown", function (e) {

        if (e.key == "ArrowUp" && dino.status== CORRENDO){
            dino.status = SUBINDO;
        } 

        if( e.key == "ArrowDown" && dino.status == CORRENDO ){
            dino.status = AGACHADO;

            dino.element.style.width = "61px";
            dino.element.style.height = "51px";
            
            
        }
    });

    window.addEventListener( "keyup" , function (e){
        if( dino.status == AGACHADO){
            dino.status = CORRENDO;

            dino.element.style.width = "45px";
            dino.element.style.height = "45px";
        }
    });

    function cleanNuvens(){

        let toRemove = [];

        $( "div" ).remove( ".nuvem" );

        nuvens.forEach( ( n , i)=>{
            if( parseInt(n.element.style.right) < 600){
                deserto.element.appendChild(n.element);
            }
            else{
                toRemove.push(i);
            }
        });

        toRemove.forEach( ( item , i)=>{
            nuvens.splice(i , 1);
        });
    }

    function cleanCactos(){
        let toRemove = [];

        $( "div" ).remove( ".cacto" );

        cactos.forEach( ( c , i)=>{
            if( parseInt(c.element.style.right) < 600){
                deserto.element.appendChild(c.element);
            }
            else{
                toRemove.push(i);
            }
        });

        toRemove.forEach( ( item , i)=>{
            cactos.splice(i , 1);
        });
    }

    function cleanBigCactos(){
        let toRemove = [];

        $( "div" ).remove( ".bigCacto" );

        bigCactos.forEach( ( bc , i)=>{
            if( parseInt(bc.element.style.right) < 600){
                deserto.element.appendChild(bc.element);
            }
            else{
                toRemove.push(i);
            }
        });

        toRemove.forEach( ( item , i)=>{
            bigCactos.splice(i , 1);
        });
    }
    function cleanPassaros(){
        let toRemove = [];

        $( "div" ).remove( ".passaro" );

        passaros.forEach( ( p , i)=>{
            if( parseInt(p.element.style.right) < 600){
                deserto.element.appendChild(p.element);
            }
            else{
                toRemove.push(i);
            }
        });

        toRemove.forEach( ( item , i)=>{
            passaros.splice(i , 1);
        });
    }

    function cleanAssets(){
        cleanCactos();
        cleanNuvens();
        cleanBigCactos();
        cleanPassaros();

        console.log("limpou");
    }
    function init () {
        deserto = new Deserto();
        dino = new Dino();
        gameLoop = setInterval(run, 1000/FPS);
        //cleanLoop = setInterval( cleanAssets , 4000);
    }
    init();
})();