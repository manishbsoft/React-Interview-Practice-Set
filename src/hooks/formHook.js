import { useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        values: {
          ...state.values,
          [action.name]: action.value,
        },
        errors: {
          ...state.errors,
          [action.name]: action.error, // real-time validation
        },
      };

    case "SET_ERRORS":
      return {
        ...state,
        errors: action.errors,
      };

    case "RESET":
      return action.initialState;

    default:
      return state;
  }
};

export default function useForm(initialValues, validate) {
  const initialState = {
    values: initialValues,
    errors: {},
  };

  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch({
      type: "CHANGE_INPUT",
      name,
      value,
      error: validate(name, value),
    });
  };

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();

    const validationErrors = {};
    Object.keys(state.values).forEach((key) => {
      const error = validate(key, state.values[key]);
      if (error) validationErrors[key] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors: validationErrors });
      return;
    }

    callback(state.values); // call parent submit fn
  };

  const resetForm = () => {
    dispatch({ type: "RESET", initialState });
  };

  return {
    values: state.values,
    errors: state.errors,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
