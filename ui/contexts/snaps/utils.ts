import {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  File,
  FormState,
  InterfaceState,
  UserInputEventType,
} from '@metamask/snaps-sdk';

/**
 * Merge a new input value in the interface state.
 *
 * @param state - The current interface state.
 * @param name - The input name.
 * @param value - The input value.
 * @param form - The name of the form containing the input.
 * Optional if the input is not contained in a form.
 * @returns The interface state with the new value merged in.
 */
export const mergeValue = (
  state: InterfaceState,
  name: string,
  value: string | File | null,
  form?: string,
): InterfaceState => {
  if (form) {
    return {
      ...state,
      [form]: {
        ...(state[form] as FormState),
        [name]: value,
      },
    };
  }
  return { ...state, [name]: value };
};

/**
 * The values and files of a form.
 *
 * @property value - The values of the form fields, if any.
 * @property files - The files of the form fields, if any.
 */
export type FormValues = {
  value: Record<string, string | null>;
  files: Record<string, File | null>;
};

/**
 * Get the form values from the interface state. If the event is not a form
 * submit event, an empty object is returned. Otherwise, the form values are
 * extracted from the state, and the values and files are returned separately.
 *
 * @param event
 * @param state - The interface state.
 * @returns The form values.
 */
export function getFormValues(
  event: UserInputEventType,
  state?: FormState,
): Partial<FormValues> {
  if (event !== UserInputEventType.FormSubmitEvent) {
    return {};
  }

  if (!state) {
    return { value: {}, files: {} };
  }

  return Object.entries(state).reduce<FormValues>(
    (accumulator, [key, value]) => {
      const formValue = value as string | File | null;
      if (formValue) {
        if (typeof formValue === 'string') {
          accumulator.value[key] = formValue;
        } else {
          accumulator.files[key] = formValue;
        }
      }

      return accumulator;
    },
    { value: {}, files: {} },
  );
}
