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

import { combineReducers } from 'redux';
import type { Action } from './actions';
import type { ConsumedFoodItem, DailyConsumption } from './logic/food';
import type { Kcal, Ml, Gram } from './logic/needs';

const initialRouting = { pageStack: ['StartPage'], navBarTitle: '', navBarSubTitle: '' };

function routing(state = initialRouting, action: Action) {
  if (action.type === 'GO_TO_PAGE' && (state.pageStack.length === 0 || action.name !== state[state.pageStack.length - 1])) {
    return {
      pageStack: [...state.pageStack, action.name],
      navBarTitle: action.navBarTitle || '',
      navBarSubTitle: action.navBarSubTitle || '',
      liquid: action.liquid || null,
      snack: action.snack || null,
     };
  }

  if (action.type === 'GO_TO_PREVIOUS_PAGE') {
    return { pageStack: state.pageStack.slice(0, state.pageStack.length - 1) };
  }

  if (action.type === 'RESET_APP') {
    return initialRouting;
  }

  return state;
}

const initialConsumption = {
  consumedDinner: [],
  consumedLiquids: [],
  consumedMeals: [],
  consumedSnacks: [],
};

export type PasientNeeds = {
  energy: Kcal,
  liquid: Ml,
  protein: Gram,
}

const initialNutrition = {
  energy: 2400,
  liquid: 2400,
  protein: 80,
}

export function nutrition(state: PasientNeeds = initialNutrition, action: Action) {
  if (action.type === 'REGISTER_NEEDS') {
    return {
      energy: action.energy,
      liquid: action.liquid,
      protein: action.protein,
    };
  }

  return state;
}

export function consumption(state: DailyConsumption = initialConsumption, action: Action) {
  if (action.type === 'REGISTER_FOOD') {
    switch (action.food.category) {
      case 'Dish': return {...state, consumedDinners: addConsumedItem(action.food, state.consumedDinner) };
      case 'Liquid': return {...state, consumedLiquids: addConsumedItem(action.food, state.consumedLiquids) };
      case 'Meal':   return {...state, consumedMeals: addConsumedItem(action.food, state.consumedMeals) };
      case 'Snack':  return {...state, consumedSnacks: addConsumedItem(action.food, state.consumedSnacks) };
    }
  }

  if (action.type === 'REMOVE_FOOD') {
    return removeConsumedItem(action.id, state);
  }

  return state;
}

function addConsumedItem(item: any, alreadyConsumed: Array<ConsumedFoodItem>) {
  alreadyConsumed.push(item);
  return alreadyConsumed;
}

function removeConsumedItem(id: string, dailyConsumption: DailyConsumption): DailyConsumption {
  const doesNotMatch = (item) => {return id !== item.id};
  return {
    consumedDinner: dailyConsumption.consumedDinner.filter(doesNotMatch),
    consumedLiquids: dailyConsumption.consumedLiquids.filter(doesNotMatch),
    consumedMeals: dailyConsumption.consumedMeals.filter(doesNotMatch),
    consumedSnacks: dailyConsumption.consumedSnacks.filter(doesNotMatch),
  };
}

const initialAmount = { value: 0.0 };

export function amountSelector(state: any = initialAmount, action: Action) {
  switch (action.type) {
    case 'INCREASE_AMOUNT':
      return { value: state.value + action.step };
    case 'DECREASE_AMOUNT':
      return { value: state.value - action.step };
    case 'SELECT_AMOUNT':
      return { value: action.amount };
    default:
      return state;
  }
}

const app = combineReducers({routing, nutrition, consumption, amountSelector});

export default app;
