import { useEffect, useState } from "react";

export const TwoVideoContainer = (props) => {
    const { screenRecording, audioVideoRecording } = props;

    const [arePaused, setArePaused] = useState(true);
    const [areWaiting, setAreWaiting] = useState([true, true]);
    const [bufferAvailable, setBufferAvailable] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentPostion, setCurrentPostion] = useState(0);
    const [videoContainers, setVideoContainer] = useState([
        "mainVideo",
        "subVideo",
    ]);
    const swapVideoContainer = (by = "") => {
        console.log(`fn: swapVideoContainer by ${by}`);
        setVideoContainer([...videoContainers.reverse()]);
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
        if (duration > 0) setCurrentPostion(currentTime / duration);
    };
    console.log(
        `arePaused: ${arePaused}, areWaiting ${areWaiting}
        duration   ${duration} 
        current    ${currentTime} 
        bufferAvailable   ${bufferAvailable * 100}
        currentProgress   ${currentPostion * 100}
        currentBufferRatio ${(bufferAvailable - currentPostion) * 100}`
    );

    useEffect(() => setCurrentStatus(), [currentTime]);

    useEffect(() => {
        playPause("useEffect", "main");
    }, [arePaused, areWaiting]);

    return (
        <div className="videoContainer aspectRatioVideo positionRelative">
            <video
                disablePictureInPicture
                muted
                preload="auto"
                className={`green aspectRatioVideo positionAbsolute ${videoContainers[0]}`}
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
                muted
                preload="auto"
                className={`yellow aspectRatioVideo positionAbsolute ${videoContainers[1]}`}
                id="subVideo"
                onClick={() => swapVideoContainer("v2")}
                onWaiting={() => setAreWaiting([areWaiting[0], true])}
                onCanPlay={() => setAreWaiting([areWaiting[0], false])}
                onProgress={() => setBuffer()}
                onLoadedMetadata={() => setTotalTime()}
                src={audioVideoRecording}
            />
            <div className="controlBar positionAbsolute">
                <div className="progressBar positionRelative">
                    <div
                        className="currentStatus positionAbsolute"
                        style={{ transform: `scaleX(${currentPostion})` }}
                    ></div>
                    <div
                        className="bufferStatus positionAbsolute"
                        style={{ transform: `scaleX(${bufferAvailable})` }}
                    ></div>
                </div>
                <div className="controls">
                    <div
                        style={{
                            backgroundColor: arePaused ? "red" : "green",
                            width: "20px",
                            height: "20px",
                            borderRadius: "100%",
                            margin: "15px",
                            cursor: "pointer",
                        }}
                        onClick={() => setArePaused(!arePaused)}
                    ></div>
                </div>
            </div>
        </div>
    );
};
