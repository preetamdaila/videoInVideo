import { useState } from "react"

export const TwoVideoContainer = (props) => {
    const { screenRecording, audioVideoRecording } = props
    const [videoContainers, setVideoContainer] = useState([
        "largeVideo",
        "smallVideo"
    ])
    const swapVideoContainer = (by = "") => {
        console.log(`fn: swapVideoContainer by ${by}`)
        setVideoContainer([...videoContainers.reverse()])
    }
    const playPause = (by = "", of = "") => {
        console.log(`fn: playPause from (${by}) of ${of}.`)
        let v1 = document.getElementById("video_1")
        let v2 = document.getElementById("video_2")
        if (v1.paused || v2.paused) {
            v1.play()
            v2.play()
            console.log("Played")
        } else {
            v1.pause()
            v2.pause()
            console.log("Paused")
        }
    }
    const videoWaiting = () => {
        let v1 = document.getElementById("video_1")
        let v2 = document.getElementById("video_2")
        console.log("Is v1 paused: " + v1.paused)
        console.log("Is v2 paused: " + v2.paused)
        v1.pause()
        v2.pause()
    }
    return (
        <div className="videoContainer aspectRatioVideo positionRelative">
            <video
                disablePictureInPicture
                muted
                preload="auto"
                className={`green aspectRatioVideo positionAbsolute ${videoContainers[0]}`}
                id="video_1"
                onClick={() => swapVideoContainer("v1")}
                onWaiting={() => playPause("onWaiting", "v1")}
                onCanPlay={() => playPause("onCanPlay", "v1")}
                src={screenRecording}
            />
            <video
                disablePictureInPicture
                preload="auto"
                className={`yellow aspectRatioVideo positionAbsolute ${videoContainers[1]}`}
                id="video_2"
                onClick={() => swapVideoContainer("v2")}
                onWaiting={() => playPause("onWaiting", "v2")}
                onCanPlay={() => playPause("onCanPlay", "v2")}
                src={audioVideoRecording}
            />
            <div className="controlBar positionAbsolute">
                <div
                    style={{
                        backgroundColor: "white",
                        width: "20px",
                        height: "20px",
                        margin: "15px",
                        cursor: "pointer"
                    }}
                    onClick={() => playPause("onClick", "main")}></div>
            </div>
        </div>
    )
}
