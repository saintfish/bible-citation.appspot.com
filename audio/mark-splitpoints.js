var app = angular.module('splitpointsApp',[]);

app.controller("AudioAnnotatorCtrl", ["$scope", "$sce", function($scope, $sce) {
    $scope.audio = {};
    $scope.setAudio = function () {
        $scope.audio.loaded = false;
        $scope.audio.url = $sce.trustAsResourceUrl("http://audio.wordproaudio.com/bibles/app/audio/4/" + $scope.ref.book + "/" + $scope.ref.chapter + ".mp3");
        $scope.audio.bibleUrl = $sce.trustAsResourceUrl(sprintf("http://www.wordproject.org/bibles/gb/%02d/%d.htm", $scope.ref.book, $scope.ref.chapter));
    };
    var a = document.getElementById("audio");
    a.oncanplaythrough = function () {
        if ($scope.audio.loaded) return;
        $scope.$apply(function () {
            $scope.audio.loaded = true;
            $scope.splitpoints = [0, a.duration];
        });
    };
    $scope.moveAudioTime = function (t) {
        a.currentTime += t;
    };
    $scope.setAudioTime = function (t) {
        a.currentTime = t;
    };
    $scope.addSplitpoint = function () {
        var t = a.currentTime;
        if ($scope.splitpoints.indexOf(t) >= 0) return;
        $scope.splitpoints.push(t);
        $scope.splitpoints.sort(function(a, b){return a-b;});
    };
    $scope.trackList = function () {
        var lines = [];
        for (var i = 0; i < $scope.splitpoints.length - 1; i++) {
            var curr = $scope.splitpoints[i];
            var next = $scope.splitpoints[i + 1];
            var label = i.toString();
            if (i === 0) {
                label = $scope.ref.book + "-" + $scope.ref.chapter;
            }
            // lines.push([curr, next, label].join("\t"));
            lines.push(sprintf("%0.6f\t%0.6f\t%s", curr, next, label))
        }
        return lines.join("\n");
    };
    $("#trackList").focus(function() {
        $(this).select();
    });
}]);