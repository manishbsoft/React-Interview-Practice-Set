import React, { useState, useCallback, useMemo } from 'react';

function App() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const styles = {
    main: { padding: '20px' },
    title: { color: '#5C6AC4' }
  };

  const rules = useMemo(() => ({
    email: (v) => {
      if (!v.trim()) return "Email is required!";
      if (!/^\S+@\S+\.\S+$/.test(v)) return "Invalid email!";
      return null;
    },
    password: (v) => {
      if (!v.trim()) return "Password is required!";
      if (v.length < 6) return "Min 6 characters!";
      return null;
    }
  }), []);

  const validateField = useCallback((name, value) => {
    const error = rules[name]?.(value) || null;
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  }, [rules]);

  const validateForm = useCallback(() => {
    let hasError = false;

    Object.keys(form).forEach(key => {
      const err = validateField(key, form[key]);
      if (err) hasError = true;
    });

    return hasError;
  }, [form, validateField]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  }, [validateField]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  }, [validateField]);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!validateForm()) {
      alert("Login Successful!");
      console.log(form);
    }
  }, [validateForm, form]);

  return (
    <div style={styles.main}>
      <h1 style={styles.title}>Hello, World!</h1>

      <form onSubmit={onSubmit} noValidate>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.email && errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.password && errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default App;
