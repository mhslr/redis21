import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {Redirect, useParams} from 'react-router-dom';

import MovieTile from '../components/MovieTile';
import {putCollection, delCollection} from '../actions/Actions'

import {CollectionsContext} from '../App'


const RenameModal = ({cb, setVis}) => {
  const [value, setValue] = useState('');
  const onSubmit = (e) => {
    cb(value)
    setVis(false)
  }
  const onCancel = (e) => {
    setVis(false)
  }
  return (
    <div class="Modal" onClick={onCancel}>
      <div onClick={e => e.stopPropagation()}>
        <p>Rename it</p>
        <form onSubmit={onSubmit}>
          <input onChange={e =>
          setValue(e.target.value)}/>
          <div>
          <button onClick={onSubmit}>submit</button>
          <button onClick={onCancel}>cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}



// TODO load from a collection
export default function SomeCollection({update}) {
  const {cid} = useParams();
  const [info, setInfo] = useState('loading')
  const [movies, setMovies] = useState('loading')
  const [renvis, setRenvis] = useState(false);
  const cols = useContext(CollectionsContext);

  const upd = () => {
    axios.get(`/api/collections/${cid}`)
      .then(res => {
        const {info, movies} = res.data;
        setInfo(info);
        setMovies(movies)
      })
  }
  const rename = (name) => {
    const newInfo = {...info, name}
    putCollection(cid, newInfo)
      .then(update)
    setInfo(newInfo)
  }

  useEffect(upd, [cid])


  if (movies === 'loading') {
    return <h1>Loading</h1>
  }

  if (info === null) {
    return <Redirect to="/home" />
  }

  const content = (movies.length === 0
    ? <p>Empty... search for some movies!</p>
    : <div className="result-grid">
      {movies.map((m,i) => <MovieTile key={i} movie={m}/>)}
    </div>
  )

  return (
    <>
      <h1>Collection {info?.name}</h1>
      {(cols.some(c => c.id === cid)) && 
      <div style={{marginBottom: "1em"}}>
        <button onClick={() => setRenvis(true)}>
          rename
        </button>
        <button onClick={() =>
            delCollection(cid)
              .then(update)
              .then(() => setInfo(null))}>
          delete
        </button>
      </div>
      }
      {content}
      {renvis && <RenameModal
        setVis={setRenvis}
        cb={rename} />}
    </>
  )
}
