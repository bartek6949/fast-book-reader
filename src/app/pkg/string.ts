declare global {
  interface String {
    escape(): string;
    unescape(): string;
  }
}

String.prototype.escape = function () {
  return this.replace(/&/g, '&amp;')
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

String.prototype.unescape = function () {
  return this.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

export {};
