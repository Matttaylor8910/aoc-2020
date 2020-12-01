enum Fancy {
  NERD = 'NERD'
}

function doIt(fancy: Fancy): boolean {
  return Fancy.NERD === fancy;
}

console.log(doIt(Fancy.NERD));