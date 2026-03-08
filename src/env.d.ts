declare module '*.vue' {
  const component: any
  export default component
}

declare module '*.glsl?raw' {
  const content: string
  export default content
}
