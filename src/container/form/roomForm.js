import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { validate } from 'jsonschema';
import classNames from 'classnames';

import SelectInput from '../../component/ui/selectInput';
import ReadInput from '../../component/ui/readInput';
import ErrorInput from '../../component/ui/errorInput';
import { Pane } from '../../component/roomInspector';
import RoomActionBar, { RoomCreateButton, RoomApplyButton, FormResetButton }
  from '../../component/roomActionBar';

import __ from '../../lang';
import convertValidations from '../../utils/convertValidations';

import RoomCreateFormSchema, { RoomCreateFormPassword }
  from '../../schema/roomCreateForm';

class RoomForm extends Component {
  render() {
    const { fields: { name, maxUserCount, lockType, password },
      handleSubmit, invalid, pristine, className, room, resetForm,
      canEdit, roomView
    } = this.props;
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
          <RoomActionBar>
            { !roomView && (
              <RoomCreateButton disabled={invalid} button
                onClick={handleSubmit}
              />
            )}
            { roomView && canEdit && !pristine && (
              <span>
                <RoomApplyButton disabled={invalid || pristine} button
                  onClick={handleSubmit}
                />
                <FormResetButton disabled={pristine} button
                  onClick={resetForm}
                />
              </span>
            )}
          </RoomActionBar>
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
  roomView: PropTypes.bool
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
