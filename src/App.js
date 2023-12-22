//CSS
import './App.css';

//React
import { useCallback, useEffect, useState } from 'react';

//Importando o arquivo data
import {wordsList} from "./data/words";

//components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id:1, name: "start"},
  {id:2, name: "game"},
  {id:3, name: "end"}
]


function App() {
  //Criando os estagios do game iniciando no 0 pois é para
  // saber que o jogo esta no stage "start" 
  const [gameStage, setGameStage] = useState(stages[0].name);
  const[words] = useState(wordsList)
  
  const [pickedWord, setPickedWord]=useState("")
  const [pickedCategory, setPickedCategory]=useState("")
  const [letters, setLetters]= useState([])

  const pickWordAndCategory = () => {
    // escolhendo uma categoria aleatoria
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    console.log (category)


    // escolhendo uma palavra aleatoria
    const word=
      words[category][Math.floor(Math.random() * words[category].length)]

      console.log(word)
    
    return {word, category}
  }


  //start Secret Word 
  const startGame = () =>{
    //escolhendo palavras e categoria
    const {word, category} = pickWordAndCategory()

    // criando um array de letras

    let wordLetters=word.split("")
    wordLetters=wordLetters.map((l) => l.toLowerCase())

    console.log(word, category)
    console.log(wordLetters)

    //fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(letters);


    setGameStage(stages[1].name)
  
  }
  //process the letter input
  const verifyLetter = () =>{
    setGameStage(stages[2].name)
  }

  //restarts the Game
  const retry = () => {
    setGameStage(stages [0].name)
  }



  return (
    <div className="App">
      {/* O Start Screen aparecerá apenas quando o stage do game for start */}
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && <Game verifyLetter={verifyLetter}/>}
      {gameStage === "end" && <GameOver retry={retry}/>}
    </div>
  );
}

export default App;
