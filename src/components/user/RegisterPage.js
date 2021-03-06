import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import close from '../../assets/images/close.png';
import { useForm } from 'react-hook-form';
import firebase from '../../firebase';
import defaultIcon from '../../assets/images/default_icon.png';

const Form = styled.form`
  height: 100%;
  overflow-y: auto;
  padding-top: 40px;
  .register_tit {
    padding: 20px 0;
    font-size: 1.6rem;
    text-align: center;
  }
  .input_box {
    li {
      width: 330px;
      margin: 40px auto 20px;
      label {
        display: block;
        margin-bottom: 8px;
        font-size: 0.9rem;
        font-weight: 700;
      }
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
        input {
          height: 44px;
          width: 100%;
          padding: 0 40px 0 0;
          border: 0;
          border-bottom: 2px solid #f5f5f5;
          &::placeholder {
            color: #111;
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
      }
      .btn_submit {
        width: 100%;
        height: 50px;
        margin: 10px 0 35px;
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
      }
      a {
        display: block;
        padding-top: 95px;
        text-align: center;
        color: #6e6e6e;
        font-size: 14px;
      }
      .info_error {
        font-size: 0.78rem;
      }
    }
  }
`;

function RegisterPage() {
  const { register, watch, errors, clearErrors, setValue, handleSubmit } =
    useForm();
  const [loading, setLoading] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState('');
  const [enable, setEnable] = useState('');
  const [focus, setFocus] = useState({
    email: '',
    password: '',
    confirm_password: '',
    name: '',
  });
  const [display, setDisplay] = useState({
    email: 'none',
    password: 'none',
    confirm_password: 'none',
    name: 'none',
  });
  const passwordRef = useRef();
  passwordRef.current = watch('password');

  const inputBox = useRef();
  const btnSubmit = useRef();

  const onChange = e => {
    const { value, name } = e.target;

    // input??? ????????? 0???????????? ??????????????? ???????????? focus ??????
    if (value.length > 0) {
      setDisplay({ ...display, [name]: 'block' });
      setFocus({ ...focus, [name]: 'focus' });
    } else {
      setDisplay({ ...display, [name]: 'none' });
      setFocus({ ...focus, [name]: '' });
    }

    // ???????????? ?????? ?????????
    if (
      watch('password').length > 7 &&
      watch('confirm_password').length > 7 &&
      watch('name').length > 3
    ) {
      setEnable('enable');
      setLoading(false);
    } else {
      setEnable('');
      setLoading(true);
    }
  };

  const inputReset = e => {
    e.preventDefault();
    const { name } = e.target.previousSibling;

    // ???????????? ?????? ?????????, focus ui ?????? ?????????
    setDisplay({ ...display, [name]: 'none' });
    setFocus({ ...focus, [name]: '' });

    // ???????????? ???????????? ?????? disable ?????????
    setEnable('');
    setLoading(true);

    setValue(name, '');
    clearErrors(name, '');
  };

  const onSubmit = async data => {
    try {
      setLoading(true);
      let createUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);

      await createUser.user.updateProfile({
        displayName: data.name,
        photoURL: defaultIcon,
      });

      // firebase DB save - uid: user??? ???????????? id
      await firebase.database().ref('users').child(createUser.user.uid).set({
        name: createUser.user.displayName,
        image: createUser.user.photoURL,
        email: createUser.user.email,
      });

      setErrorSubmit(
        '??????????????? ??????????????? ???????????????. ????????? ???????????? ???????????????.',
      );
    } catch (error) {
      setErrorSubmit(error.message);
    } finally {
      setLoading(false);
      setEnable('');
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <section>
        <h1 className="register_tit">????????????</h1>
        <ul className="input_box ph_text_field" ref={inputBox}>
          <li>
            <label>?????? ????????? (?????? ID)</label>
            <div className={focus.email === '' ? '' : 'focus'}>
              <input
                name="email"
                type="email"
                ref={register({
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
                placeholder="????????? ??????"
                onChange={onChange}
              />
              <span
                className="btn_del"
                onClick={inputReset}
                style={{ display: display.email === 'none' ? 'none' : 'block' }}
              />
            </div>
            {errors.email && (
              <p className="info_error">????????? ????????? ????????? ????????????.</p>
            )}
          </li>
          <li>
            <label>????????????</label>
            <div className={focus.password === '' ? '' : 'focus'}>
              <input
                name="password"
                type="password"
                ref={register({
                  required: true,
                  minLength: 8,
                  maxLength: 20,
                })}
                placeholder="????????????(8~20??????)"
                onChange={onChange}
              />
              <span
                className="btn_del"
                onClick={inputReset}
                style={{
                  display: display.password === 'none' ? 'none' : 'block',
                }}
              />
            </div>
            <p className="info_error">
              {errors.password &&
                errors.password.type === 'required' &&
                '??????????????? ??????????????????.'}
              {errors.password &&
                errors.password.type === 'maxLength' &&
                '??????????????? 8-20????????? ??????????????????.'}
            </p>
            <div className={focus.confirm_password === '' ? '' : 'focus'}>
              <input
                name="confirm_password"
                type="password"
                ref={register({
                  required: true,
                  validate: value => value === passwordRef.current,
                })}
                minLength="8"
                maxLength="20"
                placeholder="???????????? ?????????"
                onChange={onChange}
              />
              <span
                className="btn_del"
                onClick={inputReset}
                style={{
                  display:
                    display.confirm_password === 'none' ? 'none' : 'block',
                }}
              />
            </div>
            <p className="info_error">
              {errors.confirm_password &&
                errors.confirm_password.type === 'required' &&
                '??????????????? ?????????????????????.'}
              {errors.confirm_password &&
                errors.confirm_password.type === 'validate' &&
                '????????? ??????????????? ???????????? ??????????????? ???????????? ????????????.'}
            </p>
          </li>
          <li>
            <label>?????????</label>
            <div className={focus.name === '' ? '' : 'focus'}>
              <input
                name="name"
                type="text"
                ref={register({
                  required: true,
                  maxLength: 20,
                })}
                placeholder="???????????? ????????? ?????????."
                onChange={onChange}
              />
              <span
                className="btn_del"
                onClick={inputReset}
                style={{ display: display.name === 'none' ? 'none' : 'block' }}
              />
            </div>
            <p className="info_error">
              {errors.name &&
                errors.name.type === 'required' &&
                '???????????? ??????????????????.'}
              {errors.name &&
                errors.name.type === 'maxLength' &&
                '???????????? 20???????????? ?????????????????????.'}
            </p>
          </li>
          <li>
            <button
              ref={btnSubmit}
              className={`btn_submit ${enable}`}
              disabled={loading}
            >
              ?????? ??????
            </button>
            {errorSubmit && <p className="info_error">{errorSubmit}</p>}
            <Link to="/login">???????????? ???????????? </Link>
          </li>
        </ul>
      </section>
    </Form>
  );
}

export default RegisterPage;
