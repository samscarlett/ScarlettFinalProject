await WebMidi.enable();

const MusicTools = {
    standardPitch: 440, 
/**
 * Converts MIDI pitch to the corresponding frequency in Hertz (A440)
 * @param {number} midiPitch Pitch in MIDI Number
 * @returns {number}  Frequency in Hertz
 * @example
 * 
 */
    midiPitchToFrequency: function (midiPitch) {
        return this.standardPitch * Math.pow(2, (midiPitch - 69) / 12);
      },

    };

//enable WebMIDI API

  let myInput = WebMidi.inputs[0];
  let myOutput = WebMidi.outputs[0];


  let dropIns = document.getElementById("dropdown-ins");
  let dropOuts = document.getElementById("dropdown-outs");

// For each MIDI input and output device detected, add an option to the input devices dropdown.
// This loop iterates over all detected input devices, adding them to the dropdown.
WebMidi.inputs.forEach(function (input, num) {
    dropIns.innerHTML += `<option value=${num}>${input.name}</option>`;
  });
WebMidi.outputs.forEach(function (output, num) {
    dropOuts.innerHTML += `<option value=${num}>${output.name}</option>`;
  });

  //define MIDI processing function
const midiProcess = function (midiNoteInput) {
  
    let pitch = midiNoteInput.note.number;
    let velocity = midiNoteInput.note.rawAttack;
  
    let midiNoteOutput = new Note(pitch, { rawAttack: velocity });
    return midiNoteOutput;
  };

// Add an event listener for the 'change' event on the input devices dropdown.
// This allows the script to react when the user selects a different MIDI input device.
dropIns.addEventListener("change", function () {
    // Before changing the input device, remove any existing event listeners
    // to prevent them from being called after the device has been changed.
    if (myInput.hasListener("noteon")) {
      myInput.removeListener("noteon");
    }
    if (myInput.hasListener("noteoff")) {
      myInput.removeListener("noteoff");
    }
  
    // Change the input device based on the user's selection in the dropdown.
    myInput = WebMidi.inputs[dropIns.value];
    // myOutput = WebMidi.outputs[dropOuts.value];
  
    
  
    // After changing the input device, add new listeners for 'noteon' and 'noteoff' events.
    // These listeners will handle MIDI note on (key press) and note off (key release) messages.
    myInput.addListener("noteon", function (someMIDI) {
      // When a note on event is received, send a note on message to the output device.
      // This can trigger a sound or action on the MIDI output device.
      myOutput.sendNoteOn(midiProcess(someMIDI));
    });
  
    myInput.addListener("noteoff", function (someMIDI) {
      // Similarly, when a note off event is received, send a note off message to the output device.
      // This signals the end of a note being played.
  
      myOutput.sendNoteOff(midiProcess(someMIDI));
    });
  });
  
  // Add an event listener for the 'change' event on the output devices dropdown.
  // This allows the script to react when the user selects a different MIDI output device.
  dropOuts.addEventListener("change", function () {
    // Change the output device based on the user's selection in the dropdown.
    // The '.channels[1]' specifies that the script should use the first channel of the selected output device.
    // MIDI channels are often used to separate messages for different instruments or sounds.
    myOutput = WebMidi.outputs[dropOuts.value].channels[1];
  });

    export default MusicTools;

