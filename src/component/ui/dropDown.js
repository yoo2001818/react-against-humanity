import React, { Component, PropTypes, cloneElement } from 'react';
import classNames from 'classnames';

export default class DropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: true
    };
    this.handleClickEvent = this.handleClick.bind(this);
  }
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
    this.refs.cover.removeEventListener('click', this.handleClickEvent);
  }
  handleClick(e) {
    const { hidden } = this.state;
    if (hidden) {
      this.refs.cover.addEventListener('click', this.handleClickEvent);
    } else {
      this.refs.cover.removeEventListener('click', this.handleClickEvent);
    }
    if (this.mounted) {
      this.setState({
        hidden: !hidden
      });
    }
    e.preventDefault();
  }
  render() {
    const { hidden } = this.state;
    const buttonContent = (
      <a href={this.props.href || '#'}>
        <span className='title'>{this.props.title}</span>
      </a>
    );
    return (
      <div className={classNames('drop-down-component', { hidden })}>
        <div className='cover' ref='cover' />
        <div className='button' onClick={this.handleClick.bind(this)}>
          {buttonContent}
        </div>
        <div className='content'>
          { this.props.preventClose ? (
            this.props.children
          ) : (
            cloneElement(this.props.children, {
              onClick: this.handleClick.bind(this)
            })
          ) }
        </div>
      </div>
    );
  }
}

DropDown.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.node,
  preventClose: PropTypes.bool
};
