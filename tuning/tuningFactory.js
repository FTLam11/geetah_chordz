var tuning = angular.module('geetah');

tuning.factory('Tuning', function() {
  const INTERVAL_SYMBOLS = ["1", "b2", "2", "b3", "3", "4", "b5", "5", "#5", "6", "b7", "7"];

  const FLAT_TO_SHARP = {
  "Bb": "A#",
  "Db": "C#",
  "Eb": "D#",
  "Gb": "F#",
  "Ab": "G#"
  };

  const SHARP_TO_FLAT = {
  "A#": "Bb",
  "C#": "Db",
  "D#": "Eb",
  "F#": "Gb",
  "G#": "Ab"  
  };
  
  const COLOR_INTERVALS = {
    "1": "#d10000",
    "b2": "#E5E4D0",
    "2": "#ff6622",
    "b3": "#BFBEAD",
    "3": "#ffda21",
    "4": "#33dd00",
    "b5": "#BAB9A9",
    "5": "#1133cc",
    "#5": "#7F7F74",
    "6": "#220066",
    "b7": "#42423D",
    "7": "#60007F"
  };

  var Tuning = function(tuning, root) {
    this.name =  this.validateName(tuning);
    this.notes = this.parse(this.name);
    this.root = this.validateRoot(root);
    this.intervals = this.intervals();
  };

  Tuning.prototype.validateName = function(tuning) {
    if (this.validLength(tuning) && this.validChars(tuning) && this.validAccidentals(tuning)) {
      return tuning;
    } else {
      throw new TuningError("The name of this tuning is not valid.");
    };
  };

  Tuning.prototype.validLength = function(tuning) {
    return (tuning.length >= 6 && tuning.length < 13);
  };

  Tuning.prototype.validChars = function(tuning) {
    return (tuning.match(/[^A-Gb#]/) === null) 
  };

  Tuning.prototype.validAccidentals = function(tuning) {
    return (tuning.match(/^[#b]/) === null) && (tuning.match(/[BE]#/) === null) && (tuning.match(/[CF]b/) === null)
  };

  Tuning.prototype.parse = function() {
    return this.name.split(/(?=[A-G][#b]?)/);
  };

  Tuning.prototype.intervals = function() {
    var notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

    if (this.notes.some(note => note.match(/.{1}b/) != null)) {
      notes = this.normalizeToFlat(notes);
    };

    var tuningNoteIntervals = [];
    var currentNoteIndex = notes.indexOf(this.root);

    if (currentNoteIndex == -1) {
      currentNoteIndex = notes.indexOf(SHARP_TO_FLAT[this.root]);
    };
    
    if (currentNoteIndex == -1) {
      currentNoteIndex = notes.indexOf(FLAT_TO_SHARP[this.root]);
    };

    for (var i = 0; i < 12; i++) {
      var noteObj = {};
      noteObj['note'] = notes[currentNoteIndex % 12];
      noteObj['interval'] = INTERVAL_SYMBOLS[i];
      noteObj['color'] = COLOR_INTERVALS[INTERVAL_SYMBOLS[i]];
      noteObj['chordInterval'] = undefined;
      noteObj['showInterval'] = false;
      tuningNoteIntervals.push(noteObj);
      currentNoteIndex++;
    };

    return tuningNoteIntervals;
  };

  Tuning.prototype.normalizeToFlat = function(notesArr) {
    var flattened = notesArr.slice();

    for (var sharp in SHARP_TO_FLAT) {
      if (SHARP_TO_FLAT.hasOwnProperty(sharp) && flattened.indexOf(sharp) > -1) {
        flattened.splice(flattened.indexOf(sharp), 1, SHARP_TO_FLAT[sharp]);
      };
    };

    return flattened;
  };

  Tuning.prototype.validateRoot = function(rootNote) {
    if (rootNote.match(/[A-G][#b]?/) != rootNote) {
      throw new RootError("The given root note is invalid.");
    } else {
      rootNote[0].toUpperCase();
    };

    return rootNote;
  };

  function TuningError(message) {
    this.message = message;
    this.name = "TuningError";
  };

  function RootError(message) {
    this.message = message;
    this.name = "RootError";
  };

  return Tuning;
});