import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { validate } from 'jsonschema';
import classNames from 'classnames';

import SelectInput from '../../component/ui/selectInput';
import ReadInput from '../../component/ui/readInput';
import ErrorInput from '../../component/ui/errorInput';
import { Pane } from '../../component/roomInspector';

import __ from '../../lang';
import convertValidations from '../../utils/convertValidations';

import RoomCreateFormSchema, { RoomCreateFormPassword }
  from '../../schema/roomCreateForm';

class RoomForm extends Component {
  render() {
    const { fields: { name, maxUserCount, lockType, password },
      handleSubmit, invalid, pristine, className, inRoom, room, resetForm,
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
                <div className='field label'>
                  <Input type='number' {...maxUserCount}
                    min={room ? room.userCount : 2} max={100}
                    label={__('RoomMaxUserCountName')}
                  />
                </div>
                <div className='field'>
                  <SelectInput {...lockType} options={[
                    { label: __('RoomTypePublic'), value: 'public' },
                    { label: __('RoomTypePassword'), value: 'password' },
                    { label: __('RoomTypeInvite'), value: 'invite' }
                  ]} readonly={roomView && !canEdit} />
                </div>
                {(!roomView || canEdit) && lockType.value === 'password' && (
                  <div className='field'>
                    <ErrorInput type='password'
                      placeholder={__('RoomPasswordName')} {...password}
                    />
                  </div>
                )}
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
            { roomView && canEdit && !pristine && (
              <div className={classNames('action-container apply', {
                disabled: invalid || pristine
              })}>
                <button className='action' onClick={handleSubmit}>
                  <span className='icon' />
                  {__('RoomApplyBtn')}
                </button>
              </div>
            )}
            { roomView && canEdit && !pristine && (
              <div className={classNames('action-container reset', {
                disabled: pristine
              })}>
                <button className='action' onClick={resetForm}>
                  <span className='icon' />
                  {__('FormResetBtn')}
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
  resetForm: PropTypes.func,
  invalid: PropTypes.bool,
  pristine: PropTypes.bool,
  className: PropTypes.string,
  room: PropTypes.object,
  canEdit: PropTypes.bool,
  inRoom: PropTypes.bool,
  roomView: PropTypes.bool,
  onJoin: PropTypes.func,
  onLeave: PropTypes.func
};

export default reduxForm({
  form: 'room',
  fields: ['name', 'maxUserCount', 'lockType', 'password'],
  initialValues: {
    maxUserCount: 10,
    lockType: 'public'
  },
  validate: (values, props) => {
    let newValues = Object.assign({}, values, {
      maxUserCount: parseFloat(values.maxUserCount)
    });
    let errors = convertValidations(validate(newValues, RoomCreateFormSchema));
    // If it has a password type, test that too.
    if (newValues.lockType === 'password') {
      Object.assign(errors, convertValidations(
        validate(newValues, RoomCreateFormPassword)
      ));
    }
    // Check minimum player limit; set error if it's weird.
    if (props.room && props.room.userCount > newValues.maxUserCount) {
      Object.assign(errors, {
        maxUserCount: {
          name: 'ErrorValidationMinimum',
          values: props.room.userCount
        }
      });
    }
    return errors;
  }
})(RoomForm);
