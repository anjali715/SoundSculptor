import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css'; // Import the CSS file
import soundsculptorLogo from './soundsculptor.png'; // Import the logo image
import folderImage from './folder.png';
import WaveSurfer from 'wavesurfer.js';
import PlayButton from './PlayButton';
import PauseButton from './PauseButton';

const App = () => {
  const [audioTracks, setAudioTracks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50); // Initial volume value
  const [longestDuration, setLongestDuration] = useState(0); // State to hold the duration of the longest audio track
  const wavesurferInstances = useRef([]);
  const waveformContainers = useRef([]);
  const progressLineRef = useRef(null); // Reference to the progress line element

  const destroyWaveSurfers = useCallback(() => {
    wavesurferInstances.current.forEach(wavesurfer => wavesurfer.destroy());
  }, []);

  useEffect(() => {
    audioTracks.forEach((track, index) => {
      const containerId = `waveform-${track.id}`;
      const waveformContainer = document.getElementById(containerId);
      waveformContainers.current[index] = waveformContainer;
      const wavesurfer = WaveSurfer.create({
        container: `#${containerId}`,
        waveColor: '#04e69b',
        progressColor: '#02553a',
        cursorColor: 'transparent',
        height: 150,
        barWidth: 2,
        barHeight: 1,
        volume: volume / 100
      });

      wavesurfer.load(track.url);
      wavesurferInstances.current[index] = wavesurfer;

      wavesurfer.on('ready', () => {
        const duration = wavesurfer.getDuration();
        if (duration > longestDuration) {
          setLongestDuration(duration);
          progressLineRef.current.style.height = `${document.querySelector('.audio-tracks').offsetHeight}px`; // Adjust the height of the progress line
        }
        waveformContainer.style.width = `${(duration / longestDuration) * 100}%`;

        // Add click event listener to waveform container
        waveformContainer.addEventListener('click', (event) => {
          const clickPosition = event.offsetX;
          const newTime = wavesurfer.getCurrentTime();

          // Update red progress line position
          progressLineRef.current.style.left = `${clickPosition}px`;

          // Seek all audio tracks to the clicked timestamp
          wavesurferInstances.current.forEach(wavesurfer => {
            wavesurfer.seekTo(newTime / wavesurfer.getDuration());
          });
        });
      });

      wavesurfer.on('play', () => {
        wavesurfer.on('audioprocess', () => {
          const progressPosition = (wavesurfer.getCurrentTime() / wavesurfer.getDuration()) * waveformContainer.offsetWidth;
          progressLineRef.current.style.left = `${progressPosition}px`;
        });
      });
    });

    return destroyWaveSurfers;
  }, [audioTracks, destroyWaveSurfers, volume, longestDuration]);

  const addAudioTrackFromFile = (files) => {
    if (!files || files.length === 0) return;

    const newTracks = Array.from(files).map((file, index) => ({
      id: audioTracks.length + index + 1,
      title: file.name,
      url: URL.createObjectURL(file)
    }));

    setAudioTracks([...audioTracks, ...newTracks]);
  };

  const togglePlayAll = () => {
    setIsPlaying(prevState => !prevState);
  
    wavesurferInstances.current.forEach(wavesurfer => {
      if (!isPlaying && wavesurfer.getCurrentTime() < wavesurfer.getDuration()) {
        wavesurfer.play();
      } else {
        wavesurfer.pause();
      }
    });
  };
  

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
    wavesurferInstances.current.forEach(wavesurfer => wavesurfer.setVolume(event.target.value / 100));
  };

  return (
    <div className="App">
      <div className="header">
        <img src={soundsculptorLogo} alt="Soundsculptor Logo" className="logo" />
        <h1 className="title-text">SOUNDSCULPTOR</h1>
        <div className="headerright">
          <input
            type="range"
            min="1"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
          {isPlaying ? <PauseButton onClick={togglePlayAll} /> : <PlayButton onClick={togglePlayAll} />}

        </div>
      </div>

      <div className="mainportion">
        <div className="file-upload">
          <img src={folderImage} alt="Folder Icon" className="folder-icon" />
          <label htmlFor="music-file" className="upload-label">
            Drop the music to start jamming, or click to select
          </label>
          <input type="file" id="music-file" className="file-input" onChange={(event) => addAudioTrackFromFile(event.target.files)} multiple />
        </div>
      </div>

      <div className="audio-tracks">
        <div className="waveform-container">
          {audioTracks.map((track, index) => (
            <div key={track.id} className="audio-track">
              <div className="track-info">
              </div>
              <div id={`waveform-${track.id}`} className="waveform"></div>
            </div>
          ))}
          <div className="timeline"></div>
          <div ref={progressLineRef} className="progress-line"></div>
        </div>
      </div>

    </div>
  );
}

export default App;
