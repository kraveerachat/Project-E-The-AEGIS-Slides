import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/manrope'
import '@fontsource/noto-sans-thai/400.css'
import '@fontsource/noto-sans-thai/500.css'
import './styles.css'
import App from './App'

class PresentationErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <main className="app-error"><h1>The presentation could not load.</h1><p>Reload to return to the current scene. If this persists, check the asset manifest and content configuration.</p><button onClick={() => window.location.reload()}>Reload presentation</button></main> : this.props.children }
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><PresentationErrorBoundary><App /></PresentationErrorBoundary></React.StrictMode>)
