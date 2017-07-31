/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { client, ql, events } from 'camelot-unchained';
import { graphql, InjectedGraphQLProps } from 'react-apollo';

import {
  LayoutState,
  setPosition,
  initialize,
  setVisibility,
  Widget,
} from '../../services/session/layout';
import { InvitesState, initializeInvites } from '../../services/session/invites';
import { SessionState } from '../../services/session/reducer';
import HUDDrag, { HUDDragState, HUDDragOptions } from '../HUDDrag';

import InteractiveAlert from '../InteractiveAlert';
import Watermark from '../Watermark';
import HUDFullScreen from '../HUDFullScreen';

import { ZoneName } from '../ZoneName';

// TEMP -- Disable this being movable/editable
import HUDNav from '../../services/session/layoutItems/HUDNav';

import Console from '../Console';

export interface HUDProps extends InjectedGraphQLProps<ql.MySocialQuery> {
  dispatch: (action: any) => void;
  layout: LayoutState;
  invites: InvitesState;
}

export interface HUDState {
}

class HUD extends React.Component<HUDProps, HUDState> {

  constructor(props: HUDProps) {
    super(props);
  }

  public render() {

    const widgets = this.props.layout.widgets;
    const locked = this.props.layout.locked;

    const renderWidgets = widgets
                    .sort((a, b) => a.position.zOrder - b.position.zOrder)
                    .map((w, idx) => this.draggable(idx, w, w.component, w.dragOptions, w.props));
    return (
      <div className='HUD' style={locked ? {} : { backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        {renderWidgets}

        <ZoneName />
        <Console />

        <div style={{ position: 'fixed', left: '2px', top: '2px', width: '900px', height: '200px', pointerEvents: 'none' }}>
          <HUDNav.component {...HUDNav.props} />
        </div>

        <InteractiveAlert dispatch={this.props.dispatch}
          invites={this.props.invites.invites} />
        <HUDFullScreen />
        <Watermark />
      </div>
    );
  }

  public componentWillReceiveProps(props: HUDProps) {
    if (!this.props.data || (props.data && props.data.myOrder && props.data.myOrder.name !== this.props.data.myOrder.name)) {

      if (this.props.data) events.fire('chat-leave-room', this.props.data.myOrder.name);

      // we either are just loading up, or we've changed order.
      if (props.data.myOrder.id) {
        // we left our order, leave chat room
        events.fire('chat-show-room', props.data.myOrder.name);
      }

      this.setState({
        orderName: props.data.myOrder.name,
      });
    }
  }

  public componentDidMount() {
    this.props.dispatch(initialize());
    this.props.dispatch(initializeInvites());

    if (client && client.OnCharacterHealthChanged) {

      client.OnCharacterAliveOrDead((alive: boolean) => {
        const respawn = this.props.layout.widgets.get('respawn');
        if (!alive && respawn && !respawn.position.visibility) {
          this.setVisibility('respawn', true);
        } else if (respawn && respawn.position.visibility) {
          this.setVisibility('respawn', false);
        }
      });
    }

    // manage visibility of welcome widget based on localStorage
    this.setVisibility('welcome', true);
    try {
      const delayInMin: number = 24 * 60;
      const savedDelay = localStorage.getItem('cse-welcome-hide-start');
      const currentDate: Date = new Date();
      const savedDelayDate: Date = new Date(JSON.parse(savedDelay));
      savedDelayDate.setTime(savedDelayDate.getTime() + (delayInMin * 60 * 1000));
      if (currentDate < savedDelayDate) this.setVisibility('welcome', false);
    } catch (error) {
      console.log(error);
    }
  }

  private setVisibility = (widgetName: string, vis: boolean) => {
    this.props.dispatch(setVisibility({ name: widgetName, visibility: vis }));
  }

  private draggable = (type: string, widget: Widget<any>, Widget: any, options?: HUDDragOptions, widgetProps?: any) => {
    let props = widgetProps;
    if (typeof props === 'function') {
      props = props();
    }
    return <HUDDrag name={type}
      key={widget.position.zOrder}
      defaultHeight={widget.position.size.height}
      defaultWidth={widget.position.size.width}
      defaultScale={widget.position.scale}
      defaultX={widget.position.x.offset}
      defaultY={widget.position.y.offset}
      defaultXAnchor={widget.position.x.anchor}
      defaultYAnchor={widget.position.y.anchor}
      defaultOpacity={widget.position.opacity}
      defaultMode={widget.position.layoutMode}
      defaultVisible={widget.position.visibility}
      gridDivisions={10}
      locked={this.props.layout.locked}
      save={(s: HUDDragState) => {
        this.props.dispatch(setPosition({
          name: type,
          widget,
          position: {
            x: { anchor: s.xAnchor, offset: s.x },
            y: { anchor: s.yAnchor, offset: s.y },
            size: { width: s.width, height: s.height },
            scale: s.scale,
            opacity: s.opacity,
            visibility: widget.position.visibility,
            zOrder: widget.position.zOrder,
            layoutMode: widget.position.layoutMode,
          },
        }));
      }}
      render={() => {
        if (this.props.layout.locked && !widget.position.visibility) return null;
        return <Widget
          setVisibility={(vis: boolean) => this.props.dispatch(setVisibility({ name: type, visibility: vis }))}
          {...props}
        />;
      }}
      {...options} />;
  }
}

const HUDWithQL = graphql(ql.queries.MySocial)(HUD);

function select(state: SessionState) {
  return {
    layout: state.layout,
    invites: state.invites,
  };
}

export default connect(select)(HUDWithQL);
