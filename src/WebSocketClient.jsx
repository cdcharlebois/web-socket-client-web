import { Component, createElement, useEffect, useState } from "react";
import { hot } from "react-hot-loader/root";

import "./ui/WebSocketClient.css";

export class WebSocketClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: false
        };
        this._ws = null;
    }
    componentDidUpdate() {
        const { socketUrl, onMessage, messageAttribute } = this.props;
        if (socketUrl.status !== "available" || messageAttribute.status !== "available") return;
        if (this.state.isConnected === false) {
            const ws = new WebSocket(socketUrl.value);
            ws.onopen = () => {
                console.trace(`connected to websocket at ${socketUrl.value}`);
                this.setState({ isConnected: true });
            };
            ws.onclose = () => {
                console.trace(`disconnected from websocket`);
                this.setState({ isConnected: false });
            };
            ws.onmessage = message => {
                messageAttribute.setValue(message.data);
                if (onMessage.canExecute) {
                    onMessage.execute();
                }
            };
            this._ws = ws;
        }
    }

    componentWillUnmount() {
        if (this._ws) {
            this._ws.close();
            console.trace(`Closed WS connection because component is unmounting.`);
        }
    }

    render() {
        return null;
    }
}

export default hot(WebSocketClient);
