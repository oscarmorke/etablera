import React, { useEffect } from 'react'
import GlobalStyle from '../GlobalStyle'
import Header from '../components/Header'
import styled from 'styled-components'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeContextProvider } from '../contexts/ThemeContext'
import { SettingsContextProvider } from '../contexts/SettingsContext'
import { UiContextProvider } from '../contexts/UiContext'
import CaseTransitionIndicator from '../components/cases/TransitionIndicator'
import PageLoader from './page-loader/PageLoader'
import Head from './Head'
import DefferedCallbacks from '../utils/deferred-callbacks'
import { init } from '../utils/scroll/smooth-scroll'
import useScheduleEffect, { SchedulePrio } from '../hooks/useScheduleEffect'
import { pageWrapper } from '../utils/dom-selectors'
import { getCleanPath } from '../utils/url'
import Footer from './Footer'
import PwaRefresh from './PwaRefresh'
import Transition from './Transition'

const PageWrapper = styled.div`
  margin: 0 auto;
  height: 100%;
`

const PageLayout = ({ children, pageContext, location }) => {
  useEffect(() => {
    init()
    DefferedCallbacks.loadPrimaryDependencies()
  }, [])

  useScheduleEffect(() => {
    DefferedCallbacks.loadSecondaryDependencies()
  }, [SchedulePrio.Idle])

  const currPath = getCleanPath(location.pathname)
  const isFrontpage = currPath === '/'
  const showFooter = !['/cases', '/feed'].includes(currPath)

  return (
    <HelmetProvider>
      <PageWrapper {...pageWrapper.attr} id="page-wrapper">
        <ThemeContextProvider>
          <UiContextProvider isFrontpage={isFrontpage}>
            <PageLoader isFrontpage={isFrontpage} />

            <SettingsContextProvider
              currPath={currPath}
              locale={pageContext.locale}
            >
              <Head />
              <GlobalStyle />

              <Header currentPath={currPath} />
              <main>{children}</main>
              {showFooter && <Footer />}
              <PwaRefresh />
            </SettingsContextProvider>
          </UiContextProvider>
        </ThemeContextProvider>
      </PageWrapper>

      <CaseTransitionIndicator />

      <div id="extra-cursor"></div>
    </HelmetProvider>
  )
}

export default PageLayout
