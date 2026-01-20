import React, { useState } from 'react';

function App() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const styles = {
    main: { padding: '20px' },
    title: { color: '#5C6AC4' }
  };

  const validateField = (name, value) => {
    let error = null;

    switch (name) {
      case 'email':
        if (!value.trim()) error = "Email is required!";
        else if (!/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email!";
        break;

      case 'password':
        if (!value.trim()) error = "Password is required!";
        else if (value.length < 6) error = "Min 6 characters!";
        break;

      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const validateForm = () => {
    let hasError = false;

    Object.keys(form).forEach(key => {
      const err = validateField(key, form[key]);
      if (err) hasError = true;
    });

    return hasError;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setTouched({ email: true, password: true });

    if (!validateForm()) {
      alert("Login Successful!");
      console.log(form);
    }
  };

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
