/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

export interface AllocatePointButtonStyle extends StyleDeclaration {
  disabled: React.CSSProperties;
}

export const defaultAllocatePointButtonStyle: AllocatePointButtonStyle = {
  disabled: {
    
  },
};

export interface AllocatePointButtonProps {
  styles?: Partial<AllocatePointButtonStyle>;
  direction: 'left' | 'right';
  onMouseDown: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseUp: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface AllocatePointButtonState {
}

export class AllocatePointButton extends React.Component<AllocatePointButtonProps, AllocatePointButtonState> {
  constructor(props: AllocatePointButtonProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultAllocatePointButtonStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    const { direction } = this.props;    
    return (
      <button
        className={`${direction === 'right' ? ' rightarrow right' : ' leftarrow right'}`}
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}>
      </button>
    );
  }
}

export default AllocatePointButton;
