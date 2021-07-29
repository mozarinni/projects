import React, {useState, useRef} from 'react';
//Import styles
import "./styles/app.scss"
//Adding components
import Player from './components/Player';
import Song from './components/Song';
import Library from './components/Library';
import Nav from './components/nav';
//Import utils
import data from './data'


function App() {
  //Ref
  const audioRef = useRef(null);
  //State
  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });

  const [libraryStatus, setLibraryStatus] = useState(false);

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    //Calculate Percentage
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animationPercentage = Math.round(roundedCurrent / roundedDuration * 100);
    setSongInfo({...songInfo, currentTime: current, duration, animationPercentage })
  };

  const songEndHandler = async (e) => {
    let currentIndex = songs.findIndex((song) => song.id ===currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);  
    if(isPlaying) audioRef.current.play();
  }

  return (
    <div className={`App ${libraryStatus ? 'library-active' : ""}`}>
      <Nav
        libraryStatus={libraryStatus}
        setLibraryStatus={setLibraryStatus}/>
      <Song currentSong={currentSong}/>
      <Player 
        audioRef={audioRef}
        isPlaying={isPlaying}  
        setIsPlaying={setIsPlaying} 
        currentSong={currentSong}
        setSongInfo={setSongInfo}
        songInfo={songInfo}
        songs={songs}
        setCurrentSong={setCurrentSong}
        setSongs={setSongs}/>
      <Library 
        audioRef={audioRef} 
        songs={songs} 
        setCurrentSong={setCurrentSong}
        isPlaying={isPlaying}
        setSongs={setSongs}
        libraryStatus={libraryStatus}/>
      <audio 
        ref={audioRef} 
        onTimeUpdate={timeUpdateHandler} 
        onLoadedMetadata={timeUpdateHandler} 
        src={currentSong.audio}
        onEnded={songEndHandler}></audio>
    </div>
  );
}

export default App;
