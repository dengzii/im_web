import {Box, Divider, IconButton, List, ListItem, Typography} from "@material-ui/core";
import {useEffect, useRef, useState} from "react";
import {ChatMessageComp} from "./Message";
import {Chat, ChatMessage} from "../im/chat";
import {Send} from "@material-ui/icons";
import {GroupMemberList} from "./GroupMemberList";

function scrollBottom(ele: HTMLUListElement | null) {
    if (ele == null) {
        return
    }
    const from = ele.scrollHeight
    const to = ele.scrollTop
    if (from - to > 400) {
        ele.scrollTop = from + 100
    }
}

export function ChatRoom(props: { chat: Chat | null }) {

    console.log("ChatRoom", "enter chat room, ", props.chat?.UcId)
    const messageListEle = useRef<HTMLUListElement>()
    const [messages, setMessages] = useState(props.chat?.getMessage() ?? [])
    const isGroupChat = ((props?.chat?.ChatType ?? 1) === 2)

    useEffect(() => {
        if (props.chat === null) {
            return
        }
        const onMessage = (m: ChatMessage) => {
            console.log("ChatRoom", "onNewMessage", m)
            setMessages(() => [...props.chat.getMessage()])
            scrollBottom(messageListEle.current)
        }
        props.chat.setMessageListener(onMessage)
        setMessages(() => [...props.chat.getMessage()])
        return () => props.chat.setMessageListener(null)
    }, [props.chat, isGroupChat])

    const sendMessage = (msg: string) => {
        if (props.chat && msg.trim().length !== 0) {
            props.chat.sendMessage(msg)
        }
    }
    const memberList = isGroupChat ? <><GroupMemberList chat={props.chat}/> <Divider/></> : <></>

    return (
        <Box>
            <Box height={"70px"} paddingLeft={"16px"}>
                <Typography variant={"h6"} style={{lineHeight: "70px"}}>
                    {props.chat == null ? "" : props.chat.Title}
                </Typography>
            </Box>
            <Divider/>
            {memberList}
            <Box height={(isGroupChat ? "470px" : "510px")}>
                <List ref={messageListEle} disablePadding style={{overflow: "auto", maxHeight: "100%"}}
                      className={"BeautyScrollBar"}>
                    {
                        messages.flatMap(value =>
                            (<ListItem key={`${value.Mid}`}>
                                <ChatMessageComp msg={value}/>
                            </ListItem>)
                        )
                    }
                </List>
            </Box>
            <Divider/>
            <Box style={{height: "100px", padding: "10px"}}>
                <textarea style={{height: "60px", width: "96%", border: "none", outline: "none", resize: "none"}}
                          onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                  e.preventDefault()
                                  sendMessage(e.currentTarget.value)
                                  e.currentTarget.value = ""
                              }
                          }}/>
                <IconButton color={"primary"} size={"small"} style={{float: "right"}}>
                    <Send/>
                </IconButton>
            </Box>
        </Box>
    )
}

