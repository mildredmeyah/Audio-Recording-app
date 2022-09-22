import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button } from 'react-native';
import { Audio } from 'expo-av';
import * as React from "react";

export default function App() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");
async function startRecording() {
    try {
      console.log('Requesting permissions..');
     const permission = await Audio.requestPermissionsAsync();

     if (permission.status ==="granted") {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
   
      const {recording} = await Audio.Recording.createAsync(
    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    
   
    );
    console.log("start recording ");
      setRecording(recording);
      
} else {
      setMessage("plese");
    }
    
  }catch (err) {
    console.error("failed",err);
  }
  }
  async function stopRecording(){
  console.log("stop recording");
  setRecording(undefined);
  await recording.stopAndUnloadAsync();


  let updatedRecordings = [...recordings];
  const{ sound, status }= await recording.createNewLaodedSoundAsync();
  updatedRecordings.push({
    sound:sound,
    duration:getDurationFormatted(status.durationMillis),
    file:recording.getURI()
  });
  const uri=recording.getURI();
  console.log("record stopped",uri);
  setRecording(updatedRecordings);
}
function getDurationFormatted(millis){
  const minutes = millis/ 1000/ 60;
  const minutesDisplay = Math.floor(minutes);
  const seconds = Math.round((minutes - minutesDisplay) *60);
  const secondsDisplay = seconds < 10 ? `0 ${seconds}`:seconds;
  return`${minutesDisplay}:${secondsDisplay}`;
}
function getRecordingLines(){
   return recordings.map((recordingLine, index) => {
    return(
      <View key={index} style={styles.row}>
        <Text style={styles.fill}>recording {index + 1} - {recordingLine.duration}</Text>
        <Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="play"></Button>
        <Button style={styles.button} onPress={() => sharing.shareAsync( recordingLine.file)} title="play"></Button>

      
      </View>
    );
  });

}
  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      
      {getRecordingLines()}
      
      
      <StatusBar style='auto'/>
      
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row:{
    flexDirection:'row',
    backgroundColor:"white",
    alignItems:'center',
    justifyContent:'center',

  },
  fill:{
    backgroundColor:"pink",
    justifyContent: 'center',
  },
  button:{
    backgroundColor:"pink",
    justifyContent: 'center',
  }
});
