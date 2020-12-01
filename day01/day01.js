var Fancy;
(function (Fancy) {
    Fancy["NERD"] = "NERD";
})(Fancy || (Fancy = {}));
function doIt(fancy) {
    return Fancy.NERD === fancy;
}
console.log(doIt(Fancy.NERD));
