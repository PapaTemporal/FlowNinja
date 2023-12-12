export function nopropagation(event: { stopImmediatePropagation: () => void; }) {
  event.stopImmediatePropagation();
}

export default function (event: { preventDefault: () => void; stopImmediatePropagation: () => void; }) {
  event.preventDefault();
  event.stopImmediatePropagation();
}
