import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import firebase from '../../firebase';
import close from '../../assets/images/close.png';

const Form = styled.form`
  width: 330px;
  margin: 0 auto;
  h1 {
    padding: 170px 0 20px;
    font-size: 1.6rem;
    font-weight: 500;
  }
  .sub_text {
    color: #7c7c7c;
    font-size: 1.1rem;
    line-height: 1.4;
  }
  .input_box {
    margin-top: 40px;
    & > div {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        height: 2px;
        width: 0;
        background-color: #403631;
        transition: width 120ms cubic-bezier(0, 0, 0.2, 1);
      }
      &.focus {
        &:after {
          width: 100%;
        }
      }
    }
    .btn_del {
      position: absolute;
      right: 0;
      bottom: 14px;
      z-index: 2;
      display: none;
      border: 0;
      border-radius: 17px;
      width: 17px;
      height: 17px;
      color: #fff;
      background: #b1b1b1 url(${close}) center center / 70% 70% no-repeat;
      cursor: pointer;
    }
    label {
      font-size: 0.9rem;
      font-weight: 500;
      color: #333;
    }
    input {
      height: 44px;
      width: 100%;
      margin-top: 10px;
      padding: 0 40px 0 0;
      border: 0;
      border-bottom: 2px solid #f5f5f5;
      &::placeholder {
        color: #ccc;
      }
    }
    button {
      height: 50px;
      width: 100%;
      margin-top: 30px;
      text-align: center;
      border: 0;
      border-radius: 5px;
      color: #323232;
      background-color: #f5f5f5;
      font-size: 0.9rem;
      &.enable {
        background-color: #f7be16;
        color: #323232;
      }
      font-size: 0.9rem;
    }
  }
  .info_error {
    font-size: 0.78rem;
  }
`;

function EditPassword() {
  const { register, errors, handleSubmit } = useForm();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [enable, setEnable] = useState('');
  const [focus, setFocus] = useState('');
  const [display, setDisplay] = useState('none');
  const [loading, setLoading] = useState(false);

  const inputReset = e => {
    // ???????????? ?????? ?????????, focus ui ?????? ?????????
    setDisplay('none');
    setFocus('');

    setEnable('');
    setEmail('');
    setError('');
  };

  const onChange = e => {
    const { value } = e.target;
    setEmail(value);

    // input??? ????????? 0???????????? ??????????????? ???????????? focus ??????
    if (value.length > 0) {
      setFocus('focus');
      setDisplay('block');
    } else {
      setFocus('');
      setDisplay('none');
    }

    if (e.target.value.length > 8) {
      setEnable('enable');
      setLoading(false);
    } else {
      setEnable('');
      setLoading(true);
    }
  };

  const onSubmit = async () => {
    const emailAddress = email;

    await firebase
      .auth()
      .sendPasswordResetEmail(emailAddress)
      .then(function () {
        setError('');
      })
      .catch(function (error) {
        setError(error.message);
      });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h1>??????????????? ??????????????????.</h1>
      <p className="sub_text">
        ??????????????? ???????????? <br />
        ?????????????????? ????????? ?????????.
      </p>
      <div className="input_box">
        <label>????????? ??????</label>
        <div className={`${focus}`}>
          <input
            type="email"
            name="email"
            value={email}
            label="???????????????"
            placeholder="test@mail.com"
            onChange={onChange}
            ref={register({
              required: true,
              pattern: /^\S+@\S+$/i,
            })}
          />
          <span
            className="btn_del"
            onClick={inputReset}
            style={{ display: `${display}` }}
          />
        </div>
        {errors.email && (
          <p className="info_error">????????? ????????? ????????? ????????????.</p>
        )}
        <button type="submit" disabled={loading} className={`${enable}`}>
          ????????? ??????
        </button>
      </div>
      {error && <p className="info_error">{error}</p>}
    </Form>
  );
}

export default EditPassword;
