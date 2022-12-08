import { Component, createElement } from "react";
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
        const { socketUrl, onMessage, messageAttribute, onConnect } = this.props;
        if (socketUrl.status !== "available" || messageAttribute.status !== "available") return;
        if (this.state.isConnected === false) {
            const ws = new WebSocket(socketUrl.value);
            ws.onopen = () => {
                console.trace(`connected to websocket at ${socketUrl.value}`);
                this.setState({ isConnected: true });
                if (onConnect && onConnect.canExecute) {
                    onConnect.execute();
                }
            };
            ws.onclose = () => {
                console.trace(`disconnected from websocket`);
                this.setState({ isConnected: false });
            };
            ws.onmessage = message => {
                messageAttribute.setValue(message.data);
                if (onMessage && onMessage.canExecute) {
                    onMessage.execute();
                }
            };
            this._ws = ws;
            window.mx.__ws = window.mx.__ws || {};
            window.mx.__ws[socketUrl.value] = ws;
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

// export default hot(WebSocketClient);
