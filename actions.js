import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const RNCallKeepModule = NativeModules.RNCallKeep;
const eventEmitter = new NativeEventEmitter(RNCallKeepModule);

const RNCallKeepDidReceiveStartCallAction = 'RNCallKeepDidReceiveStartCallAction';
const RNCallKeepPerformAnswerCallAction = 'RNCallKeepPerformAnswerCallAction';
const RNCallKeepPerformEndCallAction = 'RNCallKeepPerformEndCallAction';
const RNCallKeepDidActivateAudioSession = 'RNCallKeepDidActivateAudioSession';
const RNCallKeepDidDisplayIncomingCall = 'RNCallKeepDidDisplayIncomingCall';
const RNCallKeepDidPerformSetMutedCallAction = 'RNCallKeepDidPerformSetMutedCallAction';
const RNCallKeepDidPerformHoldAction = 'RNCallKeepDidPerformHoldAction';
const RNCallKeepDidPerformUnHoldAction = 'RNCallKeepDidPerformUnHoldAction';
const RNCallKeepDidPerformDTMFAction = 'RNCallKeepDidPerformDTMFAction';
const isIOS = Platform.OS === 'ios';

const didReceiveStartCallAction = handler => {
  const listener = eventEmitter.addListener(
    RNCallKeepDidReceiveStartCallAction, (data) => {
      handler(isIOS ? data : { handle: data.number });
    }
  );

  if (isIOS) {
    RNCallKeepModule._startCallActionEventListenerAdded();
  }

  return listener;
};

const answerCall = handler =>
  eventEmitter.addListener(RNCallKeepPerformAnswerCallAction, (data) => handler(isIOS ? data : {}));

const endCall = handler =>
  eventEmitter.addListener(RNCallKeepPerformEndCallAction, (data) => { handler(isIOS ? data : {}); });

const didActivateAudioSession = handler =>
  eventEmitter.addListener(RNCallKeepDidActivateAudioSession, () => { handler(); });

const didDisplayIncomingCall = handler =>
  eventEmitter.addListener(RNCallKeepDidDisplayIncomingCall, (data) => { handler(isIOS ? data.error : null); });

const didPerformSetMutedCallAction = handler =>
  eventEmitter.addListener(RNCallKeepDidPerformSetMutedCallAction, (data) => { handler(data.muted); });

const didPerformDTMFAction = handler => {
  // @TODO: handle DTMF on iOS
  if (isIOS) {
    return;
  }

  eventEmitter.addListener(RNCallKeepDidPerformDTMFAction, (data) => { handler(data.dtmf); });
};

export const listeners = {
  didReceiveStartCallAction,
  answerCall,
  endCall,
  didActivateAudioSession,
  didDisplayIncomingCall,
  didPerformSetMutedCallAction,
  didPerformDTMFAction,
};

