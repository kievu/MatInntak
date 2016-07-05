/*
 * Copyright (c) 2016, University of Oslo, Norway All rights reserved.
 *
 * This file is part of "UiO Software Information Inventory".
 *
 * "UiO Software Information Inventory" is free software: you can redistribute it and/or modify it under the terms of
 * the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at
 * your option) any later version.
 *
 * "UiO Software Information Inventory" is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
 * License for more details.
 *
 * You should have received a copy of the GNU General Public License along with "UiO Software Information Inventory". If
 * not, see <http://www.gnu.org/licenses/>
 *
 * @flow
 *
 */

import React, { Component } from 'react';
import {
  SegmentedControlIOS,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

const backgroundColor = "#FFFFFF"
const textColor = "#FFFFFF"
const lightTextColor = "#777777"
const buttonColor = "rgb(33, 115, 161)"
const inputFieldColor = "rgb(246, 246, 246)"
const buttonWidth = 250

class RegistrationPage extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <NavigationBar />
        <ScrollView style={{paddingTop: 20}}>
          <Personalia /><Divider />
          <Anthropometry /><Divider />
          <Needs/><Divider />
          <Screening/><Divider />
          <SpecialDiet/><Divider />
          <Preferences/>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Button text="Registrer" />
          </View>
        </ScrollView>
      </View>
    );
  }
}

class Personalia extends Component {
  render() {
    return (
      <Section>
        <Header text="Personalia" />
        <Question name="Navn">
          {
            ["Fornavn", "Mellomnavn", "Etternavn"].map(
              name => <InputField key={name} placeholder={name} />)
          }
        </Question>
        <Question name="Kjønn">
          <Choice choices={["Kvinne", "Mann"]} />
        </Question>
        <Question name="Alder">
          <InputField small={true}/>
        </Question>
        <Question name="Fødselsnummer">
          <InputField />
        </Question>
      </Section>
    );
  }
}

class Anthropometry extends Component {
  render() {
    return (
      <Section>
        <Header text="Antropometri" />
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Question name="Høyde">
              <InputField small={true}/>
            </Question>
          </View>
          <View style={{flex: 1}}>
          <Question name="Vekt">
            <InputField small={true}/>
          </Question>
          </View>
          <View style={{flex: 1}}>
          <Calculation name="KMI" />
          </View>
        </View>
        </Section>
    );
  }
}

class Needs extends Component {
  render() {
    return (
      <Section>
      <Header text="Behov" />
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <Calculation name="Energi" />
        </View>
        <View style={{flex: 1}}>
          <Calculation name="Protein" />
        </View>
        <View style={{flex: 1}}>
          <Calculation name="Væske" />
        </View>
      </View>
      </Section>
    );
  }
}

class Screening extends Component {
  render() {
    return (
      <Section>
      <Header text="Screening" />
      <Question name="Score screening">
        <InputField />
      </Question>
      <Question name="Ernæringsmessig risiko">
        <Choice choices={["Moderat", "Gøy"]} />
      </Question>
      </Section>
    );
  }
}

class SpecialDiet extends Component {
  render() {
    return (
      <Section>
      <Header text="Spesialkost" />
      <Question>
        <Choice choices={["Nei", "Ja"]} />
        <InputField placeholder="Spesifiser type spesialkost" />
      </Question>
      </Section>
    );
  }
}

class Preferences extends Component {
  render() {
    return (
      <Section>
      <Header text="Spesielle preferanser" />
      <Question>
        <InputField />
      </Question>
      </Section>
    );
  }
}

const Section = ({children}) => (
  <View style={{marginLeft: 30, marginRight: 30}}>
    {children}
  </View>
);

const Header = ({text}) => (
  <Text style={{fontSize: 30, fontWeight: 'bold', marginTop: 32, marginBottom: 20}}>
    {text}
  </Text>
);

const Button = ({text}) => (
  <View style={{marginBottom: 15}}>
  <Text style={{marginTop: 60, fontSize: 25, color: 'white', backgroundColor: buttonColor, paddingLeft: 20,
                paddingTop: 16, paddingRight: 20, paddingBottom: 16, fontStyle: 'italic',
                borderRadius: 5, overflow: 'hidden', width: buttonWidth, textAlign: 'center'}}>
    {text}
  </Text>
  </View>
)

const Question = ({name, children, style}) => (
  <View>
  {name &&
    <Text style={[{fontSize: 25, marginBottom: 20}, style]}>
      {name}:
    </Text>
  }
  {children}
  </View>
);

const Calculation = ({name}) => (
  <View>
    <Text style={{fontSize: 25, marginBottom: 20}}>
      {name}:
    </Text>
    <Text style={{fontSize: 25}}>-</Text>

  </View>
);

const NavigationBar = () => (
  <View style={{backgroundColor: "#17364B", paddingTop: 50, paddingBottom: 30, paddingLeft: 20, paddingRight: 20}}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={{flex: 1}}>
        <BackLink />
      </View>
      <View style={{flex: 2}}>

      </View>
      <View style={{flex: 1}}>
        <FrontPageLink />
      </View>
    </View>

    <Text style={{color: 'white', textAlign: 'center', fontSize: 35, fontWeight: 'bold', marginTop: 25}}>
      Pasientregistrering
    </Text>
  </View>
);

const BackLink = () => (
  <Text style={{color: 'white', fontSize: 25, textAlign: 'center'}}>
  Tilbake
  </Text>
);

const FrontPageLink = () => (
  <Text style={{color: 'white', fontSize: 25, textAlign: 'center'}}>
  Til forsiden
  </Text>
);

const Divider = () => <View style={{marginTop: 30, height: 6, backgroundColor: "rgb(235, 235, 235)"}}/>;

const Choice = ({choices}) => (
  <View>
    <SegmentedControlIOS values={choices}
      style={{height: 30, marginBottom: 10, padding: 20}}
      tintColor= '#17364B'/>
  </View>
);

const InputField = ({placeholder, small}) => (
  <View>
    <TextInput placeholder={placeholder || ""}
               style={{width: small ? 120 : null, height: 60, backgroundColor: inputFieldColor,
                      borderRadius: 8, fontSize: 25, padding: 10, marginBottom: 15,
                     borderColor: "rgb(215, 215, 215)", borderWidth: 3}}/>
  </View>
);




export default RegistrationPage;