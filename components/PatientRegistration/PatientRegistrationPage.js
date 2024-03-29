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
  ScrollView,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import type {
  Kilograms,
  Meter,
  Kcal,
  Ml,
  Gram,
} from '../../logic/needs';
import {
  computeFluid,
  computeKcal,
  computeProtein,
  positiveComputedValue,
} from '../../logic/needs';
import NavigationBar from '../NavigationBar'
import {
  resetApp,
  showFeverRegistrationPage,
  showPreviousPage,
  registerNeeds,
} from '../../actions';
import NeedsRegistration from './NeedsRegistration';
import {
  Choice,
  RegisterButton,
  Divider,
  InputField,
  Header,
  Section,
  Question,
  YesNoQuestionWithTextField,
} from './common';

class RegistrationPage extends Component {
  state:{
    weight: ?Kilograms,
    height: ?Meter,
    energy: ?Kcal,
    liquid: ?Ml,
    protein: ?Gram
  };
  constructor() {
    super()
    this.state = {
      weight: null,
      height: null,
      energy: null,
      liquid: null,
      protein: null,
    }
  }
  setWeight:(weight: Kilograms) => void = (weight) => {
    this.setState({weight});
  };
  setHeight:(height: Meter) => void = (height) => {
    this.setState({height});
  };
  calculateNeeds = (weight: Kilograms) => {
    const energy: ?Kcal = positiveComputedValue(weight, computeKcal);
    const protein: ?Gram = positiveComputedValue(weight, computeProtein);
    const liquid: ?Ml = positiveComputedValue(weight, computeFluid);
    this.setState({energy, protein, liquid});
  };
  render() {
    return (
      <View style={{flex: 1}}>
        <NavigationBar currentPage="Pasientregistrering" showFrontPage={this.props.resetApp} goBack={this.props.showPreviousPage} />
        <ScrollView accessibilityLabel="Registreringsskjema" style={{paddingTop: 20}}>
          <Personalia /><Divider />
          <NeedsRegistration setNeeds={doNothing}
                             height={this.state.height}
                             weight={this.state.weight}
                             setWeight={this.setWeight}
                             setHeight={this.setHeight}
                             calculateNeeds={this.calculateNeeds}
                             energyNeed={this.state.energy}
                             proteinNeed={this.state.protein}
                             fluidNeed={this.state.liquid} />
          <Divider />
          <Screening/><Divider />
          <SpecialDiet/><Divider />
          <Preferences/>
          <RegisterButton onPress={ () =>
            this.props.registerNeeds(this.state.energy, this.state.liquid, this.state.protein) } />
        </ScrollView>
      </View>
    );
  }
}

const ConnectedPage = connect(
  () => ({}),
  (dispatch) => ({
    resetApp: () => dispatch(resetApp()),
    showFeverRegistrationPage: () => dispatch(showFeverRegistrationPage()),
    showPreviousPage: () => dispatch(showPreviousPage()),
    registerNeeds: (energy: Kcal, liquid: Ml, protein: Gram) => {
      dispatch(registerNeeds(energy, liquid, protein));
      dispatch(showFeverRegistrationPage());
    },
  }),
)(RegistrationPage);

function doNothing() {
  return;
}

class Personalia extends Component {
  render() {
    return (
      <Section>
        <Header text="Personalia" />
        <Question name="Navn">
          <InputField placeholder="Fornavn" onChange={doNothing}/>
          <InputField placeholder="Mellomnavn" optional={true} onChange={doNothing}/>
          <InputField placeholder="Etternavn" onChange={doNothing} />
        </Question>
        <Question name="Kjønn">
          <Choice label="Kjønn" choices={["Kvinne", "Mann"]} />
        </Question>
        <Question name="Alder">
          <InputField label="Alder" small={true} onChange={doNothing} numeric={true}/>
        </Question>
        <Question name="Fødselsnummer">
          <InputField onChange={doNothing} numeric={true} label="Fødselsnummer"/>
        </Question>
      </Section>
    );
  }
}

const Screening = () => (
  <Section>
  <Header text="Screening" />
  <Question name="Score screening">
    <InputField optional={true} onChange={doNothing} />
  </Question>
  <Question name="Ernæringsmessig risiko">
    <Choice label="Ernæringsmessig risiko" choices={["Moderat", "Høy"]} optional={true} />
  </Question>
  </Section>
);


const SpecialDiet = () => (
  <YesNoQuestionWithTextField label="Spesialkost"  textFieldCaption="Spesifiser type spesialkost" />
);

const Preferences = () => (
  <Section>
  <Header text="Spesielle preferanser" />
  <Question>
    <InputField optional={true} onChange={doNothing}/>
  </Question>
  </Section>
);

export default ConnectedPage;
