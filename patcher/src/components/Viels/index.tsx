/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import styled from 'react-emotion';

export const TopVeil = styled('div')`
  position: absolute;
  background: url(images/controller/veil-top-bar.png) repeat-x top;
  top: -30px;
  width: 100%;
  height: 173px;
  z-index: 9;
`;

export const TopLeftVeil = styled('div')`
  position: absolute;
  background: url(images/controller/veil-top-left.png) no-repeat ;
  top: 0;
  left: 0;
  width: 400px;
  height: 300px;
  z-index: 10;
`;

export const BottomVeil = styled('div')`
  position: absolute;
  background: url(images/controller/veil-bottom-bar.png) repeat-x top;
  bottom: 0;
  width: 100%;
  height: 80px;
  z-index: 10;
`;

export const BottomLeftVeil = styled('div')`
  position: absolute;
  background: url(images/controller/veil-bottom-left.png) no-repeat;
  background-size: cover;
  bottom: 0;
  left: 0;
  width: 600px;
  height: 300px;
  z-index: 10;
`;

export const BottomRightVeil = styled('div')`
  position: absolute;
  background: url(images/controller/veil-bottom-right.png) no-repeat right;
  bottom: 0;
  right: 0;
  width: 500px;
  height: 260px;
  z-index: 10;
`;

export const BigBottomVeil = styled('div')`
  position: absolute;
  background: url(images/controller/veil-top-bar.png) repeat-x top;
  bottom: 0px;
  width: 100%;
  height: 90px;
  z-index: 9;
  transform: rotate(180deg);
`;
