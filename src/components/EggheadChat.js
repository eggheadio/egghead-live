
import React, { useState, useEffect } from 'react'

import { Chat, Channel, ChannelHeader, Thread, Window } from 'stream-chat-react';
import { MessageList, MessageInput } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import { gql } from 'apollo-boost';
import { useQuery } from "urql"
import { Styled } from 'theme-ui'
import Layout from '../components/layout'
import ReactPlayer from "react-player"

import { useOneGraphAuth } from "use-one-graph"
import { createClient, Provider as UrqlProvider } from "urql"


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

let chatClient = new StreamChat('mynhafqjjrh2');
let EggheadChat = () => {
    let [result, reQuery] = useQuery({
        query: EGGHEADIO_IDENTITY_QUERY
    })

    if (!result.data) return null
    if (!result.data.me) return null
    if (!result.data.me.eggheadio) return null
    if (!result.data.me.eggheadio.id) return null

    // console.log(result.data.me.eggheadio)

    return <StreamChatWrapper {...result.data.me.eggheadio} />
}

let StreamChatWrapper = ({ id, fullName, email, avatarUrl, isInstructor }) => {
    console.log("EggheadChat", email, id)
    let [channel, setChannel] = useState(null)

    useEffect(() => {

        fetch("https://heuristic-villani-1ac7bb.netlify.com/.netlify/functions/chat", {
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


const AuthContext = React.createContext()


ReactPlayer.displayName = "eggheadLivePlayer"

let ClientStuff = ({ auth, url }) => {

    console.log({ auth, url })
    let client = createClient({
        url,
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
        <Layout title="Live">

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
    )
}


const IndexPage = () => {
    let appId = "17479ea7-24d3-4724-ab82-b4664e5004b3"

    let auth = useOneGraphAuth("eggheadio", appId)
    let url = "https://serve.onegraph.com/dynamic?app_id=" + appId

    if (auth.client === null) return null

    return <AuthContext.Provider value={auth}>
        {auth.authenticated
            ? <div>

                <button onClick={() => auth.logout("eggheadio")}>Logout of egghead.io</button>
                <ClientStuff auth={auth} url={url} />
            </div>
            : <div><button onClick={() => auth.login("eggheadio")}>Login with egghead.io</button></div>
        }
    </AuthContext.Provider >
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

