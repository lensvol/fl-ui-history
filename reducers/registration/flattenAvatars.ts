export default function flattenAvatars(payload: {
  gentlemanAvatars: string[];
  ladyAvatars: string[];
  indistinctAvatars: string[];
}) {
  return [
    ...payload.gentlemanAvatars,
    ...payload.ladyAvatars,
    ...payload.indistinctAvatars,
  ];
}
