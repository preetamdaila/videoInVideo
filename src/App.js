import "./styles.css";
import { TwoVideoContainer } from "./TwoVideoContainer";

export default function App() {
    return (
        <div className="App">
            <TwoVideoContainer
                screenRecording={
                    "https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/sample-mp4-file.mp4"
                    // "https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-Video-File-For-Testing.mp4"
                }
                audioVideoRecording={
                    "https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/sample-mp4-file.mp4"
                }
            />
        </div>
    );
}
