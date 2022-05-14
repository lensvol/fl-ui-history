export default function sortByDate(a: { date: any }, b: { date: any }) {
  return Math.sign(new Date(a.date).valueOf() - new Date(b.date).valueOf());
}