import './App.css'
import GameBoard from './components/GameBoard/GameBoard';

function App() {

  return (
    <>
      <div className="bg-gray-100 dark:bg-neutral-800 flex items-center justify-center flex-col p-5 pb-10 pt-10 md:p-10 md:pb-15 flex-grow rounded-3xl shadow-xl overflow-auto relative">
        <GameBoard />
      </div>
    </>
  )
}

export default App;
