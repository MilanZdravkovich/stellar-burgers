import type {
  Middleware,
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
} from '@reduxjs/toolkit';

export type TWSActions<TMessage> = {
  wsConnect: ActionCreatorWithPayload<string>;
  wsDisconnect: ActionCreatorWithoutPayload;
  wsOpen: ActionCreatorWithoutPayload;
  wsClose: ActionCreatorWithoutPayload;
  wsError: ActionCreatorWithPayload<string>;
  wsMessage: ActionCreatorWithPayload<TMessage>;
};

export const createSocketMiddleware = <TMessage>(
  actions: TWSActions<TMessage>
): Middleware => {
  return (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action) => {
      const { dispatch } = store;

      if (actions.wsConnect.match(action)) {
        socket = new WebSocket(action.payload);

        socket.onopen = (): void => {
          dispatch(actions.wsOpen());
        };

        socket.onerror = (): void => {
          dispatch(actions.wsError('Ошибка WebSocket-соединения'));
        };

        socket.onmessage = (event: MessageEvent<string>): void => {
          const parsed = JSON.parse(event.data) as unknown as TMessage;
          dispatch(actions.wsMessage(parsed));
        };

        socket.onclose = (): void => {
          dispatch(actions.wsClose());
        };
      }

      if (actions.wsDisconnect.match(action) && socket) {
        const closingSocket = socket;
        socket = null;

        if (closingSocket.readyState === WebSocket.OPEN) {
          closingSocket.close();
        } else if (closingSocket.readyState === WebSocket.CONNECTING) {
          closingSocket.addEventListener('open', () => closingSocket.close());
        }
      }

      next(action);
    };
  };
};
