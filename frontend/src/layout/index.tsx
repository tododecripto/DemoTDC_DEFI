import type { FunctionComponent, PropsWithChildren } from 'react'
import './index.css'

export function Layout(props: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      {props.children}
    </div>
  )
}

export function withLayout<T extends FunctionComponent<any>>(Component: T, Custom?: FunctionComponent) {
  function Wither(props: any) {
    return (
      <Layout>
        <Component {...props} />
      </Layout>
    )
  }
  return Custom || Wither
}