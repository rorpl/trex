(function () {

    const FPS = 480;

    const PROB_NUVEM = 8;
    const PROB_CACT = 8;
    const PROB_B_CACT = 8;
    const PROB_PASSARO = 8;
    const MAX_TAM_BUFFER = 240;

    var gameLoop;
    var deserto;
    var dino;

    var nuvens = [];
    var cactos = [];
    var bigCactos = [];
    var passaros = [];
    var scores = [];

    const CORRENDO = 0;
    const SUBINDO = 1;
    const DESCENDO = 2;
    const AGACHADO = 3;
    
    let Paused = false;
    let rcount = 0;
    let creation_buffer = 0;
    let creation_lock = false;
    let score = 0;
    let frames = 0;
    let start = false;
    var velocidade = 1;

    function getRndIntNumber( ini , fim){
        return Math.floor(Math.random()*(fim - ini) + ini);
    }

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
            'agachado2':'-1000px',
            'morto': '-899px'
        };
        this.status = 0; 
        this.alturaMaxima = "100px";
        this.element = document.createElement("div");
        this.element.className = "dino";
        this.element.style.backgroundPositionX = this.sprites.correr1;
        this.element.style.bottom = "0px";
        deserto.element.appendChild(this.element);
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

    function Nuvem () {
        this.element = document.createElement("div");
        this.element.className = "nuvem";
        
        this.element.style.right = "0px";
        this.element.style.top = Math.floor(Math.random()*120) + "px";
        deserto.element.appendChild(this.element);
    }

    Nuvem.prototype.mover = function () {
        this.element.style.right = (parseInt(this.element.style.right) + velocidade) + "px";
        
    }

    function Cacto( right ){
        this.element = document.createElement("div");
        this.element.className = "cacto";
        this.element.style.right = right + "px";
        this.element.style.bottom = "0px";
        deserto.element.appendChild(this.element);
    }

    Cacto.prototype.mover = function(){
        this.element.style.right = (parseInt(this.element.style.right) + velocidade) + "px";
    }

    function BigCacto(){
        this.element = document.createElement("div");
        this.element.className = "bigCacto";
        this.element.style.right = "10px";
        this.element.style.bottom = "0px";
        deserto.element.appendChild(this.element);
    }

    BigCacto.prototype.mover = function(){
        this.element.style.right = (parseInt(this.element.style.right) + velocidade) + "px";
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
        this.element.style.right = (parseInt(this.element.style.right) + velocidade) + "px";
    }

    var score_sprites = [
        "-484px",
        "-495px",
        "-504px",
        "-513px",
        "-524px",
        "-534px",
        "-544px",
        "-554px",
        "-564px",
        "-574px"
    ]

    function getRightMargin( score ){
        var str = (10 + (14 * score)).toString();
        return str + "px";
    }

    function Score( position , score ){
        this.element = document.createElement("div");
        this.element.className = "score";
        this.element.style.right = getRightMargin(position);
        this.element.style.top = "10px";
        this.element.style.backgroundPositionX = score_sprites[score];

        deserto.element.appendChild(this.element);
    }


    function detectColisions(){

        cactos.forEach( (c)=>{
            if( parseInt(c.element.style.right) > 465 && parseInt(c.element.style.right) < 490 && parseInt(dino.element.style.bottom) < 35){
                console.log("COLIDIU CACTO" + dino.element.style.bottom);
                endGame();
            }
        });

        bigCactos.forEach( (bc)=>{
            if( parseInt(bc.element.style.right) > 465 && parseInt(bc.element.style.right) < 490 && parseInt(dino.element.style.bottom) < 50){
                console.log("COLIDIU BIG CACTO" + dino.element.style.bottom);
                endGame();
            }
        });

        passaros.forEach( (p)=>{

            let iniDino = 0;
            let endDino = 0;
            if( dino.status == AGACHADO){
                iniDino = parseInt(dino.element.style.bottom);
                endDino = parseInt( dino.element.style.bottom) + 30;
            }
            else{
                iniDino = parseInt(dino.element.style.bottom);
                endDino = parseInt( dino.element.style.bottom) + 30;
            }
            
            let iniPassaro = parseInt(p.element.style.bottom);
            let endPassaro = parseInt(p.element.style.bottom) + 33;

            if( parseInt(p.element.style.right) > 455 && parseInt(p.element.style.right) < 500 ){
                console.log("PASSSARO NA AREA ");
                if( (iniDino < iniPassaro && endDino > iniPassaro) || ( iniPassaro < iniDino && endPassaro > iniDino)){
                    console.log("COLIDIU PASSARO" + dino.element.style.bottom);
                    endGame();
                }
            }
        });

        return false;
    }

    function printScores(){
        let scoreStr = score.toString();
        let tam = scoreStr.length;

        let add = "";

        $( "div" ).remove( ".score" );

        for( var x = 0 ; x < (5 - tam) ; x++){
            add = add + "0";
        }

        var str = add + scoreStr;
        
        for(var i = 0 ; i < str.length ; i++){
            var scr = new Score( 4 - i , str[i]);
        }
    }

    function endGame(){
        console.log("END GAME");
        cleanAssets();

        start = false;

        $( "div" ).remove( ".deserto" );
        $( "div" ).remove( ".chao" );
        $( "div" ).remove( ".score" );

        clearInterval(gameLoop);

        deserto = new Deserto();
        dino = new Dino();

        cactos = [];
        bigCactos = [];
        passaros = [];
        nuvens = [];

        Paused = false;
        rcount = 0;
        creation_buffer = 0;
        creation_lock = false;
        score = 0;
        frames = 0;
        start = false;
        velocidade = 1;

        //dino.element.style.backgroundPositionX = Dino.sprites.morto;
    }

    function run () {

        if( !Paused){
            frames++;
            dino.correr();
            deserto.mover();

            if( frames%30 == 0){
                score++;
            }

            if( frames%1000 == 0){
                velocidade = velocidade + 0.1;
            }
            //console.log("score: " + score);

            if (getRndIntNumber(0 , 5000) <= PROB_NUVEM) {
                nuvens.push(new Nuvem());
                creation_lock = true;
                creation_buffer = 0;
            }

            console.log(velocidade);
            printScores();

            if( !creation_lock){
                
                if(getRndIntNumber(0 , 5000) <= PROB_CACT){

                    let number_of_cactos = getRndIntNumber(0,4);

                    number_of_cactos++;

                    cactos.push( new Cacto("10"));

                    if( number_of_cactos > 1)
                        cactos.push( new Cacto("29"));
                    
                    if( number_of_cactos > 2)
                        cactos.push( new Cacto("48"));
                    
                    if( number_of_cactos > 3)
                        cactos.push( new Cacto("67"));

                    creation_lock = true;
                    creation_buffer = 0;
                    console.log("cacto");
                }
                else if(getRndIntNumber(0 , 5000) <= PROB_B_CACT){

                    bigCactos.push( new BigCacto());
                    creation_lock = true;
                    creation_buffer = 0;
                    console.log("big cacto");
                }
                else if(getRndIntNumber(0 , 5000) <= PROB_PASSARO){
                    passaros.push( new Passaro());
                    creation_lock = true;
                    creation_buffer = 0;
                    console.log("passaro");
                }
            }
            else{
                creation_buffer++;

                if(creation_buffer == MAX_TAM_BUFFER){
                    creation_lock = false;
                }
            }
            
            
            nuvens.forEach( (n) => {
                n.mover();
            });

            cactos.forEach( (c) =>{
                c.mover();
            });

            bigCactos.forEach( (bc) =>{
                bc.mover();
            });

            passaros.forEach( (p)=>{
                p.mover();
            });

            rcount++;
            if( rcount % 50 == 0){
                cleanAssets();
                rcount = 0;
            }
            var col = detectColisions();
            if( col ){
                endGame();
                console.log("ACABOU");
            }

            //Em caso de game over
            //clearInterval(gameLoop);
        }
        
    }

    window.addEventListener("keydown", function (e) {

        if (e.key == "ArrowUp" && dino.status== CORRENDO){
            dino.status = SUBINDO;
        } 

        if( e.key == "ArrowDown" && dino.status == CORRENDO ){
            dino.status = AGACHADO;

            dino.element.style.width = "61px";
            dino.element.style.height = "30px";
            dino.element.style.backgroundPositionY = "-20px";
        }

        if( e.key == "p"){
            Paused = !Paused;
        }

        if( !start && e.key == "ArrowUp"){
            start = true;
            init();
        }

        if( e.key == "Enter"){
            console.log("ENTER");
        }
    });

    window.addEventListener( "keyup" , function (e){
        if( dino.status == AGACHADO){
            dino.status = CORRENDO;

            dino.element.style.width = "45px";
            dino.element.style.height = "45px";
            dino.element.style.backgroundPositionY = "-3px";
        }
    });

    
    function init () {
        
        score = 0;
        frames = 0;
        gameLoop = setInterval(run, 1000/FPS);
        //cleanLoop = setInterval( cleanAssets , 4000);
    }

    deserto = new Deserto();
    dino = new Dino();
})();