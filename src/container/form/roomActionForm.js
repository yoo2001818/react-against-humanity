import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import RoomActionBar, { LeaveButton, JoinButton, SpectateButton, StartButton }
  from '../../component/roomActionBar';
import ErrorInput from '../../component/ui/errorInput';

import __ from '../../lang';

class RoomActionForm extends Component {
  handleSubmit(values) {
    return this.props.onJoin(values)
    .catch(() => {
      // TODO this will do for now.
      throw {
        password: {
          name: 'ErrorValidationPasswordMismatch'
        }
      };
    });
  }
  render() {
    const { fields: { password }, room, canJoin, canSpectate, canStart, joined,
      handleSubmit, onLeave, onSpectate, onStart, invalid } = this.props;
    const onSubmit = handleSubmit(this.handleSubmit.bind(this));
    return (
      <form onSubmit={onSubmit}>
        <div className='room-action-form'>
          <div className='content'>
            { room.lockType === 'password' && canJoin && !joined && (
              <ErrorInput type='password' placeholder={__('RoomPasswordName')}
                {...password}
              />
            )}
          </div>
          <RoomActionBar>
            { joined ? (
              <span>
                { canStart && (
                  <StartButton onClick={onStart} button />
                )}
                <LeaveButton onClick={onLeave} />
              </span>
            ) : (
              <span>
                <JoinButton disabled={!canJoin || invalid} onClick={onSubmit}
                  href={`/room/${room.id}`}
                />
                { canSpectate && (
                  <SpectateButton onClick={onSpectate}
                    href={`/room/${room.id}`}
                  />
                )}
              </span>
            )}
          </RoomActionBar>
        </div>
      </form>
    );
  }
}

RoomActionForm.propTypes = {
  children: PropTypes.func,
  joined: PropTypes.bool,
  canJoin: PropTypes.bool,
  canSpectate: PropTypes.bool,
  canStart: PropTypes.bool,
  room: PropTypes.shape({
    lockType: PropTypes.oneOf(['public', 'password', 'invite'])
  }),
  onJoin: PropTypes.func,
  onLeave: PropTypes.func,
  onSpectate: PropTypes.func,
  onStart: PropTypes.func,
  handleSubmit: PropTypes.func,
  fields: PropTypes.object,
  invalid: PropTypes.bool
};

export default reduxForm({
  form: 'room',
  fields: ['password'],
  validate: (values, props) => {
    if (props.room.lockType !== 'password') return {};
    if (!values.password) {
      return {
        password: {
          name: 'ErrorValidationRequired'
        }
      };
    }
    return {};
  }
})(RoomActionForm);
