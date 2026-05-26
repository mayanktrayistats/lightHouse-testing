import { getSettings } from "./config";

export const IMG = (path) => {
  const settings = getSettings();
  const folder = settings.si ? "avif-images" : "jpg-images";
  const ext = settings.si ? "avif" : "jpg";
  return `/${folder}/${path}.${ext}`;
};