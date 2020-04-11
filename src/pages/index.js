import React, { useState, useEffect } from 'react'
import { Styled } from 'theme-ui'
import Layout from '../components/layout'
import ReactPlayer from "react-player"

import { useOneGraphAuth } from "use-one-graph"
import { createClient, useQuery, Provider as UrqlProvider } from "urql"
import loadable from "@loadable/component"



//'https://serve.onegraph.com/dynamic?app_id=0b33e830-7cde-4b90-ad7e-2a39c57c0e11'


const AuthContext = React.createContext()







ReactPlayer.displayName = "eggheadLivePlayer"

let EggheadChat = loadable(() => import("../components/EggheadChat"))


const IndexPage = () => {


  // useEffect(() => {
  //   setLogin(document.cookie)
  // }, [])
  let appId = "17479ea7-24d3-4724-ab82-b4664e5004b3"
  let auth = useOneGraphAuth("eggheadio", appId)

  let client = createClient({
    url: "https://serve.onegraph.com/dynamic?app_id=" + appId,
    fetchOptions: () => {
      let token = auth.client.accessToken().accessToken
      // console.log({ auth })
      // console.log({ token })
      return {
        headers: { authorization: token ? `Bearer ${token}` : '' }
      }
    }
  })



  return (
    <AuthContext.Provider value={auth}>
      <Layout title="Live">
        <button onClick={() => auth.login("eggheadio")}>Login with egghead.io</button>
        <Styled.h1>
          egghead live
        </Styled.h1>

        <div style={{ display: "flex" }}>

          <ReactPlayer
            url="https://stream.mux.com/8w8a7d8kuWTthNxqQx73AvFf2OCeOpNafgtaN6U5H9U.m3u8"
            controls playing></ReactPlayer>

          <UrqlProvider value={client}>
            <EggheadChat></EggheadChat>
          </UrqlProvider>




        </div>


      </Layout>
    </AuthContext.Provider >
  )
}

export default IndexPage


/*
<ReactPlayer
                  onPlayerInitialized={setPlayer}
                  title={lesson.title}
                  hls_url={hls_url}
                  dash_url={dash_url}
                  displaySubtitles={displaySubtitles}
                  subtitlesUrl={subtitlesUrl}
                  url={url}
                  poster={poster}
                  playing={
                    (autoStart && !canCaptureEmail) || forcedPlaybackStart
                  }
                  playbackRate={playbackRate}
                  height="100%"
                  width="100%"
                  location={location}
                  onDuration={setDuration}
                  onProgress={onVideoProgress}
                  onEnded={onVideoEnded}
                  onError={onVideoError}
                  onVideoQualityChanged={onVideoQualityChanged}
                  videoQualityCookie={toJS(videoQualityCookie)}
                  progressFrequency={100}
                  onSubtitleChange={onSubtitleChange}
                />

                {Boolean(videoPlayerError) && !canCaptureEmail && (
                  <VideoPlayerError
                    title="Possible Chrome Extension Conflict"
                    message={allowControlPlayerErrorMessage}
                  />
                )}


 */

