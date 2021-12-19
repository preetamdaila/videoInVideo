import { useEffect, useState } from "react";
import ExitFullscreenIcon from "./assets/images/exitfullscreen.svg";
import FullscreenIcon from "./assets/images/fullscreen.svg";
import PauseIcon from "./assets/images/pause.svg";
import PlayIcon from "./assets/images/play.svg";
import ReplayIcon from "./assets/images/replay.svg";
import VolumeIcon from "./assets/images/volume.svg";
import VolumeOffIcon from "./assets/images/volumeoff.svg";

export const TwoVideoContainer = (props) => {
    const { screenRecording, audioVideoRecording } = props;

    const [arePaused, setArePaused] = useState(true);
    const [areWaiting, setAreWaiting] = useState([true, true]);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [bufferAvailable, setBufferAvailable] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentPostion, setCurrentPostion] = useState(0);
    const [videoElements, setVideoElements] = useState([]);
    const [videoContainerSize, setVideoContainerSize] = useState([
        "mainVideo",
        "subVideo",
    ]);
    const swapVideoContainer = (by = "") => {
        console.log(`fn: swapVideoContainer by ${by}`);
        setVideoContainerSize([...videoContainerSize.reverse()]);
    };
    const playPause = (by = "", of = "") => {
        console.log(`fn: playPause from (${by}) of ${of}.`);
        let mainVideo = document.getElementById("mainVideo");
        let subVideo = document.getElementById("subVideo");
        if (
            mainVideo.paused &&
            subVideo.paused &&
            !arePaused &&
            !areWaiting[0] &&
            !areWaiting[1]
        ) {
            mainVideo.play();
            subVideo.play();
            console.log("Played");
        } else {
            mainVideo.pause();
            subVideo.pause();
            console.log("Paused");
        }
    };
    const setBuffer = () => {
        let mainVideo = document.getElementById("mainVideo");
        let subVideo = document.getElementById("subVideo");
        let buffer = 0;
        try {
            let mainVideoBuffer = mainVideo.buffered;
            let subVideoBuffer = subVideo.buffered;
            if (subVideoBuffer.length === 1 && mainVideoBuffer.length === 1) {
                buffer =
                    Math.min(mainVideoBuffer.end(0), subVideoBuffer.end(0)) /
                    Math.min(mainVideo.duration, subVideo.duration);
                setBufferAvailable(buffer);
            }
        } catch (e) {}
    };
    const setTotalTime = () => {
        let mainVideo = document.getElementById("mainVideo");
        let subVideo = document.getElementById("subVideo");
        let totalTime = Math.min(mainVideo.duration, subVideo.duration);
        console.log("duration " + totalTime);
        setDuration(totalTime);
    };
    const setCurrentStatus = () => {
        console.log(currentTime, duration, currentTime / duration);
        if (duration > 0) setCurrentPostion(currentTime / duration);
    };
    const seekVideo = (time) => {
        videoElements.map((e) => (e.currentTime = time));
    };
    const timeConverter = (timeInSeconds) => {
        let minutes = Math.floor(timeInSeconds / 60);
        let seconds = timeInSeconds % 60;
        return (
            (minutes > 9 ? minutes : "0" + minutes) +
            ":" +
            (seconds > 9 ? seconds : "0" + seconds)
        );
    };
    const flipFullscreen = () => {
        let videoContainer = document.getElementById("videoContainer");
        if (isFullscreen) {
            var requestMethod =
                videoContainer.requestFullScreen ||
                videoContainer.webkitRequestFullscreen ||
                videoContainer.webkitRequestFullScreen ||
                videoContainer.mozRequestFullScreen ||
                videoContainer.msRequestFullscreen;
            if (requestMethod) {
                requestMethod.apply(videoContainer);
            }
        } else {
            try {
                document.webkitCancelFullScreen();
                document.mozCancelFullScreen();
            } catch (e) {}
        }
    };
    const getMousePostion = (e) => {
        let elemRect = e.target.getBoundingClientRect();
        let elemLen = elemRect.right - elemRect.left;
        let elemPos = e.clientX - elemRect.left;
        let progress = (elemPos < 0 ? 0 : elemPos) / elemLen;
        let jumpTime = duration * progress;
        console.log(`${progress}% ${elemPos} ${elemLen}
        duration: ${timeConverter(Math.round(jumpTime))}`);
        return jumpTime;
    };
    console.log(
        `arePaused: ${arePaused}, areWaiting ${areWaiting}
        duration   ${duration}
        current    ${currentTime}
        bufferAvailable   ${bufferAvailable * 100}
        currentProgress   ${currentPostion * 100}
        currentBufferRatio ${(bufferAvailable - currentPostion) * 100}`
    );

    useEffect(() => {
        let videos = [];
        if (document.getElementById("mainVideo"))
            videos = [...videos, document.getElementById("mainVideo")];
        if (document.getElementById("subVideo"))
            videos = [...videos, document.getElementById("subVideo")];
        setVideoElements(videos);
    }, []);

    useEffect(() => setCurrentStatus(), [currentTime]);

    useEffect(() => {
        playPause("useEffect", "main");
    }, [arePaused, areWaiting]);
    useEffect(() => flipFullscreen(), [isFullscreen]);

    return (
        <div
            className={`videoContainer aspectRatioVideo positionRelative ${
                isFullscreen ? "fullscreen" : ""
            }`}
            id="videoContainer"
        >
            <video
                disablePictureInPicture
                muted={isMuted}
                preload="auto"
                className={`green aspectRatioVideo positionAbsolute ${videoContainerSize[0]}`}
                id="mainVideo"
                onClick={() => swapVideoContainer("v1")}
                onWaiting={() => setAreWaiting([true, areWaiting[1]])}
                onCanPlay={() => setAreWaiting([false, areWaiting[1]])}
                onProgress={() => setBuffer()}
                onLoadedMetadata={() => setTotalTime()}
                onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                src={screenRecording}
            />
            <video
                disablePictureInPicture
                muted={isMuted}
                preload="auto"
                className={`yellow aspectRatioVideo positionAbsolute ${videoContainerSize[1]}`}
                id="subVideo"
                onClick={() => swapVideoContainer("v2")}
                onWaiting={() => setAreWaiting([areWaiting[0], true])}
                onCanPlay={() => setAreWaiting([areWaiting[0], false])}
                onProgress={() => setBuffer()}
                onLoadedMetadata={() => setTotalTime()}
                src={audioVideoRecording}
            />
            <div className="controlBar positionAbsolute">
                <div
                    className="progressBar positionRelative"
                    id="progressBar"
                    onMouseMove={(e) => getMousePostion(e)}
                    onMouseUp={(e) => seekVideo(getMousePostion(e))}
                >
                    <div
                        className="currentStatus positionAbsolute"
                        style={{ transform: `scaleX(${currentPostion})` }}
                    ></div>
                    <div
                        className="bufferStatus positionAbsolute"
                        style={{ transform: `scaleX(${bufferAvailable})` }}
                    ></div>
                </div>
                <div className="controls displayFlex">
                    <div className="leftControls displayFlex">
                        <div className="controlIcon">
                            <img
                                src={arePaused ? PlayIcon : PauseIcon}
                                onClick={() => setArePaused(!arePaused)}
                                alt="icon"
                            />
                        </div>
                        <div className="controlIcon">
                            <img
                                src={isMuted ? VolumeOffIcon : VolumeIcon}
                                onClick={() => setIsMuted(!isMuted)}
                                alt="icon"
                            />
                        </div>
                        <div className="controlTime displayFlex">
                            <span className="currentTime">
                                {timeConverter(Math.trunc(currentTime))}
                            </span>
                            <span className="duration">
                                {timeConverter(Math.trunc(duration))}
                            </span>
                        </div>
                    </div>
                    <div className="rightControls displayFlex">
                        <div className="controlIcon">
                            <img
                                src={
                                    isFullscreen
                                        ? ExitFullscreenIcon
                                        : FullscreenIcon
                                }
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                alt="icon"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
