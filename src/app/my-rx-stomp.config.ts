import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import { environment } from 'src/environments/environment';

export const myRxStompConfig: InjectableRxStompConfig = {
  brokerURL: 'ws://localhost:8080/ws',

  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 5000 (5 seconds)
  reconnectDelay: 5000,
  logRawCommunication: true,

  beforeConnect: (client) => {
    const jwt = window.sessionStorage.getItem(environment.JWT_KEY);
    if (jwt) {
      client.configure({
        ...client,
        connectHeaders: { Authorization: `Bearer ${jwt}` },
      });
    }
  },

  // Will log diagnostics on console
  // It can be quite verbose, not recommended in production
  // Skip this key to stop logging to console
  // debug: (msg: string): void => {
  //   console.log(new Date(), msg);
  // },
};
