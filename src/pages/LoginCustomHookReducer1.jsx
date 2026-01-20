import React from 'react';
import { useState, useEffect, useMemo, useCallback, useReducer } from 'react'


const formReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        values: {
          ...state.values,
          [action.name]: action.value,
        },
        errors: {
          ...state.errors,
          [action.name]: action.error,
        },
      };
    case 'BLUR':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.name]: true
        },
        errors: {
          ...state.errors,
          [action.name]: action.error,
        },
      };
    case 'ERRORS':
      return {
        ...state,
        errors: action.errors
      };
    case 'TOUCH_ALL':
      const touched = {};
      Object.keys(state.values).forEach((key) => {
        touched[key] = true;
      });
      return {
        ...state,
        touched
      };
    case 'RESET':
      return action.initialValues;
    default:
      return state;
  }
}

const useForm = (initialValues, validate) => {
  const initialState = useMemo(() => ({
    values: initialValues,
    errors: {},
    touched: {},
  }), [initialValues]);
  
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  const handleChange = useCallback((e) => {
    const {name, value} = e.target;
    const error = validate(name, value);
    dispatch({type: "CHANGE", name, value, error});
  }, [validate]);
  
  const handleBlur = useCallback((e) => {
    const {name, value} = e.target;
    const error = validate(name, value);
    dispatch({type: "BLUR", name, error});
  }, [validate]);

  const validateAll = useCallback((values) => {
    const errors = {};
    
    Object.entries(values).forEach(([name, value]) => {
      errors[name] = validate(name, value);
    });
    return errors;
  }, [validate]);  

  const handleSubmit = useCallback((callback) => (e) => {
    e.preventDefault();
    
    const errors = validateAll(state.values);
    
    dispatch({type: "ERRORS", errors});
    dispatch({type: "TOUCH_ALL"});
    
    const hasError = Object.values(errors).some(Boolean);
    if (hasError) return;
    
    callback(state.values);
  }, [state.values, validateAll]);
  
  const resetForm = useCallback(() => {
    dispatch({type: "RESET", initialValues: initialState});
  }, [initialState]);
  
  const isValid = useMemo(
    () => Object.values(state.errors).every((err) => !err), 
  [state.errors]);
  
  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isValid
  }
};


function App() {
  const [count, setCount] = useState(0)
  
  const styles = {
    main: {
      padding: '20px',
    },
    title: {
      color: '#5C6AC4'
    },
    errorText: {
      color: 'red'
    },
  };
  
  const validate = useCallback((name, value) => {
    const v = String(value ?? "").trim();
    
    switch (name) {
      case 'email':
        if (!v) return 'Email is required!';
        if (!v.includes("@"))
          return 'Invalid Email Address';
      return null;
      case 'password':
        if (!v) return 'Password is required!';
        if (v.length < 6)
          return 'Password must be at least 6 characters!'
      return null;
      default:
        return null;
    }
  }, []);
  
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isValid,
  } = useForm({
    email: "",
    password: ""
  }, validate);
  
  const onSubmit = useCallback((data) => {
    console.log("FormData: ", data);
    console.log("Logged in successfully!!!");
    
    resetForm();
  }, [resetForm]);

  return (
    <div style={styles.main}>
      <h1 style={styles.title}>Login Form!</h1>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input type="text" name="email" placeholder="Email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
            {errors.email && touched.email && (
              <p style={styles.errorText}>{errors.email}</p>
            )}
          </div>
          <div>
            <input type="password" name="password" placeholder="Password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
            {errors.password && touched.password && (
              <p style={styles.errorText}>{errors.password}</p>
            )}
          </div>
          <div>
            <button type="submit" disabled={!isValid}>Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App