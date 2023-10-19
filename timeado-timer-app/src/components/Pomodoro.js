import React, { Component } from 'react';
import '../pomodoro.css'; // Import the CSS file
// Import your images
import workImage from '../assets/work.png';
import breakImage from '../assets/break.png';
import completedImage from '../assets/completed.png';
import defaultImage from '../assets/smile.png';
import notifAudio from '../assets/notification.mp3'; // Replace with the actual path to your work audio file
import celebrateAudio from '../assets/completed-sound.mp3'; // Replace with the actual path to your break audio file


class Pomodoro extends Component {
    constructor(props) {
        super(props);
        this.state = {
          workTime: 25 * 60,      // Initial work time in seconds (25 minutes)
          breakTime: 5 * 60,      // Initial break time in seconds (5 minutes)
          intervals: 4,           // Initial number of intervals (sessions)
          currentInterval: 1,     // Current interval in the session
          isWorking: true,        // Indicates whether it's work time or break time
          isRunning: false,
          time: 25 * 60,          // Initial time in seconds
          showMessage: false,     // Flag to display the finished message
          imageSrc: defaultImage,
          isFullScreen: false,
          notifAudio: new Audio(notifAudio),
          celebrateAudio: new Audio(celebrateAudio),
        };
      }
    
      toggleFullScreen = () => {
        const timerElement = this.timerElement;
      
        if (!timerElement) return; // Ensure the timer element exists
      
        if (
          !document.fullscreenElement &&
          !document.mozFullScreenElement &&
          !document.webkitFullscreenElement &&
          !document.msFullscreenElement
        ) {
          // Enter fullscreen mode
          if (timerElement.requestFullscreen) {
            timerElement.requestFullscreen();
          } else if (timerElement.mozRequestFullScreen) {
            timerElement.mozRequestFullScreen();
          } else if (timerElement.webkitRequestFullscreen) {
            timerElement.webkitRequestFullscreen();
          } else if (timerElement.msRequestFullscreen) {
            timerElement.msRequestFullscreen();
          }
        } else {
          // Exit fullscreen mode
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
      };
      
      

      // Function to update the image source based on the timer state and timerStarted
      updateImageSrc = () => {
        const { isWorking, timerStarted, isRunning } = this.state;

        if (!timerStarted || !isRunning) {
          // If the timer hasn't started, use the default image
          this.setState({ imageSrc: defaultImage });
        } else {
          // If the timer has started, use the work or break image based on the state
          const imageSrc = isWorking ? workImage : breakImage;
          this.setState({ imageSrc });
        }
      };


      // Function to start or stop the timer
      toggleTimer = () => {
        this.setState((prevState) => ({
          isRunning: !prevState.isRunning,
          timerStarted: true,
        }), () => {
          if (this.state.isRunning) {
            this.timerInterval = setInterval(this.tick, 1000);
          } else {
            clearInterval(this.timerInterval);
          }

          this.updateImageSrc();
        });
      };
    
      // Function to update the timer every second
      tick = () => {
        if (this.state.time > 0) {
          this.setState((prevState) => ({
            time: prevState.time - 1,
          }));
        } else {
          // Timer has reached 0, switch between work and break times
          this.switchTimer();
        }
      };
    
      // Function to switch between work and break times
      switchTimer = () => {
        const { isWorking, currentInterval, intervals } = this.state;
    
        if (isWorking) {
          if (currentInterval < intervals) {
            this.state.notifAudio.play();
            this.setState({
              isWorking: false,
              time: this.state.breakTime,
              currentInterval: currentInterval + 1,
              imageSrc: breakImage,
            });
          } else {
            this.state.celebrateAudio.play();
            // All intervals are completed, show finished message
            this.setState({
              isRunning: false,
              showMessage: true,
              imageSrc: completedImage,
            });
            clearInterval(this.timerInterval);
          }
        } else {
          this.state.notifAudio.play();
          this.setState({
            isWorking: true,
            time: this.state.workTime,
            imageSrc: workImage,
          });
        }
      };
    
      // Function to reset the session and start a new one
      startNewSession = () => {
        this.setState({
          isWorking: true,
          time: this.state.workTime,
          currentInterval: 1,
          showMessage: false,
          imageSrc: defaultImage,
        });
      };
    
      // Function to reset the timer
      resetTimer = () => {
        clearInterval(this.timerInterval);
        this.setState({
          workTime: 25 * 60,
          breakTime: 5 * 60,
          intervals: 4,
          currentInterval: 1,
          isWorking: true,
          isRunning: false,
          time: 25 * 60,
          showMessage: false,
          imageSrc: defaultImage,
        });
      };
    
      // Function to update work time
      updateWorkTime = (minutes) => {
        this.setState({
          workTime: minutes * 60,
          time: this.state.isWorking ? minutes * 60 : this.state.time,
        });
      };
    
      // Function to update break time
      updateBreakTime = (minutes) => {
        this.setState({
          breakTime: minutes * 60,
          time: !this.state.isWorking ? minutes * 60 : this.state.time,
        });
      };
    
      // Function to update the number of intervals
      updateIntervals = (count) => {
        this.setState({
          intervals: count,
        });
      };
    
      render() {
        const {
          isWorking,
          time,
          isRunning,
          workTime,
          breakTime,
          intervals,
          currentInterval,
          showMessage,
          imageSrc,
        } = this.state;
        const timerType = isWorking ? 'Work' : 'Break';
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
        return (
          <div className="timer-container">
            <button id="focus-button"onClick={this.toggleFullScreen}>Focus Mode</button>
          <div
              className={`pomodoro-timer ${
                this.state.isRunning
                  ? this.state.isWorking
                    ? 'work-time'
                    : 'break-time'
                  : 'default-time'
              }`}
              ref={(element) => (this.timerElement = element)} // Create a ref for the timer element
            >
    
            <div className="image-container">
                <img src={imageSrc} alt="Timer State" />
            </div>
            <div className="timer-container">
            {showMessage ? (
              <>
                <div className="finished-message">All sessions completed!</div>
                <button onClick={this.startNewSession}>Start New Session</button>
              </>
            ) : (
              <>
                <h1 className='App-Intro'>Timeado Timer</h1>
                <h2>{timerType} Time</h2>
                <div className="timer-display">{timerDisplay}</div>
                <div id="interval"><p>Interval: {currentInterval}/{intervals}</p></div>
                <button onClick={this.toggleTimer}>
                  {isRunning ? 'Pause' : 'Start'}
                </button>

                <button onClick={this.resetTimer}>Reset</button>
                <div>
                  <label>Work Time (minutes):</label>
                  <input type="number" value={workTime / 60} onChange={(e) => this.updateWorkTime(e.target.value)} />
                </div>
                <div>
                  <label>Break Time (minutes):</label>
                  <input type="number" value={breakTime / 60} onChange={(e) => this.updateBreakTime(e.target.value)} />
                </div>
                <div>
                  <label>Intervals:</label>
                  <input type="number" value={intervals} onChange={(e) => this.updateIntervals(e.target.value)} />
                </div>
                
              </>
              
            )}
            </div>
          </div>
          </div>
          
        );
      }
    }
    
export default Pomodoro;
