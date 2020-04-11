
import React, { useState, useEffect } from 'react'

import { Chat, Channel, ChannelHeader, Thread, Window } from 'stream-chat-react';
import { MessageList, MessageInput } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import { gql } from 'apollo-boost';
import { useQuery } from "urql"


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


export default EggheadChat