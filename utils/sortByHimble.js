const himble = _ => parseInt(_.himbleLevel, 10) || 0;
const sortByHimble = (a, b) => Math.sign(himble(a) - himble(b));
export default sortByHimble;