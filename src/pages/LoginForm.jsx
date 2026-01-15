import React, {
  useReducer,
  useCallback,
  useMemo,
} from "react";

/* -------------------- Reducer -------------------- */
const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      return {
        ...state,
        values: {
          ...state.values,
          [action.name]: action.value,
        },
        errors: {
          ...state.errors,
          [action.name]: action.error || "",
        },
      };

    case "SET_TOUCHED":
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.name]: true,
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

/* -------------------- Custom useForm Hook -------------------- */
function useForm(initialValues, validate) {
  const initialState = useMemo(
    () => ({
      values: initialValues,
      errors: {},
      touched: {},
    }),
    [initialValues]
  );

  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      dispatch({
        type: "INPUT_CHANGE",
        name,
        value,
        error: validate(name, value),
      });
    },
    [validate]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;

      dispatch({ type: "SET_TOUCHED", name });
      dispatch({
        type: "INPUT_CHANGE",
        name,
        value,
        error: validate(name, value),
      });
    },
    [validate]
  );

  const validateAll = useCallback(
    (values) => {
      const errors = {};
      Object.entries(values).forEach(([name, value]) => {
        errors[name] = validate(name, value);
      });
      return errors;
    },
    [validate]
  );

  const handleSubmit = useCallback(
    (callback) => (e) => {
      e.preventDefault();

      const errors = validateAll(state.values);
      dispatch({ type: "SET_ERRORS", errors });

      const hasErrors = Object.values(errors).some(Boolean);
      if (hasErrors) return;

      callback(state.values);
    },
    [state.values, validateAll]
  );

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET", initialState });
  }, [initialState]);

  const isValid = useMemo(() => {
    return (
      Object.values(state.errors).every((e) => !e) &&
      Object.values(state.values).every((v) => String(v).trim() !== "")
    );
  }, [state.errors, state.values]);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isValid,
  };
}

/* -------------------- Login Component -------------------- */
export default function LoginForm() {
  const validate = useCallback((name, value) => {
    const v = String(value ?? "").trim();

    if (name === "email") {
      if (!v) return "Email is required";
      if (!/^\S+@\S+\.\S+$/.test(v)) return "Invalid email address";
      return "";
    }

    if (name === "password") {
      if (!v) return "Password is required";
      if (v.length < 6)
        return "Password must be at least 6 characters";
      return "";
    }

    return "";
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
  } = useForm(
    { email: "", password: "" },
    validate
  );

  const onSubmit = useCallback((data) => {
    console.log("Login Data:", data);
    alert("Login Successful!");
    resetForm();
  }, [resetForm]);

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2 style={{ color: "#5C6AC4" }}>Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && touched.email && (
            <div style={{ color: "red" }}>{errors.email}</div>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.password && touched.password && (
            <div style={{ color: "red" }}>{errors.password}</div>
          )}
        </div>

        <button type="submit" disabled={!isValid}>
          Login
        </button>
      </form>
    </div>
  );
}
