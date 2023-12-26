//CSS
import './App.css';

//React
import {useState, useEffect, useCallback } from 'react';

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
const guessesQty = 3

function App() {
  //Criando os estagios do game iniciando no 0 pois é para
  // saber que o jogo esta no stage "start" 
  const [gameStage, setGameStage] = useState(stages[0].name);
  const[words] = useState(wordsList)
  
  const [pickedWord, setPickedWord]=useState("")
  const [pickedCategory, setPickedCategory]=useState("")
  const [letters, setLetters]= useState([])

  const [guessedLetters, setGuessedLetters]=useState([])
  const [wrongLetters, setWrongLetters]=useState([])
  const [guesses, setGuesses]= useState(guessesQty)
  const [score, setScore]= useState(0)

  const pickWordAndCategory = useCallback(() => {
    // escolhendo uma categoria aleatoria
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    // escolhendo uma palavra aleatoria
    const word=
      words[category][Math.floor(Math.random() * words[category].length)]
    
    return {word, category}
  },[words] )


  //start Secret Word 
  const startGame = useCallback(() =>{

    clearLetterStates()
    //escolhendo palavras e categoria
    const {word, category} = pickWordAndCategory()

    // criando um array de letras

    let wordLetters=word.split("")
    wordLetters=wordLetters.map((l) => l.toLowerCase())

    //fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters);


    setGameStage(stages[1].name)
  
  }, [pickWordAndCategory])

  //process the letter input
  const verifyLetter = (letter) =>{
    const normalizedLetter = letter.toLowerCase()

    //Verificando se a letra ja foi utilizada
    if (
      guessedLetters.includes(normalizedLetter) || 
      wrongLetters.includes(normalizedLetter)
    ){
      return;
    }

    //Criando um array com as letras corretas
    if (letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [...actualGuessedLetters,
      normalizedLetter
    ])
    }else{
      //criando um array de letras erradas
      setWrongLetters((actualWrongLetters)=>[
        ...actualWrongLetters,
      normalizedLetter])

      setGuesses((actualGuesses)=>actualGuesses - 1)
    }
  }

  const clearLetterStates = () =>{
    setGuessedLetters([])
    setWrongLetters([])
  }
  //Verificando se as tentativas terminaram
  useEffect(() => {
    if(guesses <= 0){
      //reset all states
      setGameStage(stages[2].name)
    }
  }, [guesses])

  //Verificando se a pessoa venceu o jogo
  useEffect(()=>{
    const uniqueLetters = [...new Set(letters)]

    //condicional de vitoria
    if(guessedLetters.length === uniqueLetters.length){
      //adicionando a pontuação
      setScore((actualScore)=>(actualScore += 100))
      //reiniciando o jogo com uma nova palavra
      startGame()
    }
  }, [guessedLetters, letters, startGame])

  //restarts the Game
  const retry = () => {

    //informando a pontuação do jogo
    setScore(0)

    //definindo a quantidade de tentativas
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }
  return (
    <div className="App">
      {/* O Start Screen aparecerá apenas quando o stage do game for start */}
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && (
        <Game verifyLetter={verifyLetter} 
          pickedWord={pickedWord} 
          pickedCategory={pickedCategory} 
          letters={letters} 
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
