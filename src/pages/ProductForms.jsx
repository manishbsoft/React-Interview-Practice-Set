import React, { useState, useReducer, useCallback, useMemo } from "react";

function ProductForms() {
  const [products, setProducts] = useState([]);

  // -------------------------
  // Memoized products (restored)
  // -------------------------
  const sortedProducts = useMemo(() => {
    return [...products];
  }, [products]);

  // =================================
  // STYLES OBJECT
  // =================================
  const styles = {
    container: {
      maxWidth: "650px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      marginBottom: "6px",
      fontWeight: "bold",
    },
    input: {
      padding: "10px",
      width: "100%",
      boxSizing: "border-box",
      border: "1px solid #ccc",
      borderRadius: "5px",
      outline: "none",
    },
    errorInput: {
      border: "1px solid red",
    },
    errorText: {
      color: "red",
      marginTop: "5px",
      fontSize: "13px",
    },
    buttonRow: {
      display: "flex",
      gap: "10px",
      marginTop: "10px",
    },
    button: {
      padding: "10px 16px",
      border: "none",
      cursor: "pointer",
      background: "#007bff",
      color: "white",
      borderRadius: "5px",
    },
    buttonDisabled: {
      background: "#999",
      cursor: "not-allowed",
    },
    resetButton: {
      padding: "10px 16px",
      background: "#eee",
      border: "1px solid #ccc",
      cursor: "pointer",
      borderRadius: "5px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "25px",
    },
    th: {
      padding: "10px",
      textAlign: "left",
      background: "#f1f1f1",
      borderBottom: "1px solid #ddd",
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #ddd",
    },
  };

  // =================================
  // Reducer
  // =================================
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
            [action.name]: action.error ?? "",
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
        return { ...state, errors: action.errors };

      case "RESET":
        return action.initialState;

      default:
        return state;
    }
  };

  // =================================
  // useForm Hook
  // =================================
  const useForm = (initialValues, validate) => {
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

        const hasError = Object.values(errors).some((err) => err);
        if (hasError) return;

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
  };

  // =================================
  // VALIDATIONS
  // =================================
  const validate = useCallback((name, value) => {
    const v = String(value ?? "").trim();

    // NAME
    if (name === "name") {
      if (!v) return "Name is required";
      if (v.length < 3) return "Name must be at least 3 characters";
      return "";
    }

    // QUANTITY (must be whole number, min 1)
    if (name === "quantity") {
      if (!v) return "Quantity is required";

      // not a number?
      if (isNaN(v)) return "Quantity must be a number";

      const num = Number(v);

      // decimal? whole number check
      if (!Number.isInteger(num)) return "Quantity must be a whole number";

      if (num < 1) return "Quantity must be at least 1";

      return "";
    }

    // PRICE (must be positive number, max 2 decimals)
    if (name === "price") {
      if (!v) return "Price is required";

      if (isNaN(v)) return "Price must be a valid number";

      const num = Number(v);

      if (num <= 0) return "Price must be greater than 0";

      // allow max two decimals without regex
      const decimalPart = v.split(".")[1];
      if (decimalPart && decimalPart.length > 2)
        return "Max 2 decimals allowed";

      return "";
    }

    return "";
  }, []);

  // =================================
  // useForm init
  // =================================
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isValid,
  } = useForm({ name: "", quantity: "", price: "" }, validate);

  const onSubmit = useCallback(
    (data) => {
      // normalize values before adding
      const normalized = {
        name: String(data.name).trim(),
        quantity: parseInt(String(data.quantity).trim(), 10),
        price: parseFloat(String(data.price).trim()),
      };

      setProducts((prev) => [...prev, normalized]);
      resetForm();
    },
    [resetForm]
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Product Management</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* NAME */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Name</label>
          <input
            type="text"
            name="name"
            value={values.name || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              ...styles.input,
              ...(errors.name && touched.name ? styles.errorInput : {}),
            }}
          />
          {errors.name && touched.name && (
            <div style={styles.errorText}>{errors.name}</div>
          )}
        </div>

        {/* QUANTITY */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={values.quantity || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              ...styles.input,
              ...(errors.quantity && touched.quantity ? styles.errorInput : {}),
            }}
          />
          {errors.quantity && touched.quantity && (
            <div style={styles.errorText}>{errors.quantity}</div>
          )}
        </div>

        {/* PRICE */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Price</label>
          <input
            type="text"
            name="price"
            value={values.price || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              ...styles.input,
              ...(errors.price && touched.price ? styles.errorInput : {}),
            }}
          />
          {errors.price && touched.price && (
            <div style={styles.errorText}>{errors.price}</div>
          )}
        </div>

        {/* BUTTONS */}
        <div style={styles.buttonRow}>
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isValid ? {} : styles.buttonDisabled),
            }}
            disabled={!isValid}
          >
            Submit
          </button>

          <button type="button" style={styles.resetButton} onClick={resetForm}>
            Reset
          </button>
        </div>
      </form>

      {/* TABLE */}
      <table style={styles.table} border="1">
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.length === 0 ? (
            <tr>
              <td colSpan="3" style={styles.td} align="center">
                No products yet
              </td>
            </tr>
          ) : (
            sortedProducts.map((p, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>
                  {typeof p.price === "number" ? p.price.toFixed(2) : p.price}
                </td>
                <td style={styles.td}>{p.quantity}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductForms;
