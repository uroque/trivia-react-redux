import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { saveTimer } from '../redux/actions';

const ONE_SECOND = 1000;
const TIME_START = 30;

class Timer extends React.Component {
  constructor() {
    super();
    this.state = {
      seconds: TIME_START,
    };
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState((prevState) => ({
        seconds: prevState.seconds - 1,
      }));
    }, ONE_SECOND);
  }

  componentDidUpdate(prevProps, prevState) {
    const { dispatchTime } = this.props;
    if (prevState.seconds < 2) {
      clearInterval(this.intervalId);
      dispatchTime(0);
    }
  }

  render() {
    const { seconds } = this.state;
    return (
      <section>
        <h2>{seconds}</h2>
      </section>
    );
  }
}

Timer.propTypes = {
  dispatchTime: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  dispatchTime: (time) => dispatch(saveTimer(time)),
});

export default connect(null, mapDispatchToProps)(Timer);
