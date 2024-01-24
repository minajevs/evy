// pattern from https://heropatterns.com/
// translateY: Move pattern by X pixels from bottom. Needed to stitch together two patterns. Move from bottom -> height minus transalteY
export const backgroundPattern = (
  fill: string,
  opacity: number,
  translateY: number,
) =>
  `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f83b5b' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`
