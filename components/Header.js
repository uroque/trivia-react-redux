import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

class Header extends React.Component {
  render() {
    // const user = JSON.parse(localStorage.getItem('state'));
    const { user } = this.props;
    // const { player } = user;
    return (
      <header>
        <img alt="foto do profile" data-testid="header-profile-picture" />
        <p data-testid="header-player-name">{user.name}</p>
        <p data-testid="header-score">{user.score}</p>
      </header>
    );
  }
}

Header.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    score: PropTypes.number,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.player,
});

export default connect(mapStateToProps)(Header);
