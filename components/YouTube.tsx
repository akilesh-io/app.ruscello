import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { socket } from "@/context/socketUrl";
import YouTube from "react-youtube";
import { Container } from "@material-ui/core";

const PLAYER_STATE = {
  "-1": "unstarted",
  0: "ended",
  1: "playing",
  2: "paused",
  3: "buffering",
  5: "video cued",
};

export default function YTPlayer() {
  const router = useRouter();
  const { id: roomName } = router.query;
  const [videoId, setVideoId] = useState("");
  const [playerState, setPlayerState] = useState(null);
  const [ytPlayer, setYtPlayer] = useState<any>(null);

  const videoTimeStack = useRef([]);

  useEffect(() => {
    socket.on("room-video-id", (videoId) => {
      if (videoId) {
        setVideoId(videoId);
      }
    });

    socket.on("set-player-status", (playerState) => {
      setPlayerState(playerState);
    });

    socket.on("update-server-time", (playerUpdateTime) => {
      console.log(
        "🚀 ~ file: YouTube.tsx:41 ~ socket.on ~ playerUpdateTime:",
        playerUpdateTime
      );
      ytPlayer.seekTo(playerUpdateTime, true);
    });
  }, [ytPlayer, socket]);

  useEffect(() => {
    if (ytPlayer && socket) {
      if (playerState) {
        socket.emit("set-player-status", playerState, { room: roomName });
      }
      if (playerState === "playing") {
        ytPlayer.playVideo();
        ytPlayer.seekTo(4, true);
      } else if (playerState === "paused") {
        ytPlayer.pauseVideo();
      }
    }
  }, [socket, ytPlayer, playerState]);

  const handleTimeChanging = (player) => {
    function updateTime() {
      if (player && player.getCurrentTime) {
        if (socket) {
          if (player.getPlayerState() === 1) {
            //socket.emit("update-server-time", player.getCurrentTime(), {room: roomName});
          }
        }
        // videoTimeStack.current.push(player.getCurrentTime());

        if (videoTimeStack.current.length > 2) {
          videoTimeStack.current.shift();
        }

        const diff = videoTimeStack.current[1] - videoTimeStack.current[0];
        if (Math.abs(diff) > 1.1) {
          socket.emit("set-player-current-time", player.getCurrentTime(), {
            room: roomName,
          });

          if (PLAYER_STATE[player.getPlayerState()]) {
            socket.emit(
              "set-player-status",
              PLAYER_STATE[player.getPlayerState()]
            );
          }
        }
      }
    }
    setInterval(updateTime, 1000);
  };

  const handleStateChange = (event) => {
    const player = event.target;
    const playerState = PLAYER_STATE[event.data];
    setPlayerState(playerState);
    handleTimeChanging(player);
  };

  const handleOnReady = (event) => {
    const player = event.target;
    setYtPlayer(player);
    handleTimeChanging(player);
  };
  function sync(parameter) {
    parameter.getCurrentTime();
    socket.emit("update-server-time", parameter.getCurrentTime(), {
      room: roomName,
    });
  }

  return (
    <div>
      {/* <YouTube videoId="2g811Eo7K8U" opts={opts} onReady={onPlayerReady} />; */}
      <div className="flex flex-col justify-center">
        <div className="flex justify-center align-middle items-center">
          <input
            type="text"
            id="username"
            name="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="User Name"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            // required
          />

          <button
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              if (socket) {
                setVideoId(videoId);
                socket.emit("room-video-id", videoId, { room: roomName });
              }
            }}
          >
            Set Video
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        {videoId ? (
          <div className="flex justify-center align-middle items-center py-2">
            <Container maxWidth="md" className="relative">
              <YouTube
                //chszuecx_f0
                videoId={videoId}
                //containerClassName="h-full"
                opts={{
                  height: "390",
                  width: "640",
                  playerVars: {
                    origin: "",
                    rel: 0,
                    showinfo: 0,
                    ecver: 2,
                    controls: 1,
                    disablekb: 1,
                    iv_load_policy: 3,
                    autoplay: 1,
                    start: 0,
                  },
                }}
                onReady={handleOnReady}
                onStateChange={handleStateChange}
              />
            </Container>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center font-mono">
            <span className="text-indigo-950 text-4xl">NO VIDEO</span>
          </div>
        )}
      </div>{" "}
      <button
        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          sync(ytPlayer);
        }}
      >
        Sync
      </button>
    </div>
  );
}
