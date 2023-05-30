import React from "react";
import Slider from "@mui/material/Slider";

import FastForward from "@mui/icons-material/FastForward";
import FastRewind from "@mui/icons-material/FastRewind";
import Pause from "@mui/icons-material/Pause";
import PlayArrow from "@mui/icons-material/PlayArrow";
import SkipNext from "@mui/icons-material/SkipNext";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOff from "@mui/icons-material/VolumeOff";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import styles from "@/styles/Control.module.css";

const Control = ({
  onPlayPause,
  playing,
  onRewind,
  onForward,
  played,
  onSeek,
  onSeekMouseUp,
  onVolumeChangeHandler,
  onVolumeSeekUp,
  volume,
  mute,
  onMute,
  duration,
  currentTime,
  onMouseSeekDown,
  fullScreen,
  handleClickFullscreen,
  controlRef,
}) => {
  return (
    <div className={styles.control_Container} ref={controlRef}>
      <div className={styles.top_container}>
        <h2>Ruscello</h2>
      </div>
      <div className={styles.mid__container}>
        <div className={styles.icon__btn} onDoubleClick={onRewind}>
          <FastRewind fontSize="medium" />
        </div>

        <div className={styles.icon__btn} onClick={onPlayPause}>
          {playing ? (
            <Pause fontSize="large" />
          ) : (
            <PlayArrow fontSize="large" />
          )}{" "}
        </div>

        <div className={styles.icon__btn}>
          <FastForward fontSize="medium" onDoubleClick={onForward} />
        </div>
      </div>
      <div className={styles.bottom__container}>
        <div className={styles.slider__container}>
          <Slider
            className={styles.seekSlider}
            min={0}
            max={100}
            value={played * 100}
            onChange={onSeek}
            onChangeCommitted={onSeekMouseUp}
            onMouseDown={onMouseSeekDown}
          />
        </div>
        <div className={styles.control__box}>
          <div className={styles.inner__controls}>
            <div className={styles.icon__btn} onClick={onPlayPause}>
              {playing ? (
                <Pause fontSize="medium" />
              ) : (
                <PlayArrow fontSize="medium" />
              )}{" "}
            </div>

            <div className={styles.icon__btn}>
              <SkipNext fontSize="medium" />
            </div>

            <div className={styles.icon__btn} onClick={onMute}>
              {mute ? (
                <VolumeOff fontSize="medium" />
              ) : (
                <VolumeUp fontSize="medium" />
              )}
            </div>

            <Slider
              className={styles.volumeSlider}
              onChange={onVolumeChangeHandler}
              value={volume * 100}
              onChangeCommitted={onVolumeSeekUp}
            />

            <span className={styles.span}>
              {currentTime} : {duration}
            </span>
          </div>
          <div className={styles.icon__btn} onClick={handleClickFullscreen}>
            {fullScreen ? (
              <FullscreenExitIcon fontSize="medium" />
            ) : (
              <FullscreenIcon fontSize="medium" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Control;
