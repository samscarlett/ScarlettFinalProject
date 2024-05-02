await WebMidi.enable();

//List of all scales and their midi mappings
const scales = {
  cMaj: {
    
    displayName:"C Major", 
    notes:[0, 2, 4, 5, 7, 9, 11]
  },

  gMaj: {
    
    displayName:"G Major", 
    notes:[0, 2, 4, 6, 7, 9, 11]
  },
  
  dMaj: {
    
    displayName:"D Major", 
    notes:[1, 2, 4, 6, 7, 9, 11]
  },

  aMaj: {
    
    displayName:"A Major", 
    notes:[1, 2, 4, 6, 8, 9, 11]
  },

  eMaj: {
    
    displayName:"E Major", 
    notes:[1, 3, 4, 6, 8, 9, 11]
  },

  bMaj: {
    
    displayName:"B Major", 
    notes:[1, 3, 4, 6, 8, 10, 11]
  },

  fSharpMaj: {
    
    displayName:"F# Major", 
    notes:[1, 3, 5, 6, 8, 10, 11]
  },

  fMaj: {
    
    displayName:"F Major", 
    notes:[0, 2, 4, 5, 7, 9, 10]
  },

  bFlatMaj: {
    
    displayName:"Bb Major", 
    notes:[0, 2, 3, 5, 7, 9, 10]
  },

  eFlatMaj: {
    
    displayName:"Eb Major", 
    notes:[0, 2, 3, 5, 7, 8, 10]
  },

  aFlatMaj: {
    
    displayName:"Ab Major", 
    notes:[0, 1, 3, 5, 7, 8, 10]
  },

  dFlatMaj: {
    
    displayName:"Db Major", 
    notes:[0, 1, 3, 5, 6, 8, 10]
  },

  aMin: {
    
    displayName:"A Harmonic Minor", 
    notes:[0, 2, 4, 5, 8, 9, 11]
  },
  
  eMin: {
    
    displayName:"E Harmonic Minor", 
    notes:[0, 3, 4, 6, 7, 9, 11]
  },
  
  bMin: {
    
    displayName:"B Harmonic Minor", 
    notes:[1, 2, 4, 6, 7, 10, 11]
  },
  
  fSharpMin: {
    
    displayName:"F# Harmonic Minor", 
    notes:[1, 2, 5, 6, 8, 9, 11]
  },

  cSharpMin: {
    
    displayName:"C# Harmonic Minor", 
    notes:[1, 3, 4, 6, 8, 9, 0]
  },

  gSharpMin: {
    
    displayName:"G# Harmonic Minor", 
    notes:[1, 3, 4, 6, 8, 10, 11]
  },

  dSharpMin: {
    
    displayName:"D# Harmonic Minor", 
    notes:[2, 3, 5, 6, 8, 10, 11]
  },

  dMin: {
    
    displayName:"D Harmonic Minor", 
    notes:[1, 2, 4, 5, 7, 9, 10]
  },

  gMin: {
    
    displayName:"G Harmonic Minor", 
    notes:[0, 2, 3, 6, 7, 9, 10]
  },

  cMin: {
    
    displayName:"C Harmonic Minor", 
    notes:[0, 1, 3, 5, 7, 8, 11]
  },

  fMin: {
    
    displayName:"F Harmonic Minor", 
    notes:[0, 1, 4, 5, 7, 8, 10]
  },

  bFlatMinor: {
    
    displayName:"Bb Harmonic Minor", 
    notes:[0, 1, 3, 5, 6, 9, 10]
  },


  eMinPent:  {
    
    displayName:"E minor pentatonic", 
    notes:[2, 4, 7, 9, 11]
  }
};

//create an object with C Major midi notes as a starting point/reference
let chosenScale = scales.cMaj.notes;

//establish I/O
  let myInput = WebMidi.inputs[0];
  let myOutput = WebMidi.outputs[0];

//assign established I/O names to their designated selection on the website
  let dropIns = document.getElementById("dropdown-ins");
  let dropOuts = document.getElementById("dropdown-outs");
  let dropScale = document.getElementById("dropdown-scale");

//Gives each option on the dropdown its correct name in association with the scale above
  for (let scaleName in scales) {
    dropScale.innerHTML += `<option value=${scaleName}>${scales[scaleName].displayName}</option`;
  };


  WebMidi.inputs.forEach(function (input, num) {
    dropIns.innerHTML += `<option value=${num}>${input.name}</option`;
  });

  WebMidi.outputs.forEach(function (output, num) {
    dropOuts.innerHTML += `<option value=${num}>${output.name}</option>`;
  });


//Recursion function
  const remap = function (midi_number) {
    if (chosenScale.includes(midi_number % 12)) {
      return midi_number;
    } else {
      return remap(midi_number - 1);
    }
  };

  //Establish function to start/stop notes in the playback engine
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

//Has the program watch for when a user changes something in the selection menu
dropOuts.addEventListener("change", function () {
  myOutput = WebMidi.outputs[dropOuts.value].channels[1];
});

dropScale.addEventListener("change", function () {
  console.log(dropScale.value);
  chosenScale = scales[dropScale.value].notes;
  console.log(dropScale.value);
});