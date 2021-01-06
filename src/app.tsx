import { Text, Window, hot, View, CheckBox, LineEdit, Button, PlainTextEdit, Slider } from '@nodegui/react-nodegui';
import React, { useReducer, useState } from 'react';
import { QIcon, QApplication } from '@nodegui/nodegui';
import nodeguiIcon from '../assets/nodegui.jpg';

type FormReducerAction =
  | { type: 'TOGGLE_LOWER_CASE_STATE' }
  | { type: 'TOGGLE_UPPER_CASE_STATE' }
  | { type: 'TOGGLE_NUMBERS_CHECKED' }
  | { type: 'TOGGLE_SPECIAL_CHARACTERS_CHECKED' }
  | { type: 'TOGGLE_COPY_TO_CLIPBOARD' };

interface FormState {
  lowerCaseIsChecked: boolean;
  upperCaseIsChecked: boolean;
  numbersIsChecked: boolean;
  specialCharactersIsChecked: boolean;
  copyToClipboard: boolean;
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const minSize = { width: 300, height: 300 };
const winIcon = new QIcon(nodeguiIcon);
const clipboard = QApplication.clipboard();

const formReducer = (state: FormState, action: FormReducerAction): FormState => {
  switch (action.type) {
    case 'TOGGLE_LOWER_CASE_STATE':
      return { ...state, ...{ lowerCaseIsChecked: !state.lowerCaseIsChecked } };
    case 'TOGGLE_UPPER_CASE_STATE':
      return { ...state, ...{ upperCaseIsChecked: !state.upperCaseIsChecked } };
    case 'TOGGLE_NUMBERS_CHECKED':
      return { ...state, ...{ numbersIsChecked: !state.numbersIsChecked } };
    case 'TOGGLE_SPECIAL_CHARACTERS_CHECKED':
      return { ...state, ...{ specialCharactersIsChecked: !state.specialCharactersIsChecked } };
    case 'TOGGLE_COPY_TO_CLIPBOARD':
      return { ...state, ...{ copyToClipboard: !state.copyToClipboard } };
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [formState, dispatch] = useReducer(formReducer, {
    lowerCaseIsChecked: true,
    upperCaseIsChecked: true,
    numbersIsChecked: true,
    copyToClipboard: true,
    specialCharactersIsChecked: false,
  });

  const [sliderValue, setSliderValue] = useState(20);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const generatePassword = () => {
    const length = Math.ceil(((sliderValue + 6) / 100) * 57);
    if (
      (!formState.specialCharactersIsChecked &&
        !formState.upperCaseIsChecked &&
        !formState.lowerCaseIsChecked &&
        !formState.numbersIsChecked) ||
      length < 4
    )
      return;

    let password = '';
    while (password.length < length) {
      const character = getRandomInt(33, 127);
      if (
        (((character >= 33 && character <= 47) ||
          (character >= 58 && character <= 64) ||
          (character >= 91 && character <= 96) ||
          (character >= 123 && character <= 126)) &&
          formState.specialCharactersIsChecked) ||
        (character >= 48 && character <= 57 && formState.numbersIsChecked) ||
        (character >= 65 && character <= 90 && formState.upperCaseIsChecked) ||
        (character >= 97 && character <= 122 && formState.lowerCaseIsChecked)
      )
        password += String.fromCharCode(character);
    }

    setGeneratedPassword(password);
    if (formState.copyToClipboard) {
      clipboard.setText(password, 0);
    }
  };

  return (
    <Window
      windowIcon={winIcon}
      windowTitle="Random password generator - React Nodegui"
      minSize={minSize}
      styleSheet={styleSheet}
    >
      <View style={containerStyle}>
        <View id="form-wrapper">
          <CheckBox
            checked={formState.lowerCaseIsChecked}
            on={{ toggled: () => dispatch({ type: 'TOGGLE_LOWER_CASE_STATE' }) }}
          >
            Use lowercase letters
          </CheckBox>
          <CheckBox
            checked={formState.upperCaseIsChecked}
            on={{ toggled: () => dispatch({ type: 'TOGGLE_UPPER_CASE_STATE' }) }}
          >
            Use uppercase letters
          </CheckBox>
          <CheckBox
            checked={formState.numbersIsChecked}
            on={{ toggled: () => dispatch({ type: 'TOGGLE_NUMBERS_CHECKED' }) }}
          >
            Use numbers
          </CheckBox>
          <CheckBox
            checked={formState.specialCharactersIsChecked}
            on={{ toggled: () => dispatch({ type: 'TOGGLE_SPECIAL_CHARACTERS_CHECKED' }) }}
          >
            Use special characters
          </CheckBox>
          <View id="length-wrapper">
            <Text>Length: </Text>
            <LineEdit text={Math.ceil(((sliderValue + 6) / 100) * 57).toString()} readOnly></LineEdit>

            <Slider
              orientation={1}
              value={sliderValue}
              on={{
                sliderMoved: (value) => {
                  setSliderValue(value);
                },
              }}
            ></Slider>
          </View>

          <CheckBox
            checked={formState.copyToClipboard}
            on={{ toggled: () => dispatch({ type: 'TOGGLE_COPY_TO_CLIPBOARD' }) }}
          >
            Copy to clipboard
          </CheckBox>
        </View>

        <PlainTextEdit text={generatedPassword} id="password-output"></PlainTextEdit>
        <Button on={{ clicked: generatePassword }}>Generate password</Button>
      </View>
    </Window>
  );
};

const containerStyle = `
  flex: 1; 
  padding: 5px;
  justify-content: space-between;
`;

const styleSheet = `
  #form-wrapper {
    justify-content: space-between;
    flex: 1;
  }

  #length-wrapper {
    flex-direction: row;
    width: '100%';
  }

  #length-wrapper > QLineEdit {
    width: auto;
    flex: 1;
  }

  #length-wrapper > QSlider{
    margin-left: 10px;
    flex: 4;
  }

  #password-output {
    height: auto;
    flex: 4;
    margin-top: 2px;
    margin-bottom: 2px;
  }

`;

export default hot(App);
