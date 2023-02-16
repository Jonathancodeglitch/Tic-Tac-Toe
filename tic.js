//contents board items

const GameBoard=(function(){
        let board=['X','O','X','O','X','O','X','O','X'];
        //boards
        let b1= document.querySelector(".b1")
        let b2= document.querySelector(".b2")
        let b3= document.querySelector(".b3")
        let b4= document.querySelector(".b4")
        let b5= document.querySelector(".b5")
        let b6= document.querySelector(".b6")
        let b7= document.querySelector(".b7")
        let b8= document.querySelector(".b8")
        let b9= document.querySelector(".b9")
        
        //write a function that would render the board array to the dom
            //build a function that allows players to add their make to a specific spot on the board 
            //dont forget to add the logic of not playing in a spot that has already been played on
        let  count=0;

            const display=(e)=>{ 
            e.target.innerHTML=board[count];
            
            count++
                    if(count>=board.length){
                        ties()
                    }
                    checkRow()
                    checkColumn()  
                    checkdiagonal()
                
            }

        


        //build a logic to check for when the game is a win
        //check rows
        const checkRow=()=>{
            //checks rows for x
            if(b1.innerHTML=='X' && b2.innerHTML=='X' && b3.innerHTML=='X'){
                styleBoard(b1,b2,b3)
                displayWinner.win(playerone.info())
            }
            else if(b4.innerHTML=='X' && b5.innerHTML=='X' && b6.innerHTML=='X'){
                styleBoard(b4,b5,b6)
                displayWinner.win(playerone.info())
            
            }
            else if(b7.innerHTML=='X' && b8.innerHTML=='X' && b9.innerHTML=='X'){
                styleBoard(b7,b8,b9)
                displayWinner.win(playerone.info())
            
            }
            //checks rows for o
            if(b1.innerHTML=='O' && b2.innerHTML=='O' && b3.innerHTML=='O'){
                styleBoard(b1,b2,b3)
                displayWinner.win(playertwo.info())
            
            }
            else if(b4.innerHTML=='O' && b5.innerHTML=='O' && b6.innerHTML=='O'){
                styleBoard(b4,b5,b6)
                displayWinner.win(playertwo.info())
            
            }
            else if(b7.innerHTML=='O' && b8.innerHTML=='O' && b9.innerHTML=='O'){
                styleBoard(b7,b8,b9)
                displayWinner.win(playertwo.info())
            
            }
        
        }
        //check column
        const checkColumn=()=>{
                    //check columns x
                    if(b1.innerHTML=='X' && b4.innerHTML=='X' && b7.innerHTML=='X'){
                        styleBoard(b1,b4,b7)
                        displayWinner.win(playerone.info())
                    
                    }
                    else if(b2.innerHTML=='X' && b5.innerHTML=='X' && b8.innerHTML=='X'){
                        styleBoard(b2,b5,b8)
                        displayWinner.win(playerone.info())
                    
                    }
                    else if(b3.innerHTML=='X' && b6.innerHTML=='X' && b9.innerHTML=='X'){
                        styleBoard(b3,b6,b9);
                        displayWinner.win(playerone.info())
                    
                    }

        // check for column for o
                if(b1.innerHTML=='O' && b4.innerHTML=='O' && b7.innerHTML=='O'){
                    styleBoard(b1,b4,b7);
                    displayWinner.win(playertwo.info());
                    return true
                    }
                    else if(b2.innerHTML=='O' && b5.innerHTML=='O' && b8.innerHTML=='O'){
                        styleBoard(b2,b5,b8);
                        displayWinner.win(playertwo.info());
                
                    }
                    else if(b3.innerHTML=='O' && b6.innerHTML=='O' && b9.innerHTML=='O'){
                        styleBoard(b3,b6,b9);
                        displayWinner.win(playertwo.info());
                    
                    }
                
        }

        //check diagonal
        const checkdiagonal=()=>{
                    //check diagonal x
                    if(b1.innerHTML=='X' && b5.innerHTML=='X' && b9.innerHTML=='X'){
                        styleBoard(b1,b5,b9);
                        displayWinner.win(playerone.info());
                        
                    }
                    else if(b3.innerHTML=='X' && b5.innerHTML=='X' && b7.innerHTML=='X'){
                        styleBoard(b3,b5,b7);
                        displayWinner.win(playerone.info());
                    
                    }
        

                // check for column for o
                        if(b1.innerHTML=='O' && b5.innerHTML=='O' && b9.innerHTML=='O'){
                            styleBoard(b1,b5,b9);
                            displayWinner.win(playertwo.info());
                            
                            }
                            else if(b3.innerHTML=='O' && b5.innerHTML=='O' && b7.innerHTML=='O'){
                                styleBoard(b3,b5,b7);
                                displayWinner.win(playertwo.info());
                            
                            }
                        
                
        }
        //build a logic to check for a tie
        
        const ties=()=>{
        if(checkColumn()!==true || checkRow()!==true || checkdiagonal()!==true){
            displayWinner.win(`its a Draw`)
        };
        
        }

        //when a game is won outline the win
        const styleBoard=(a,b,c)=>{
            const color=`#383737 `
            a.style.backgroundColor = color;
            b.style.backgroundColor = color;
            c.style.backgroundColor = color;
        }

        // build a button to restart the game
        const restart=()=>{
                    count=0
                    document.querySelectorAll('.box').forEach(box=>{
                        box.innerHTML=''
                        box.style.backgroundColor ='transparent';
                        document.querySelectorAll('.box').forEach(box=>{
                            box.addEventListener("click",GameBoard.display,{once:true})
                    });
                });
        };



return {
     display,
     restart
}

  
})()


 //allow user to input there name
 //getting inputted name with localstorage
 

//player obj
 const Player=(name)=>{
    let Name=name;
     //first letter to uppercase
    const capitalized = Name.charAt(0).toUpperCase() + Name.slice(1).toLowerCase();
    const info=()=>`The Winner is <br> <span>${capitalized}</span>`;

    return{info}
 }
   let playNames;
 if(JSON.parse(localStorage.getItem('player'))){
     playNames=JSON.parse(localStorage.getItem('player'))
    
 }
 const playerone=Player(playNames.playerone);
 const playertwo=Player(playNames.playertwo);



  //congratulate the winner by the inputered name
const displayWinner=(()=>{

    const modalContent= document.querySelector('.display-wins');
    const container=document.querySelector('.container');
     const modal=document.querySelector(".modal");
     const playerTwo=document.querySelector('.player-two')
     const playerOne=document.querySelector('.player-one')
       //displayer winner
     const win=(mark)=>{
         container.classList.add('blur')
        modal.classList.add('open-modal');
        modalContent.innerHTML=mark
    };
//onclick remove modal and restart game
    const removeWinner=()=>{
        GameBoard.restart()
        container.classList.remove('blur');
        modal.classList.remove('open-modal')
    };
// getting player names with localstorage
    const playerName=(e)=>{
      
        if(playerTwo.value==="" || playerOne.value===""){
            e.preventDefault()
            alert("PLEASE INPUT YOUR NAMES");
        }
       
        localStorage.setItem('player',JSON.stringify({playerone:playerOne.value,playertwo:playerTwo.value}));
    };

    return{
        win,
        removeWinner,
        playerName
    }
})()

//add events
let box=document.querySelectorAll('.box').forEach(box=>{
      box.addEventListener("click",GameBoard.display,{once:true})
})

let restartBtn=document.querySelector('.restart')
if(restartBtn){
    restartBtn.addEventListener('click',GameBoard.restart)
}

let modal=document.querySelector('.modal');

    if(modal){
        modal.addEventListener('click',displayWinner.removeWinner)
    }


    const start=document.querySelector('.start');
if(start){
    start.addEventListener('click',displayWinner.playerName)
}


