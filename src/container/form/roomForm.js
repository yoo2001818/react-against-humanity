import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import { routeActions as RouteActions } from 'redux-simple-router';
import * as RoomActions from '../../action/room';

import TextInput from '../../component/ui/textInput';
import { Pane } from '../../component/roomInspector';

import __ from '../../lang';

class RoomForm extends Component {
  render() {
    const { fields: { name, maxUserCount, password },
      handleSubmit } = this.props;
    return (
      <div className='room-form'>
        <form onSubmit={handleSubmit}>
          <div className='room-inspector'>
            <div className='pane form'>
              <div className='content'>
                <div className='field'>
                  <TextInput type='text' placeholder={__('RoomNameName')}
                    {...name}
                  />
                </div>
                <div className='field'>
                  <TextInput type='password'
                    placeholder={__('RoomPasswordName')} {...password}
                  />
                </div>
                <div className='field label'>
                  <label>{__('RoomMaxUserCountName')}</label>
                  <TextInput type='number' {...maxUserCount}
                    min={1} max={100}
                  />
                </div>
              </div>
            </div>
            <Pane title={__('RoomRulesName')}>
              WIP
            </Pane>
            <Pane title={__('RoomDecksName')}>
              WIP
            </Pane>
          </div>
          <div className='room-action-bar'>
            <div className='action-container create'>
              <a className='action' onClick={handleSubmit}>
                <span className='icon' />
                {__('RoomCreateBtn')}
              </a>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

RoomForm.propTypes = {
  fields: PropTypes.object,
  handleSubmit: PropTypes.func
};

export default reduxForm({
  form: 'room',
  fields: ['name', 'maxUserCount', 'password'],
  initialValues: {
    maxUserCount: 10
  },
  onSubmit: (values, dispatch) => {
    dispatch(RoomActions.create(values))
    .then(action => {
      // Navigate to the room.
      let roomId = action.meta.target.room;
      dispatch(RouteActions.push(`/room/${roomId}`));
    });
  }
})(RoomForm);
