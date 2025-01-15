declare module '*.png';
declare module '*.svg';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.ico';

// declare global {
//   interface FormData {
//     entries(): Iterator<[USVString, USVString | Blob]>;
//   }
// }

type FormDataRecord = Record<string, string | object>;
