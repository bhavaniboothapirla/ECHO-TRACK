/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CategoryConfig, HabitOption, UserSettings } from '../types';

export const DEFAULT_DAILY_TARGET = 6.0;

export const DEFAULT_SETTINGS: UserSettings = {
  dailyTarget: DEFAULT_DAILY_TARGET,
  restDayAllowance: true,
  theme: 'system',
};

export const TARGET_PRESETS = [4.0, 5.0, 6.0, 7.5, 9.0];

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'gettingAround',
    name: 'Getting around',
    subtitle: 'Primary transport today',
    options: [
      { id: 'walk_cycle', label: 'Walk or cycle', value: 0, hint: 'Active travel' },
      { id: 'wfh', label: 'Worked from home', value: 0, hint: 'No commute' },
      { id: 'transit', label: 'Public transit', value: 0.9, hint: 'Bus, train, metro' },
      { id: 'two_wheeler', label: 'Two-wheeler', value: 1.1, hint: 'Scooter, motorcycle' },
      { id: 'carpool', label: 'Carpool', value: 1.6, hint: 'Shared car journey' },
      { id: 'drove_alone', label: 'Drove alone', value: 3.2, hint: 'Solo personal vehicle' },
    ],
  },
  {
    id: 'food',
    name: 'Food',
    subtitle: 'Heaviest meal eaten today',
    options: [
      { id: 'plant_based', label: 'Plant-based', value: 1.5, hint: 'Beans, grains, legumes' },
      { id: 'vegetarian', label: 'Vegetarian', value: 2.5, hint: 'Dairy, eggs, produce' },
      { id: 'meat_fish', label: 'Some meat or fish', value: 4.5, hint: 'Poultry, pork, fish' },
      { id: 'beef_lamb', label: 'Beef or lamb', value: 7.0, hint: 'High-impact ruminant meat' },
    ],
  },
  {
    id: 'energy',
    name: 'Energy at home',
    subtitle: 'Heating, cooling, and appliance demand',
    options: [
      { id: 'low_use', label: 'Low use', value: 1.5, hint: 'Natural temp, fans, off-peak' },
      { id: 'typical', label: 'Typical', value: 3.0, hint: 'Moderate climate control & screens' },
      { id: 'ac_hours', label: 'AC for hours', value: 5.5, hint: 'Heavy heating or cooling run' },
    ],
  },
];

export const HABITS: HabitOption[] = [
  { id: 'reusable_bag_bottle', label: 'Reusable bag or bottle', credit: 0.2, hint: 'Avoided packaging' },
  { id: 'sorted_waste', label: 'Sorted waste', credit: 0.3, hint: 'Recycled correctly' },
  { id: 'composted_scraps', label: 'Composted scraps', credit: 0.3, hint: 'Kept methane out of landfills' },
  { id: 'no_plastic', label: 'No single-use plastic', credit: 0.2, hint: 'Cut wrap & takeaway containers' },
  { id: 'line_dried', label: 'Line-dried clothes', credit: 0.5, hint: 'Skipped electric dryer cycle' },
  { id: 'short_shower', label: 'Short shower', credit: 0.2, hint: 'Under 5 min water heating' },
];

export const DISCLAIMER_TEXT =
  'Figures are rough estimates for daily reflection, not audited lifecycle carbon accounting.';
