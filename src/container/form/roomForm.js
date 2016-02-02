import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { validate } from 'jsonschema';
import classNames from 'classnames';

import ReadInput from '../../component/ui/readInput';
import ErrorInput from '../../component/ui/errorInput';
import { Pane } from '../../component/roomInspector';

import __ from '../../lang';
import convertValidations from '../../utils/convertValidations';

import roomCreateFormSchema from '../../schema/roomCreateForm';

class RoomForm extends Component {
  render() {
    const { fields: { name, maxUserCount, password },
      handleSubmit, invalid, pristine, className, inRoom,
      canEdit, roomView, onJoin = () => {}, onLeave = () => {} } = this.props;
    const Input = !roomView || canEdit ? ErrorInput : ReadInput;
    return (
      <div className={classNames('room-form', className)}>
        <form onSubmit={handleSubmit}>
          <div className='room-inspector'>
            <div className='pane form'>
              <div className='content'>
                <div className='field'>
                  <Input type='text' placeholder={__('RoomNameName')}
                    {...name}
                  />
                </div>
                {!roomView || canEdit && (
                  <div className='field'>
                    <ErrorInput type='password'
                      placeholder={__('RoomPasswordName')} {...password}
                    />
                  </div>
                )}
                <div className='field label'>
                  <Input type='number' {...maxUserCount}
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
            { !roomView && (
              <div className={classNames('action-container create', {
                disabled: invalid
              })}>
                <button className='action' onClick={handleSubmit}>
                  <span className='icon' />
                  {__('RoomCreateBtn')}
                </button>
              </div>
            )}
            { roomView && (
              <div className={classNames('action-container apply', {
                disabled: invalid || pristine
              })}>
                <button className='action' onClick={handleSubmit}>
                  <span className='icon' />
                  {__('RoomApplyBtn')}
                </button>
              </div>
            )}
            { roomView && ( inRoom ? (
              <div className='action-container leave'>
                <button className='action' onClick={onLeave}>
                  <span className='icon' />
                  {__('LeaveBtn')}
                </button>
              </div>
            ) : (
              <div className='action-container join'>
                <button className='action' onClick={onJoin}>
                  <span className='icon' />
                  {__('JoinBtn')}
                </button>
              </div>
            ))}
          </div>
        </form>
      </div>
    );
  }
}

RoomForm.propTypes = {
  fields: PropTypes.object,
  handleSubmit: PropTypes.func,
  invalid: PropTypes.bool,
  pristine: PropTypes.bool,
  className: PropTypes.string,
  roomId: PropTypes.number,
  canEdit: PropTypes.bool,
  inRoom: PropTypes.bool,
  roomView: PropTypes.bool,
  onJoin: PropTypes.func,
  onLeave: PropTypes.func
};

export default reduxForm({
  form: 'room',
  fields: ['name', 'maxUserCount', 'password'],
  initialValues: {
    maxUserCount: 10
  },
  validate: values => {
    let newValues = Object.assign({}, values, {
      maxUserCount: parseFloat(values.maxUserCount)
    });
    let errors = convertValidations(validate(newValues, roomCreateFormSchema));
    return errors;
  }
})(RoomForm);
