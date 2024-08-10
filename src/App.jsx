import React from 'react';
import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import FavPoke from './components/FavPoke';
import ReactLoading from 'react-loading';


function App() {
  const [poke, setPoke] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [number, setNumber] = useState(1);
  const [fav, setFav] = useState([]);


  useEffect(() => {
    let abortController = new AbortController();
    
    const loadPoke = async () => {
      try {  

        setLoading(true);
        let response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${number}`, { signal: abortController.signal });

        setPoke(response.data);
        setError("");


      } catch (error) {
        setError("Something went wrong.", error);
      }finally {
        setLoading(false);
      }
    }

    loadPoke();
    

    return () => abortController.abort();

  }, [ number ]);

  console.log(poke);

  const prevPoke = () => {
    setNumber((number) => (number > 1 ? number - 1 : number));
  }

  const nextPoke = () => {
    setNumber((number) => number + 1);
  }

  const addFav = () => {
    setFav((oldState) => [...oldState, poke]);
  }

  console.log("Pokemon ID : ",number);
  console.log("Favorite Pokemon : ",fav);


  return (
    <div className='max-w-5xl p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
      <div className='grid sm:grid-cols1 md:grid-cols-2 lg:grid-cols-2'>
        <div>
          {loading ? 
            <ReactLoading type='spin' color='green' height={'20%'} width={'20%'} />
            : 
            <>
            <div className='justify-center items-center'>
              <h1>{poke?.name}</h1>
              <br />
              <button onClick={addFav}>Add to favorite</button>
              <img src={poke?.sprites?.other?.home?.front_default} alt={poke?.name} />
              <br />
              <ul>
                {poke?.abilities?.map((abil, idx) => (
                  <li key={idx}>{abil.ability?.name}</li>
                ))}
              </ul>
            </div>
              <br />
              <div className='flex space-x-4 justify-center items-center'>
                <button onClick={prevPoke}>Previous</button>
                <button onClick={nextPoke}>Next</button>
              </div>
            </>}
        </div>
        <div>
          <h2 className='text-xl'>Your favorite Pokemon</h2>
          {fav.length === 0 ? <div className='flex h-full justify-center items-center'><p>No favorite Pokemon...</p></div> : null}
          <FavPoke fav={fav} />
        </div>
      </div>
    </div>
  )
}

export default App
