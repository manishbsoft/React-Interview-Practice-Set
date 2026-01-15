import React, {
  useState,
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

/* -------------------- Custom Hook -------------------- */
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

/* -------------------- App Component -------------------- */
export default function App() {
  const [products, setProducts] = useState([]);

  const validate = useCallback((name, value) => {
    const v = String(value ?? "").trim();

    if (name === "name") {
      if (!v) return "Name is required";
      if (v.length < 3) return "Name must be at least 3 characters";
      return "";
    }

    if (name === "quantity") {
      if (!v) return "Quantity is required";
      const num = Number(v);
      if (Number.isNaN(num)) return "Quantity must be a number";
      if (num < 1) return "Quantity must be at least 1";
      return "";
    }

    if (name === "price") {
      if (!v) return "Price is required";
      const num = Number(v);
      if (Number.isNaN(num)) return "Price must be a number";
      if (num <= 0) return "Price must be greater than 0";
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
    { name: "", quantity: "", price: "" },
    validate
  );

  const onSubmit = useCallback(
    (data) => {
      setProducts((prev) => [...prev, data]);
      resetForm();
    },
    [resetForm]
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#5C6AC4" }}>React Form Handling</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Name */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.name && touched.name && (
            <div style={{ color: "red" }}>{errors.name}</div>
          )}
        </div>

        {/* Quantity */}
        <div>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={values.quantity}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.quantity && touched.quantity && (
            <div style={{ color: "red" }}>{errors.quantity}</div>
          )}
        </div>

        {/* Price */}
        <div>
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={values.price}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.price && touched.price && (
            <div style={{ color: "red" }}>{errors.price}</div>
          )}
        </div>

        <button type="submit" disabled={!isValid}>
          Submit
        </button>
      </form>

      <hr />

      <h3>Products</h3>
      <ul>
        {products.map((p, i) => (
          <li key={i}>
            {p.name} — {p.quantity} — ₹{p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
