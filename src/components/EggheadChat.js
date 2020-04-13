
import React, { useState, useEffect } from 'react'

import { Chat, Channel, ChannelHeader, Thread, Window } from 'stream-chat-react';
import { MessageList, MessageInput } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';

import { Styled } from 'theme-ui'
import Layout from '../components/layout'
import ReactPlayer from "react-player"



let chatClient = new StreamChat('mynhafqjjrh2');


let EggheadChat = ({ id, full_name, email, avatar_url, is_instructor, is_pro }) => {
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
                        name: full_name,
                        image: avatar_url
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


ReactPlayer.displayName = "eggheadLivePlayer"


const IndexPage = () => {

    let [user, setUser] = useState(null)
    useEffect(() => {
        fetch(`/api/v1/users/current`)
            .then((response) => response.json())
            .then((user) => {
                setUser(user)
            })
    }, [])


    return <div>
        <Layout title="Live">

            <Styled.h1>
                egghead live
            </Styled.h1>

            <div style={{ display: "flex" }}>

                <ReactPlayer
                    url="https://stream.mux.com/8w8a7d8kuWTthNxqQx73AvFf2OCeOpNafgtaN6U5H9U.m3u8"
                    controls playing></ReactPlayer>

                {user && <EggheadChat {...user}></EggheadChat>}
            </div>
        </Layout>
    </div>

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

