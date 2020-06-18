const cellElements = document.querySelectorAll('[data-cell]')
const x_class = "x"
const circle_class = "circle"
let circleTurn = false
let board = document.getElementById('board')
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

restartButton.addEventListener('click', start)

start()

function start(){
    winningMessage.classList.remove('show')
    cellElements.forEach(cell=>{
        cell.classList.remove(x_class)
        cell.classList.remove(circle_class)
        cell.removeEventListener('click', handleClick)
        
    })
    cellElements.forEach(cell=>{
        cell.addEventListener('click', handleClick, {once:true})
    })
    setBoardHoverClass()
}



function handleClick(e){
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


function placeMark(cell, currentClass){
    cell.classList.add(currentClass)
}

function swapTurns(){
    circleTurn = !circleTurn
}

function setBoardHoverClass(){
    board.classList.remove(x_class)
    board.classList.remove(circle_class)
    if(circleTurn){
        board.classList.add(circle_class)
    }
    else{
        board.classList.add(x_class)
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