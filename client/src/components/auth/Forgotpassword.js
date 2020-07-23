import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const title = {
  pageTitle: 'Forgot Password Screen',
};

class ForgotPassword extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      showError: false,
      messageFromServer: '',
      showNullError: false,
    };
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  sendEmail = async (e) => {
    e.preventDefault();
    const { email } = this.state;
    if (email === '') {
      this.setState({
        showError: false,
        messageFromServer: '',
        showNullError: true,
      });
    } else {
      try {
        const response = await axios.post(
          'app/users/forgotPassword',
          {
            email,
          },
        );
        console.log(response.data);
        if (response.data === 'recovery email sent') {
          this.setState({
            showError: false,
            messageFromServer: 'recovery email sent',
            showNullError: false,
          });
        }
      } catch (error) {
        console.error(error.response.data);
        if (error.response.data === 'email not in db') {
          this.setState({
            showError: true,
            messageFromServer: '',
            showNullError: false,
          });
        }
      }
    }
  };

  render() {
    const {
 email, messageFromServer, showNullError, showError 
} = this.state;

    return (
      <div>
          <form noValidate onSubmit={this.sendEmail}>
            <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  id="email"
                  type="email"
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
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
                  Reset Password
                </button>
              </div>
            </form>
            {showNullError && (
          <div>
            <p>The email address cannot be null.</p>
          </div>
        )}
        {showError && (
          <div>
            <p>
              That email address isn&apos;t recognized. Please try again or
              register for a new account.
            </p>
            <Link  to="/register">
                <Button variant="contained" color="primary">
                    Register
                </Button>
            </Link>
          </div>
        )}
        {messageFromServer === 'recovery email sent' && (
          <div>
            <h3>Password Reset Email Successfully Sent!</h3>
          </div>
        )}
        <Link  to="/">
                
                    Go Home
                
        </Link>
      </div>
    );
  }
}

export default ForgotPassword;