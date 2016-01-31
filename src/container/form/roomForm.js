import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { validate } from 'jsonschema';
import classNames from 'classnames';

import { routeActions as RouteActions } from 'redux-simple-router';
import * as RoomActions from '../../action/room';

import ErrorInput from '../../component/ui/errorInput';
import { Pane } from '../../component/roomInspector';

import __ from '../../lang';
import convertValidations from '../../utils/convertValidations';

import roomCreateFormSchema from '../../schema/roomCreateForm';

class RoomForm extends Component {
  render() {
    const { fields: { name, maxUserCount, password },
      handleSubmit, invalid } = this.props;
    return (
      <div className='room-form'>
        <form onSubmit={handleSubmit}>
          <div className='room-inspector'>
            <div className='pane form'>
              <div className='content'>
                <div className='field'>
                  <ErrorInput type='text' placeholder={__('RoomNameName')}
                    {...name}
                  />
                </div>
                <div className='field'>
                  <ErrorInput type='password'
                    placeholder={__('RoomPasswordName')} {...password}
                  />
                </div>
                <div className='field label'>
                  <ErrorInput type='number' {...maxUserCount}
                    min={1} max={100} label={__('RoomMaxUserCountName')}
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
              <button className={classNames('action', {
                disabled: invalid
              })} onClick={handleSubmit}>
                <span className='icon' />
                {__('RoomCreateBtn')}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

RoomForm.propTypes = {
  fields: PropTypes.object,
  handleSubmit: PropTypes.func,
  invalid: PropTypes.bool
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
  },
  validate: values => {
    let newValues = Object.assign({}, values, {
      maxUserCount: parseFloat(values.maxUserCount)
    });
    let errors = convertValidations(validate(newValues, roomCreateFormSchema));
    return errors;
  }
})(RoomForm);
