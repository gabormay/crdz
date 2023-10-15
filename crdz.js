// C major diatonic scale
// Notes are strings of [A-G](b*|#*)
const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Musical scales
// Specified as half-note distances from the tonic
const sclMajor = [0, 2, 4, 5, 7, 9, 11];
const sclMinor = [0, 2, 3, 5, 7, 8, 10];

// acschually, chords with third steps can be treated just as above
const thirdnotes = ['C', 'E', 'G', 'B', 'D', 'F', 'A'];

const sclMaj3 = [0, 4, 7];
const sclMin3 = [0, 3, 7];
const sclDim3 = [0, 3, 6];
const sclAug3 = [0, 4, 8];

const scl4Dom7  = [0, 4, 7, 10];
const scl4Min7  = [0, 3, 7, 10];
const scl4Maj7  = [0, 4, 7, 11];
const scl4MMaj7 = [0, 3, 7, 11];

const scl4Dim7 = [0, 3, 6, 9];
const scl4m75b = [0, 3, 6, 10];
const scl475x =  [0, 4, 8, 10];

const scl4Maj6 = [0, -1, 4, -1, 7, 9];
const scl4Min6 = [0, -1, 3, -1, 7, 9];

// Given a tonic note and a scale specification,
// generates an array of notes representing the scale
// Every base note has to appear once and only once.
function genScaleNotes(tonic, scl, notes)
{
    // start with the tonic        
    result = [tonic];
    itonic = note2i(notes, tonic);
    acc = naccidental(tonic);
    for (let i = 1; i < scl.length; i++) {
        nextNote = notes[(itonic + i) % notes.length];
        // skip?
        if (scl[i] < 0) continue;
        // chromatic distance from desired
        dist = noteDist(tonic, nextNote) - scl[i];
        // minimize for number of accidentals
        // TODO: should take context into account, don't follow D####### with Ebbbbbbb, etc.
        if (dist > 6 ) dist = dist - 12;
        if (dist < -6) dist = dist + 12;
        //console.log(nextNote, dist);
        while (dist != 0) {
            nextNote = nextNote + (dist>0 ? "b" : "#");
            dist += dist>0 ? -1 : 1;
        }
        result.push(nextNote);
    }
    return result;
}

// chromatic distance between the two notes
function noteDist(note1, note2) { 
    i1 = note2i(notes, note1);
    acc1 = naccidental(note1);
    i2 = note2i(notes, note2);
    acc2 = naccidental(note2);
    //console.log(sclMajor[i1], acc1, sclMajor[i2], acc2);
    // stupid js mod operator (gives negative results...)
    return (((sclMajor[i2]+acc2-sclMajor[i1]-acc1) % 12 ) + 12) % 12;
}

function note2i(notes, n) {
    nbase = note2base(n);
    for (let i = 0; i < notes.length; i++) {
        if (notes[i] == nbase)
            return i;
    }
    console.error("Note not found: ", n, notes);
}

// get the base note of the note (without accidentals)
function note2base(n) {
    return n.substring(0,1);
}

// get the accidentals as a number:
// positive number: number of sharps, negative number: number of flats
// zero: no accidental
function naccidental(note) {
    sharps = (note.match(/#/g) || []).length;
    flats = (note.match(/b/g) || []).length;
    if (sharps > 0) return sharps;
    if (flats > 0) return -flats;
    return 0; // no accidentals
}