// setTimeOut required, even though there is no time out time. This will ensure that the data is reversed. It is some sort of bug.
var finalLocationData;
var finalMusicData;

function reverseData() {
    setTimeout(function() {
        finalLocationData = data.reverse();
        finalMusicData = musicData.reverse();
    });

    if (finalLocationData && finalMusicData) {
        return true;
    }

}

function sortData() {
    var checkIfReversed = reverseData();
}


