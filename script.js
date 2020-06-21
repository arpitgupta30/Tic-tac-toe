

const cellElements = document.querySelectorAll('[data-cell]')
const x_class = "x"
const circle_class = "circle"
let circleTurn = false
let modeOfPlayer = ""
let board = document.getElementById('board')
let frontPage = document.getElementById('frontPage')
const WINNING_COMBINATION = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
const winningMessageText = document.querySelector('[data-winning-message-text]')
const winningMessage = document.getElementById('winningMessage')

const restartButton = document.getElementById('restartButton')

restartButton.addEventListener('click', restart)

singlePlayerButton.addEventListener('click', singlePlayer)
doublePlayerButton.addEventListener('click', doublePlayer)

function restart(){
    frontPage.classList.remove('hidden')
    board.classList.remove('show')
    winningMessage.classList.remove('show')
}



function singlePlayer(){
    modeOfPlayer = "single"
    start();
}

function doublePlayer(){
    modeOfPlayer = "double"
    start();
}

function start(){
    frontPage.classList.add('hidden')
    board.classList.add('show')
    winningMessage.classList.remove('show')
    cellElements.forEach(cell=>{
        cell.classList.remove(x_class)
        cell.classList.remove(circle_class)
        cell.removeEventListener('click', singleGameHandClick)
        cell.removeEventListener('click', doubleGameHandleClick)
        
    })
    if(modeOfPlayer == "double"){
        cellElements.forEach(cell=>{
            cell.addEventListener('click', doubleGameHandleClick, {once:true})
        })
    }
    if(modeOfPlayer == "single"){
        cellElements.forEach(cell=>{
            cell.addEventListener('click', singleGameHandClick, {once:true})
        })
        findBestMove()
    }
    setBoardHoverClass()
}

function singleGameHandClick(e){
    const cell = e.target
    cell.classList.add(circle_class)
    findBestMove()
    var score = evaluate()
    if(score == 10){
        winningMessageText.innerText = `X has won....`
        winningMessage.classList.add('show')
    }
    else if(isDraw()){
        winningMessageText.innerText = `Its a draw...!!!`
        winningMessage.classList.add('show')
    }    
}

function findBestMove(){
    var maxScore = -1000
    var index = -1
    
    for(var i=0;i<9;i++){
        if(!(cellElements[i].classList.contains(x_class) || cellElements[i].classList.contains(circle_class))){
            cellElements[i].classList.add(x_class)
            var score = minimax(false, Number.MIN_VALUE, Number.MAX_VALUE)
            cellElements[i].classList.remove(x_class)
            if(score>maxScore){
                maxScore = score
                index = i
            }
        }
    }
    cellElements[index].classList.add(x_class)
}


function minimax(isMax, alpha, beta){
    var score = evaluate()
    if(score == 10 || score == -10){
        return score
    }
    if(isDraw()){
        return 0;
    }
    if(isMax){
        var maxScore = Number.MIN_VALUE
        for(var i=0;i<9;i++){
            
            if(!(cellElements[i].classList.contains(x_class) || cellElements[i].classList.contains(circle_class))){
                cellElements[i].classList.add(x_class)
                maxScore = Math.max(maxScore, minimax(!isMax, alpha, beta))
                cellElements[i].classList.remove(x_class)
                alpha = Math.max(alpha, maxScore)
                if (beta<=alpha){
                    break
                }
            }
        }
        return maxScore
    }
    var minScore = Number.MAX_VALUE
    for(var i=0;i<9;i++){
        
        if(!(cellElements[i].classList.contains(x_class) || cellElements[i].classList.contains(circle_class))){
            cellElements[i].classList.add(circle_class)
            minScore = Math.min(minScore, minimax(!isMax, alpha, beta))
            cellElements[i].classList.remove(circle_class)
            beta = Math.min(beta, minScore)
            if(beta<=alpha){
                break
            }
        }
    }
    return minScore
}

function evaluate(){
    for(var i=0;i<8;i++){
        var first = WINNING_COMBINATION[i][0]
        var second = WINNING_COMBINATION[i][1]
        var third = WINNING_COMBINATION[i][2]
        if(cellElements[first].classList.contains(circle_class) && cellElements[second].classList.contains(circle_class) && cellElements[third].classList.contains(circle_class)){
            return -10
        }
        if(cellElements[first].classList.contains(x_class) && cellElements[second].classList.contains(x_class) && cellElements[third].classList.contains(x_class)){
            return 10
        }
    }
    return 0
}

function doubleGameHandleClick(e){
    const cell = e.target
    const currentClass = circleTurn?circle_class:x_class
    placeMark(cell, currentClass)
    if(checkWin(currentClass)){
        endGame(false)
    }
    else if(isDraw()){
        endGame(true)
    }
    else{
        swapTurns()
        setBoardHoverClass()
    }
}

function removeMark(cell, currentClass){
    cell.classList.remove(currentClass)
}

function placeMark(cell, currentClass){
    cell.classList.add(currentClass)
}

function swapTurns(){
    circleTurn = !circleTurn
}

function setBoardHoverClass(){
    board.classList.remove(x_class)
    board.classList.remove(circle_class)
    if(modeOfPlayer == "single"){
        board.classList.add(circle_class)
    }
    else{
        if(circleTurn){
            board.classList.add(circle_class)
        }
        else{
            board.classList.add(x_class)
        }
    }
}

function checkWin(currentClass){
    return WINNING_COMBINATION.some(combination =>{
        return combination.every(index=>{
            return cellElements[index].classList.contains(currentClass)
        })
    })
}

function endGame(isDraw){
    if(isDraw){
        winningMessageText.innerText = `Its a draw...!!`
    }
    else{
        winningMessageText.innerText = `${circleTurn ? "O's" : "X's" } has Won.....`
    }
    winningMessage.classList.add('show')
}


function isDraw(){
    return [...cellElements].every(cell =>{   //doesnt consist of every method hence destructuring it into array
        return cell.classList.contains(x_class)||cell.classList.contains(circle_class)
    })
}