import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Link } from 'react-router';

import __ from '../lang';

export class ActionButton extends Component {
  render() {
    const { className, disabled, onClick, href, children, button } = this.props;
    return (
      <div className={classNames('action-container', className, { disabled })}>
        {button ? (
          <button className='action' onClick={onClick}>
            {children}
          </button>
        ) : (
          <Link className='action' onClick={onClick} to={href}>
            {children}
          </Link>
        )}
      </div>
    );
  }
}

ActionButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  href: PropTypes.string,
  button: PropTypes.bool,
  children: PropTypes.node
};

// Simple alias functions for buttons used in here.
export function JoinButton(props) {
  return (
    <ActionButton {...props} className='join'>
      {__('JoinBtn')}
    </ActionButton>
  );
}
export function LeaveButton(props) {
  return (
    <ActionButton {...props} className='leave' href='/'>
      {__('LeaveBtn')}
    </ActionButton>
  );
}
export function SpectateButton(props) {
  return (
    <ActionButton {...props} className='spectate'>
      {__('SpectateBtn')}
    </ActionButton>
  );
}
export function RoomCreateButton(props) {
  return (
    <ActionButton {...props} className='create'>
      {__('RoomCreateBtn')}
    </ActionButton>
  );
}
export function RoomApplyButton(props) {
  return (
    <ActionButton {...props} className='apply'>
      {__('RoomApplyBtn')}
    </ActionButton>
  );
}
export function FormResetButton(props) {
  return (
    <ActionButton {...props} className='reset'>
      {__('FormResetBtn')}
    </ActionButton>
  );
}

export default class RoomActionBar extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className='room-action-bar'>
        {children}
      </div>
    );
  }
}

RoomActionBar.propTypes = {
  children: PropTypes.node
};
