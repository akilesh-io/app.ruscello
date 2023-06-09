import React, { useEffect } from "react";
import Slider from "@mui/material/Slider";

import FastForward from "@mui/icons-material/FastForward";
import FastRewind from "@mui/icons-material/FastRewind";
import Pause from "@mui/icons-material/Pause";
import PlayArrow from "@mui/icons-material/PlayArrow";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOff from "@mui/icons-material/VolumeOff";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import SyncIcon from "@mui/icons-material/Sync";

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
  onSync,
}) => {
  {
    /* on press space button in keyboard call all the control navigations using switch statement for p[lay, pause seek, etc... */
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case "Space":
          onPlayPause();
          break;
        case "ArrowRight":
          onForward();
          break;
        case "ArrowLeft":
          onRewind();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onPlayPause, onForward, onRewind]);

  return (
    <div className={styles.control_Container} ref={controlRef}>
      <div className={styles.top_container}>
        <h2>Filmingo</h2>
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
            sx={{
              color: "#D97777",
            }}
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

            <div className={styles.icon__btn} onClick={onSync}>
              <SyncIcon fontSize="medium" />
            </div>

            <div className={styles.icon__btn} onClick={onMute}>
              {mute ? (
                <VolumeOff fontSize="medium" />
              ) : (
                <VolumeUp fontSize="medium" />
              )}
            </div>

            <Slider
              sx={{
                color: "#D97777",
                display: { xs: "none", md: "block" },
                width: "5rem",
              }}
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
