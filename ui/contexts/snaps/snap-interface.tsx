import {
  File as FileObject,
  FormState,
  InterfaceState,
  UserInputEventType,
} from '@metamask/snaps-sdk';
import { debounce, throttle } from 'lodash';
import React, {
  FunctionComponent,
  createContext,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bytesToBase64 } from '@metamask/utils';
import { getMemoizedInterface } from '../../selectors';
import {
  handleSnapRequest,
  updateInterfaceState,
  forceUpdateMetamaskState,
} from '../../store/actions';
import { getFormValues, mergeValue } from './utils';

export type HandleEvent = (args: {
  event: UserInputEventType;
  name?: string;
  params?: Record<string, unknown>;
  flush?: boolean;
}) => void;

export type HandleInputChange = (
  name: string,
  value: string | null,
  form?: string,
) => void;

export type HandleFileChange = (
  name: string,
  file: File | null,
  form?: string,
) => void;

export type GetValue = (name: string, form?: string) => string | undefined;

export type SnapInterfaceContextType = {
  handleEvent: HandleEvent;
  getValue: GetValue;
  handleInputChange: HandleInputChange;
  handleFileChange: HandleFileChange;
};

export const SnapInterfaceContext =
  createContext<SnapInterfaceContextType | null>(null);

export type SnapInterfaceContextProviderProps = {
  interfaceId: string;
  snapId: string;
};

// We want button clicks to be instant and therefore use throttling
// to protect the Snap
// Any event not in this array will be debounced instead of throttled
const THROTTLED_EVENTS = [
  UserInputEventType.ButtonClickEvent,
  UserInputEventType.FormSubmitEvent,
];

/**
 * The Snap interface context provider that handles all the interface state operations.
 *
 * @param params - The context provider params.
 * @param params.children - The childrens to wrap with the context provider.
 * @param params.interfaceId - The interface ID to use.
 * @param params.snapId - The Snap ID that requested the interface.
 * @returns The context provider.
 */
export const SnapInterfaceContextProvider: FunctionComponent<
  SnapInterfaceContextProviderProps
> = ({ children, interfaceId, snapId }) => {
  const dispatch = useDispatch();
  const { state: initialState, context } = useSelector(
    (state) => getMemoizedInterface(state, interfaceId),
    // Prevents the selector update.
    // We do this to avoid useless re-renders.
    () => true,
  );

  // We keep an internal copy of the state to speed up the state update in the
  // UI. It's kept in a ref to avoid useless re-rendering of the entire tree of
  // components.
  const internalState = useRef<InterfaceState>(initialState ?? {});

  // Since the internal state is kept in a reference, it won't update when the
  // interface is updated. We have to manually update it.
  useEffect(() => {
    internalState.current = initialState;
  }, [initialState]);

  const rawSnapRequestFunction = (
    event: UserInputEventType,
    params: Record<string, unknown> = {},
  ) => {
    handleSnapRequest({
      snapId,
      origin: '',
      handler: 'onUserInput',
      request: {
        jsonrpc: '2.0',
        method: ' ',
        params: {
          event: {
            type: event,
            ...params,
          },
          id: interfaceId,
          context,
        },
      },
    }).then(() => forceUpdateMetamaskState(dispatch));
  };

  // The submission of user input events is debounced or throttled to avoid
  // crashing the snap if there's too many events sent at the same time.
  const snapRequestDebounced = debounce(rawSnapRequestFunction, 200);
  const snapRequestThrottled = throttle(rawSnapRequestFunction, 200);

  // The update of the state is debounced to avoid crashes due to too many
  // updates in a short amount of time.
  const updateStateDebounced = debounce(
    (state) => dispatch(updateInterfaceState(interfaceId, state)),
    200,
  );

  /**
   * Handle the submission of an user input event to the Snap.
   *
   * @param options - An options bag.
   * @param options.event - The event type.
   * @param options.params - Optional parameters to send with the event.
   * @param options.flush - Optional flag to indicate whether the debounce
   * should be flushed.
   * @param options.name
   */
  const handleEvent: HandleEvent = ({
    event,
    name,
    params = getFormValues(event, internalState.current[name]),
    flush = false,
  }) => {
    // We always flush the debounced request for updating the state.
    updateStateDebounced.flush();

    const fn = THROTTLED_EVENTS.includes(event)
      ? snapRequestThrottled
      : snapRequestDebounced;

    fn(event, { name, ...params });

    // Certain events have their own debounce or throttling logic
    // and therefore may want to flush
    if (flush) {
      fn.flush();
    }
  };

  const handleInputChangeDebounced = debounce(
    (
      event: UserInputEventType,
      name: string | undefined,
      params: Record<string, unknown>,
    ) =>
      handleEvent({
        event,
        name,
        params,
        flush: true,
      }),
    300,
  );

  /**
   * Handle the value change of an input.
   *
   * @param name - The name of the input.
   * @param value - The new value.
   * @param form - The name of the form containing the input.
   * Optional if the input is not contained in a form.
   */
  const handleInputChange: HandleInputChange = (name, value, form) => {
    const state = mergeValue(internalState.current, name, value, form);

    internalState.current = state;
    updateStateDebounced(state);
    handleInputChangeDebounced(UserInputEventType.InputChangeEvent, name, {
      value,
    });
  };

  /**
   * Handle the file change of an input.
   *
   * @param name - The name of the input.
   * @param file - The file to upload.
   * @param form - The name of the form containing the input.
   */
  const handleFileChange: HandleFileChange = (name, file, form) => {
    if (file) {
      file
        .arrayBuffer()
        .then((arrayBuffer) => new Uint8Array(arrayBuffer))
        .then((uint8Array) => {
          const base64 = bytesToBase64(uint8Array);
          const fileObject: FileObject = {
            name: file.name,
            size: file.size,
            contentType: file.type,
            contents: base64,
          };

          const state = mergeValue(
            internalState.current,
            name,
            fileObject,
            form,
          );

          internalState.current = state;
          updateStateDebounced(state);
          handleInputChangeDebounced(UserInputEventType.FileUploadEvent, name, {
            file: fileObject,
          });
        });

      return;
    }

    const state = mergeValue(internalState.current, name, null, form);

    internalState.current = state;
    updateStateDebounced(state);
    handleInputChangeDebounced(UserInputEventType.FileUploadEvent, name, {
      file: null,
    });
  };

  /**
   * Get the value of an input from the interface state.
   *
   * @param name - The name of the input.
   * @param form - The name of the form containing the input.
   * Optional if the input is not contained in a form.
   * @returns The value of the input or undefinded if the input has no value.
   */
  const getValue: GetValue = (name, form) => {
    const value = form
      ? (initialState[form] as FormState)?.[name]
      : (initialState as FormState)?.[name];

    if (value) {
      return value;
    }

    return undefined;
  };

  return (
    <SnapInterfaceContext.Provider
      value={{ handleEvent, getValue, handleInputChange, handleFileChange }}
    >
      {children}
    </SnapInterfaceContext.Provider>
  );
};

/**
 * The utility hook to consume the Snap inteface context.
 *
 * @returns The snap interface context.
 */
export function useSnapInterfaceContext() {
  return useContext(SnapInterfaceContext) as SnapInterfaceContextType;
}
