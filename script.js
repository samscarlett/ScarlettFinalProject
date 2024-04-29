await WebMidi.enable();


// //call all my scales n shit
// const dropDownOptions = function() {

//   let cMajor = document.getElementById("C Major");
//   let fMajor = document.getElementById("F Major");
//   let bFlatMajor = document.getElementById("Bb Major");
//   let eFlatMajor = document.getElementById("Eb Major");
//   let aFlatMajor = document.getElementById("Ab Major");
//   let dFlatMajor = document.getElementById("Db Major");
//   let gFlatFSharpMajor = document.getElementById("Gb/F# Major");
//   let gMajor = document.getElementById("G Major");
//   let dMajor = document.getElementById("D Major");
//   let aMajor = document.getElementById("A Major");
//   let eMajor = document.getElementById("E Major");
//   let bMajor = document.getElementById("B Major");

// };

const scales = {
  cMajor: [0, 2, 4, 5, 7, 9, 11],
  dMajor: [1, 2, 4, 6, 7, 9, 11],
  fMajor: []

};

let chosenScale = scales.cMajor;

  let myInput = WebMidi.inputs[0];
  let myOutput = WebMidi.outputs[0];

  let dropIns = document.getElementById("dropdowns-ins");
  let dropOuts = document.getElementById("dropdown-outs");
  let dropScale = document.getElementById("dropdown-scale");

  for (let scaleName in sclaes) {
    dropScale.innerHTML += `<option value=${scaleName}>${scaleName}</option`;
  };

  WebMidi.inputs.forEach(function (input, num) {
    dropIns.innerHTML += `<option value=${num}>${input.name}</option`;
  });

  WebMidi.outputs.forEach(function (output, num) {
    dropOuts.innerHTML += `<option value=${num}>${output.name}</option>`;
  });


  const remap = function (midi_number) {
    if (chosenScale.includes(midi_number % 12)) {
      return midi_number;
    } else {
      return remap(midi_number - 1);
    }
  };

  dropIns.addEventListener("change", function () {
    if (myInput.hasListener("noteon")) {
      myInput.removeListener("noteon");
    }
    if (myInput.hasListener("noteoff")) {
      myInput.removeListener("noteoff");
    }
  
    myInput = WebMidi.inputs[dropIns.value];

    myInput.addListener("noteon", function (someMIDI) {
      
      let noteNumber = someMIDI.note.number;

      let myNote = new Note(remap(noteNumber));
      myOutput.sendNoteOn(myNote);
    });

    myInput.addListener("noteoff", function (someMIDI) {
      let noteNumber = someMIDI.note.number;

    let myNote = new Note(remap(noteNumber));
    myOutput.sendNoteOff(myNote);
  });
});

dropOuts.addEventListener("change", function () {
  myOutput = WebMidi.outputs[dropOuts.value].channels[1];
});

dropScale.addEventListener("change", function () {
  chosenScale = scales[dropScale.value];
  console.log(dropScale.value);
});