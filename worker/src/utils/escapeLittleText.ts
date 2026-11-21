export function escapeLittleText(text: string): string {
  return text.replace(/[\\|{}@\[\]()<>#*_~]/g, "\\$&");
}
