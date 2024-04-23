await WebMidi.enable();

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

//read option n shit
WebMidi.inputs.forEach(function (input, num) {
  dropIns.innerHTML += `<option value=${num}>${input.name}</option`;
});

WebMidi.inputs.forEach(function (output, num) {
  dropOuts.innerHTML += `<option value=${num}>${output.name}</option`;
});


//note reader n shit
const midiProcess = function (midiNoteInput) {

  let pitch = midiNoteInput.note.number;
  let velocity = midiNoteInput.note.rawAttack;

  let midiNoteOutput = new Note(pitch, { rawAttack: velocity });
  return midiNoteOutput;
};

dropIns.addEventListener("change", function () {
  if (myInput.hasListener("noteon")) {
  myInput.removeListener("noteon");
  }
  if(myInput.hasListener("noteoff")) {
      myInput.removeListener("noteoff");
  }

  myInput = WebMidi.inputs[dropIns.value];

  myInput.addListener("noteon", function (someMIDI) {
      myOutput.sendNoteOn(midiProcess(someMIDI));
});

  myInput.addListener("noteoff", function (someMIDI) {
      myOutput.sendNoteOff(midiProcess(someMIDI));
  });
});



dropOuts.addEventListener("change", function () {
  myOutput = WebMidi.outputs [dropOuts.value].channels[1];
});

export default MusicTools;

