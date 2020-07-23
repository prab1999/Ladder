import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';


const loading = {
  margin: '1em',
  fontSize: '24px',
};

const title = {
  pageTitle: 'Password Reset Screen',
};

class ResetPassword extends Component {
  constructor() {
    super();

    this.state = {
      handle: '',
      password: '',
      updated: false,
      isLoading: true,
      error: false,
    };
  }

  async componentDidMount() {
    const {
      match: {
        params: { token },
      },
    } = this.props;
    try {
      const response = await axios.get('/app/users/resetPassword/'+token);
      console.log(response);
      if (response.data.message === 'password reset link a-ok') {
        this.setState({
          handle: response.data.handle,
          updated: false,
          isLoading: false,
          error: false,
        });
      }
    } catch (error) {
      console.log(error.response.data);
      this.setState({
        updated: false,
        isLoading: false,
        error: true,
      });
    }
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  updatePassword = async (e) => {
    e.preventDefault();
    const { handle, password } = this.state;
    const {
      match: {
        params: { token },
      },
    } = this.props;
    try {
      const response = await axios.put(
        '/app/users/updatePasswordViaEmail',
        {
          handle,
          password,
          resetPasswordToken: token,
        },
      );
      console.log(response.data);
      if (response.data.message === 'password updated') {
        this.setState({
          updated: true,
          error: false,
        });
      } else {
        this.setState({
          updated: false,
          error: true,
        });
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  render() {
    const {
 password, error, isLoading, updated 
} = this.state;

    if (error) {
      return (
        <div>
          <div>
            <h4>Problem resetting password. Please send another reset link.</h4>
            <Link  to="/">
                <Button variant="contained" color="primary">
                Go Home
                </Button>
            </Link>
            <Link  to="/forgotpassword">
                <Button variant="contained" color="primary">
                    Reset Password
                </Button>
            </Link>
          </div>
        </div>
      );
    }
    if (isLoading) {
      return (
        <div>
          <div style={loading}>Loading User Data...</div>
        </div>
      );
    }
    return (
      <div>
        <form className="password-form" onSubmit={this.updatePassword}>
          <TextField
            id="password"
            label="password"
            onChange={this.handleChange('password')}
            value={password}
            type="password"
          />
          <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Update Password
                </button>
        </form>

        {updated && (
          <div>
            <p>
              Your password has been successfully reset, please try logging in
              again.
            </p>
            <Link  to="/login">
                <Button variant="contained" color="primary">
                    Log in
                </Button>
            </Link>
          </div>
        )}
        <Link  to="/">
                <Button variant="contained" color="primary">
                    Go home
                </Button>
            </Link>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  // eslint-disable-next-line react/require-default-props
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string.isRequired,
    }),
  }),
};

export default ResetPassword;