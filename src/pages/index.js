import React, { useState, useEffect } from 'react'
import { Styled } from 'theme-ui'
import Layout from '../components/layout'
import ReactPlayer from "react-player"
import { Chat, Channel, ChannelHeader, Thread, Window } from 'stream-chat-react';
import { MessageList, MessageInput } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import Cookies from "js-cookie"
import gravatar from "gravatar"
import { useOneGraphAuth } from "use-one-graph"
import { gql } from 'apollo-boost';
import { createClient, useQuery, Provider as UrqlProvider } from "urql"


//'https://serve.onegraph.com/dynamic?app_id=0b33e830-7cde-4b90-ad7e-2a39c57c0e11'


const AuthContext = React.createContext()


const EGGHEADIO_IDENTITY_QUERY = gql`
  query eggheadIdentityQuery {
    __typename
    me {
      eggheadio {
        id
        fullName
        email
        avatarUrl
        isInstructor
      }
    }
  }`



const chatClient = new StreamChat('mynhafqjjrh2');

ReactPlayer.displayName = "eggheadLivePlayer"

let Egghead = () => {
  let [result, reQuery] = useQuery({
    query: EGGHEADIO_IDENTITY_QUERY
  })

  if (!result.data) return null
  if (!result.data.me) return null

  console.log(result.data.me.eggheadio)

  return <EggheadChat {...result.data.me.eggheadio} />
}

let EggheadChat = ({ id, fullName, email, avatarUrl, isInstructor }) => {
  console.log("EggheadChat", email)
  let [channel, setChannel] = useState(null)

  useEffect(() => {

    fetch("http://localhost:3000", {
      method: "post",
      body: JSON.stringify({ id: id.toString() })
    })
      .then(response => response.json())
      .then(async ({ id, token }) => {
        console.log({ id, token })

        chatClient.setUser(
          {
            id,
            name: fullName,
            image: avatarUrl
          },
          token,
        );

        const channel = chatClient.channel('livestream', 'egghead-live', {
          // add as many custom fields as you'd like
          image: 'https://pbs.twimg.com/profile_images/735242324293210112/H8YfgQHP_400x400.jpg',
          name: 'egghead.io chat',
        });




        await channel.create()

        setChannel(channel)
      })
  }, [])

  return (<Chat client={chatClient} theme={'messaging light'} >
    <Channel channel={channel}>
      <Window>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Window>
      <Thread />
    </Channel>
  </Chat>)
}


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
      console.log({ auth })
      console.log({ token })
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
            url="https://player.twitch.tv/johnlindquist"
            controls playing></ReactPlayer>

          <UrqlProvider value={client}>
            <Egghead>
            </Egghead>
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

