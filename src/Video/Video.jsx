import "./Video.css";
import { useCallback } from "react";
import React, { useState } from "react";

function wait(delayInMS) {
  return new Promise((resolve) => setTimeout(resolve, delayInMS));
}

function Video() {
  const videoSize = { width: 480, height: 720 };
  const [status, setStatus] = useState("");

  const startRecording = useCallback((stream, lengthInMS) => {
    let recorder = new MediaRecorder(stream);
    let data = [];

    recorder.ondataavailable = (event) => data.push(event.data);
    recorder.start();
    setStatus(`${recorder.state} for ${lengthInMS / 1000} seconds…`);

    let stopped = new Promise((resolve, reject) => {
      recorder.onstop = resolve;
      recorder.onerror = (event) => reject(event.name);
    });

    let recorded = wait(lengthInMS).then(() => {
      if (recorder.state === "recording") {
        recorder.stop();
      }
    });

    return Promise.all([stopped, recorded]).then(() => data);
  }, []);

  const stop = useCallback((stream) => {
    stream.getTracks().forEach((track) => track.stop());
  }, []);

  const onClick = useCallback(() => {
    let preview = document.getElementById("video");
    let recording = document.getElementById("recording");
    let downloadButton = document.getElementById("downloadButton");
    let recordingTimeMS = 5000;

    navigator.mediaDevices
      .getUserMedia({
        video: videoSize,
        audio: true,
      })
      .then((stream) => {
        console.log("have access", preview, downloadButton, recording, stream);
        preview.srcObject = stream;
        downloadButton.href = stream;
        preview.captureStream =
          preview.captureStream || preview.mozCaptureStream;
        return new Promise((resolve) => (preview.onplaying = resolve));
      })
      .then(() => {
        console.log("step 2");
        return startRecording(preview.captureStream(), recordingTimeMS);
      })
      .then((recordedChunks) => {
        console.log("step 3");
        let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
        recording.src = URL.createObjectURL(recordedBlob);
        downloadButton.href = recording.src;
        downloadButton.download = "RecordedVideo.webm";

        setStatus(
          `Successfully recorded ${recordedBlob.size} bytes of ${recordedBlob.type} media.`
        );
      })
      .catch((error) => {
        console.error(error);
        if (error.name === "NotFoundError") {
          setStatus("Camera or microphone not found. Can't record.");
        } else {
          setStatus(error);
        }
      });
  }, [startRecording]);

  const onStop = useCallback(() => {
    let preview = document.getElementById("video");
    stop(preview.srcObject);
  }, [stop]);

  return (
    <div className="video__wrapper">
      <div className="video__list">
        <button onClick={onClick}>Start record</button>
        <button onClick={onStop}>Stop record</button>
        <button id="downloadButton">Download video</button>
      </div>
      <div>status: {status}</div>
      <div className="video__list">
        <video id="video" style={{ ...videoSize }}></video>
        <video id="recording" style={{ ...videoSize }}></video>
      </div>
    </div>
  );
}

export default Video;
