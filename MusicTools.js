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

    export default MusicTools;